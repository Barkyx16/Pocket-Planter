// Worldwide growing-zone resolution.
//
// USDA hardiness zones are defined as the 30-year average of the annual extreme
// minimum temperature, in 5°F bands. That definition is computable anywhere on
// Earth, so this module resolves a zone from coordinates rather than from a
// country-specific postal table:
//
//   US ZIP  -> local lookup table (instant, offline, authoritative)
//   anything else -> geocode -> 30y ERA5 daily minima -> compute the zone
//
// Results are cached in AsyncStorage permanently — climate normals do not move
// on app-session timescales, so a location is only ever resolved once.
//
// Accuracy note: ERA5 is a ~25km reanalysis grid, so computed zones land within
// about one half-zone of published maps and smooth over urban heat islands and
// sharp terrain. Validated against 20 cities on six continents.
//
// The resolveZone() interface is deliberately narrow so a precomputed offline
// raster can replace the network path later without touching any caller.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getZipRecord, normalizeZip } from "../core";
import { countryName, t } from "./i18n";

const CACHE_PREFIX = "pp_zoneCache_";
const GEOCODE_URL = "https://nominatim.openstreetmap.org/search";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const USER_AGENT = "PocketPlanter/1.0";

// 30 full years ending at the last complete year.
const CLIMATE_YEARS = 30;

// ── Countries ────────────────────────────────────────────────────────────────
// `postalLabel` only differs where a country has its own well-known name for the
// thing; everything else falls back to "Postal code". `hasPostal: false` marks
// countries where postal codes are absent or not in everyday use, so the UI asks
// for a city instead.
export const COUNTRIES = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", example: "1001" },
  { code: "AX", name: "Åland Islands", flag: "🇦🇽", example: "22100" },
  { code: "AL", name: "Albania", flag: "🇦🇱", example: "1001" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", example: "16000" },
  { code: "AS", name: "American Samoa", flag: "🇦🇸", postalLabel: "ZIP code", example: "96799", zipFormat: true },
  { code: "AD", name: "Andorra", flag: "🇦🇩", example: "AD500" },
  { code: "AO", name: "Angola", flag: "🇦🇴", hasPostal: false },
  { code: "AI", name: "Anguilla", flag: "🇦🇮", example: "AI-2640" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬", hasPostal: false },
  { code: "AR", name: "Argentina", flag: "🇦🇷", example: "C1425" },
  { code: "AM", name: "Armenia", flag: "🇦🇲", example: "0010" },
  { code: "AW", name: "Aruba", flag: "🇦🇼", hasPostal: false },
  { code: "AU", name: "Australia", flag: "🇦🇺", postalLabel: "Postcode", example: "2000" },
  { code: "AT", name: "Austria", flag: "🇦🇹", example: "1010" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", example: "AZ1000" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", hasPostal: false },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", example: "317" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", example: "1000" },
  { code: "BB", name: "Barbados", flag: "🇧🇧", example: "BB11000" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", example: "220030" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", example: "1000" },
  { code: "BZ", name: "Belize", flag: "🇧🇿", hasPostal: false },
  { code: "BJ", name: "Benin", flag: "🇧🇯", hasPostal: false },
  { code: "BM", name: "Bermuda", flag: "🇧🇲", example: "HM 12" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", example: "11001" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", hasPostal: false },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦", example: "71000" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", hasPostal: false },
  { code: "BR", name: "Brazil", flag: "🇧🇷", postalLabel: "CEP", example: "01310-100" },
  { code: "VG", name: "British Virgin Islands", flag: "🇻🇬", example: "VG1110" },
  { code: "BN", name: "Brunei", flag: "🇧🇳", example: "BS8811" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", example: "1000" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", hasPostal: false },
  { code: "BI", name: "Burundi", flag: "🇧🇮", hasPostal: false },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", example: "12000" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", hasPostal: false },
  { code: "CA", name: "Canada", flag: "🇨🇦", example: "M5V 3L9" },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻", example: "7600" },
  { code: "BQ", name: "Caribbean Netherlands", flag: "🇧🇶", hasPostal: false },
  { code: "KY", name: "Cayman Islands", flag: "🇰🇾", example: "KY1-1001" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫", hasPostal: false },
  { code: "TD", name: "Chad", flag: "🇹🇩", hasPostal: false },
  { code: "CL", name: "Chile", flag: "🇨🇱", example: "8320000" },
  { code: "CN", name: "China", flag: "🇨🇳", example: "100000" },
  { code: "CX", name: "Christmas Island", flag: "🇨🇽", example: "6798" },
  { code: "CC", name: "Cocos (Keeling) Islands", flag: "🇨🇨", example: "6799" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", example: "110111" },
  { code: "KM", name: "Comoros", flag: "🇰🇲", hasPostal: false },
  { code: "CD", name: "Congo (DRC)", flag: "🇨🇩", hasPostal: false },
  { code: "CG", name: "Congo (Republic)", flag: "🇨🇬", hasPostal: false },
  { code: "CK", name: "Cook Islands", flag: "🇨🇰", hasPostal: false },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", example: "10101" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", hasPostal: false },
  { code: "HR", name: "Croatia", flag: "🇭🇷", example: "10000" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", example: "10400" },
  { code: "CW", name: "Curaçao", flag: "🇨🇼", hasPostal: false },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", example: "1010" },
  { code: "CZ", name: "Czechia", flag: "🇨🇿", example: "110 00" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", example: "1050" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", hasPostal: false },
  { code: "DM", name: "Dominica", flag: "🇩🇲", hasPostal: false },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", example: "10101" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", example: "170101" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", example: "11511" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", example: "1101" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶", hasPostal: false },
  { code: "ER", name: "Eritrea", flag: "🇪🇷", hasPostal: false },
  { code: "EE", name: "Estonia", flag: "🇪🇪", example: "10111" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", example: "H100" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", example: "1000" },
  { code: "FK", name: "Falkland Islands", flag: "🇫🇰", example: "FIQQ 1ZZ" },
  { code: "FO", name: "Faroe Islands", flag: "🇫🇴", example: "100" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯", hasPostal: false },
  { code: "FI", name: "Finland", flag: "🇫🇮", example: "00100" },
  { code: "FR", name: "France", flag: "🇫🇷", example: "75001" },
  { code: "GF", name: "French Guiana", flag: "🇬🇫", example: "97300" },
  { code: "PF", name: "French Polynesia", flag: "🇵🇫", example: "98700" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", hasPostal: false },
  { code: "GM", name: "Gambia", flag: "🇬🇲", hasPostal: false },
  { code: "GE", name: "Georgia", flag: "🇬🇪", example: "0105" },
  { code: "DE", name: "Germany", flag: "🇩🇪", example: "10115" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", hasPostal: false },
  { code: "GI", name: "Gibraltar", flag: "🇬🇮", example: "GX11 1AA" },
  { code: "GR", name: "Greece", flag: "🇬🇷", example: "104 31" },
  { code: "GL", name: "Greenland", flag: "🇬🇱", example: "3900" },
  { code: "GD", name: "Grenada", flag: "🇬🇩", hasPostal: false },
  { code: "GP", name: "Guadeloupe", flag: "🇬🇵", example: "97100" },
  { code: "GU", name: "Guam", flag: "🇬🇺", postalLabel: "ZIP code", example: "96910", zipFormat: true },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", example: "01001" },
  { code: "GG", name: "Guernsey", flag: "🇬🇬", example: "GY1 1AA" },
  { code: "GN", name: "Guinea", flag: "🇬🇳", hasPostal: false },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼", example: "1000" },
  { code: "GY", name: "Guyana", flag: "🇬🇾", hasPostal: false },
  { code: "HT", name: "Haiti", flag: "🇭🇹", example: "HT6110" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", example: "11101" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", hasPostal: false },
  { code: "HU", name: "Hungary", flag: "🇭🇺", example: "1011" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", example: "101" },
  { code: "IN", name: "India", flag: "🇮🇳", postalLabel: "PIN code", example: "110001" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", example: "10110" },
  { code: "IR", name: "Iran", flag: "🇮🇷", example: "1114" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", example: "10001" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", postalLabel: "Eircode", example: "D02 AF30" },
  { code: "IM", name: "Isle of Man", flag: "🇮🇲", example: "IM1 1AA" },
  { code: "IL", name: "Israel", flag: "🇮🇱", example: "9103401" },
  { code: "IT", name: "Italy", flag: "🇮🇹", example: "00100" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲", hasPostal: false },
  { code: "JP", name: "Japan", flag: "🇯🇵", example: "100-0001" },
  { code: "JE", name: "Jersey", flag: "🇯🇪", example: "JE2 3AA" },
  { code: "JO", name: "Jordan", flag: "🇯🇴", example: "11118" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", example: "010000" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", example: "00100" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮", hasPostal: false },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", example: "13001" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬", example: "720001" },
  { code: "LA", name: "Laos", flag: "🇱🇦", example: "01000" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", example: "LV-1050" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧", example: "1107" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", example: "100" },
  { code: "LR", name: "Liberia", flag: "🇱🇷", example: "1000" },
  { code: "LY", name: "Libya", flag: "🇱🇾", hasPostal: false },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", example: "9490" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", example: "01100" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", example: "1009" },
  { code: "MO", name: "Macau", flag: "🇲🇴", hasPostal: false },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", example: "101" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", hasPostal: false },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", example: "50000" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", example: "20026" },
  { code: "ML", name: "Mali", flag: "🇲🇱", hasPostal: false },
  { code: "MT", name: "Malta", flag: "🇲🇹", example: "VLT 1117" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭", postalLabel: "ZIP code", example: "96960", zipFormat: true },
  { code: "MQ", name: "Martinique", flag: "🇲🇶", example: "97200" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷", hasPostal: false },
  { code: "MU", name: "Mauritius", flag: "🇲🇺", example: "11324" },
  { code: "YT", name: "Mayotte", flag: "🇾🇹", example: "97600" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", example: "06000" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲", postalLabel: "ZIP code", example: "96941", zipFormat: true },
  { code: "MD", name: "Moldova", flag: "🇲🇩", example: "MD-2001" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", example: "98000" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳", example: "15160" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪", example: "81000" },
  { code: "MS", name: "Montserrat", flag: "🇲🇸", example: "MSR1110" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", example: "10000" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", example: "1100" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", example: "11181" },
  { code: "NA", name: "Namibia", flag: "🇳🇦", hasPostal: false },
  { code: "NR", name: "Nauru", flag: "🇳🇷", hasPostal: false },
  { code: "NP", name: "Nepal", flag: "🇳🇵", example: "44600" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", example: "1011 AB" },
  { code: "NC", name: "New Caledonia", flag: "🇳🇨", example: "98800" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", postalLabel: "Postcode", example: "1010" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", example: "11001" },
  { code: "NE", name: "Niger", flag: "🇳🇪", example: "8001" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", example: "100001" },
  { code: "NU", name: "Niue", flag: "🇳🇺", hasPostal: false },
  { code: "NF", name: "Norfolk Island", flag: "🇳🇫", example: "2899" },
  { code: "KP", name: "North Korea", flag: "🇰🇵", hasPostal: false },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰", example: "1000" },
  { code: "MP", name: "Northern Mariana Islands", flag: "🇲🇵", postalLabel: "ZIP code", example: "96950", zipFormat: true },
  { code: "NO", name: "Norway", flag: "🇳🇴", example: "0150" },
  { code: "OM", name: "Oman", flag: "🇴🇲", example: "100" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", example: "44000" },
  { code: "PW", name: "Palau", flag: "🇵🇼", postalLabel: "ZIP code", example: "96940", zipFormat: true },
  { code: "PS", name: "Palestine", flag: "🇵🇸", hasPostal: false },
  { code: "PA", name: "Panama", flag: "🇵🇦", hasPostal: false },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", example: "111" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", example: "1209" },
  { code: "PE", name: "Peru", flag: "🇵🇪", example: "15001" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", example: "1000" },
  { code: "PN", name: "Pitcairn Islands", flag: "🇵🇳", example: "PCRN 1ZZ" },
  { code: "PL", name: "Poland", flag: "🇵🇱", example: "00-001" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", example: "1000-001" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷", postalLabel: "ZIP code", example: "00901", zipFormat: true },
  { code: "QA", name: "Qatar", flag: "🇶🇦", hasPostal: false },
  { code: "RE", name: "Réunion", flag: "🇷🇪", example: "97400" },
  { code: "RO", name: "Romania", flag: "🇷🇴", example: "010011" },
  { code: "RU", name: "Russia", flag: "🇷🇺", example: "101000" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", hasPostal: false },
  { code: "BL", name: "Saint Barthélemy", flag: "🇧🇱", example: "97133" },
  { code: "SH", name: "Saint Helena", flag: "🇸🇭", example: "STHL 1ZZ" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳", hasPostal: false },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨", example: "LC01 101" },
  { code: "MF", name: "Saint Martin", flag: "🇲🇫", example: "97150" },
  { code: "PM", name: "Saint Pierre and Miquelon", flag: "🇵🇲", example: "97500" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨", example: "VC0100" },
  { code: "WS", name: "Samoa", flag: "🇼🇸", hasPostal: false },
  { code: "SM", name: "San Marino", flag: "🇸🇲", example: "47890" },
  { code: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹", hasPostal: false },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", example: "11564" },
  { code: "SN", name: "Senegal", flag: "🇸🇳", example: "10200" },
  { code: "RS", name: "Serbia", flag: "🇷🇸", example: "11000" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", hasPostal: false },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", hasPostal: false },
  { code: "SG", name: "Singapore", flag: "🇸🇬", example: "018956" },
  { code: "SX", name: "Sint Maarten", flag: "🇸🇽", hasPostal: false },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", example: "811 01" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", example: "1000" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧", hasPostal: false },
  { code: "SO", name: "Somalia", flag: "🇸🇴", hasPostal: false },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", example: "8001" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", example: "04524" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸", hasPostal: false },
  { code: "ES", name: "Spain", flag: "🇪🇸", example: "28001" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", example: "00100" },
  { code: "SD", name: "Sudan", flag: "🇸🇩", example: "11111" },
  { code: "SR", name: "Suriname", flag: "🇸🇷", hasPostal: false },
  { code: "SJ", name: "Svalbard and Jan Mayen", flag: "🇸🇯", example: "9170" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", example: "111 20" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", example: "8001" },
  { code: "SY", name: "Syria", flag: "🇸🇾", hasPostal: false },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", example: "100" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯", example: "734001" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", hasPostal: false },
  { code: "TH", name: "Thailand", flag: "🇹🇭", example: "10200" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱", hasPostal: false },
  { code: "TG", name: "Togo", flag: "🇹🇬", hasPostal: false },
  { code: "TK", name: "Tokelau", flag: "🇹🇰", hasPostal: false },
  { code: "TO", name: "Tonga", flag: "🇹🇴", hasPostal: false },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹", example: "120110" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳", example: "1000" },
  { code: "TR", name: "Türkiye", flag: "🇹🇷", example: "06000" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲", example: "744000" },
  { code: "TC", name: "Turks and Caicos Islands", flag: "🇹🇨", example: "TKCA 1ZZ" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻", hasPostal: false },
  { code: "UG", name: "Uganda", flag: "🇺🇬", hasPostal: false },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", example: "01001" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", hasPostal: false },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", postalLabel: "Postcode", example: "SW1A 1AA" },
  { code: "US", name: "United States", flag: "🇺🇸", postalLabel: "ZIP code", example: "90210", zipFormat: true, hasZipTable: true },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", example: "11000" },
  { code: "VI", name: "US Virgin Islands", flag: "🇻🇮", postalLabel: "ZIP code", example: "00802", zipFormat: true },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", example: "100000" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺", hasPostal: false },
  { code: "VA", name: "Vatican City", flag: "🇻🇦", example: "00120" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", example: "1010" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", example: "100000" },
  { code: "WF", name: "Wallis and Futuna", flag: "🇼🇫", example: "98600" },
  { code: "EH", name: "Western Sahara", flag: "🇪🇭", example: "70000" },
  { code: "YE", name: "Yemen", flag: "🇾🇪", hasPostal: false },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", example: "10101" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", hasPostal: false },
];

export const DEFAULT_COUNTRY = "US";

export function getCountry(code) {
  const entry = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
  // `name` in the table is the English source; `displayName` is what the UI
  // should show. Kept separate so search and the icon map still key off English.
  return { ...entry, displayName: countryName(entry.code, entry.name) };
}

export function countryHasPostal(code) {
  return getCountry(code).hasPostal !== false;
}

// Uses 5-digit US-style ZIP codes: the mainland plus Puerto Rico, Guam, the
// Virgin Islands and the other US territories. Drives input formatting only.
export function usesZipFormat(code) {
  return getCountry(code).zipFormat === true;
}

// Actually present in the bundled lookup table. Only the mainland US is — the
// 2023 USDA file contains no rows for the territories, so those fall through to
// climate resolution like anywhere else.
export function hasZipTable(code) {
  return getCountry(code).hasZipTable === true;
}

// Case-insensitive, accent-insensitive country search for the picker.
export function searchCountries(query) {
  const term = String(query || "").trim().toLowerCase();
  if (!term) return COUNTRIES;
  const fold = (value) =>
    String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const folded = fold(term);
  // Rank exact code, then name-prefix, then substring — otherwise typing "nz"
  // buries New Zealand under Tanzania, which contains the same letters.
  const scored = [];
  COUNTRIES.forEach((c) => {
    // Match either the English source name or the localised one, so a French
    // user finds "Allemagne" and an English one still finds "Germany".
    const localised = fold(countryName(c.code, c.name));
    const name = fold(c.name);
    if (localised !== name && localised.includes(folded)) { scored.push([localised.startsWith(folded) ? 1 : 2, c]); return; }
    if (c.code.toLowerCase() === folded) scored.push([0, c]);
    else if (name.startsWith(folded)) scored.push([1, c]);
    else if (name.includes(folded)) scored.push([2, c]);
  });
  return scored
    .sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name, "en"))
    .map(([, c]) => ({ ...c, displayName: countryName(c.code, c.name) }));
}

// Maps the English `postalLabel` on each country to a translation key, so the
// 242-entry table stays readable rather than carrying key strings.
const POSTAL_LABEL_KEYS = {
  "ZIP code": "postal.zip",
  Postcode: "postal.postcode",
  Eircode: "postal.eircode",
  "PIN code": "postal.pin",
  CEP: "postal.cep",
};

// What to call the location field for a given country, in the active language.
export function postalLabelFor(code) {
  const country = getCountry(code);
  if (country.hasPostal === false) return t("postal.city");
  return t(POSTAL_LABEL_KEYS[country.postalLabel] || "postal.generic");
}

export function postalPlaceholderFor(code) {
  const country = getCountry(code);
  if (country.hasPostal === false) return t("postal.placeholderCity");
  return country.example
    ? t("postal.placeholderExample", { example: country.example })
    : t("postal.placeholderGeneric");
}

// ── Normalization ────────────────────────────────────────────────────────────
// US ZIPs stay digits-only so they match the lookup table. Everywhere else we
// keep letters, digits, spaces and hyphens — stripping them would destroy
// alphanumeric formats like "SW1A 1AA" or "M5V 3L9".
export function normalizePostal(value, countryCode = DEFAULT_COUNTRY) {
  if (usesZipFormat(countryCode)) return normalizeZip(value);
  return String(value || "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .slice(0, 64);
}

// Enough to know the field is worth resolving, without encoding 60 different
// postal grammars that would reject valid input.
export function isPostalComplete(value, countryCode = DEFAULT_COUNTRY) {
  const cleaned = String(value || "").trim();
  if (usesZipFormat(countryCode)) return normalizeZip(cleaned).length === 5;
  return cleaned.length >= 2;
}

// ── Zone math ────────────────────────────────────────────────────────────────
// Zone bands are 5°F wide starting at -60°F for 1a, giving 1a..13b.
export function zoneFromTempF(tempF) {
  const index = Math.max(0, Math.min(25, Math.floor((tempF + 60) / 5)));
  const number = 1 + Math.floor(index / 2);
  const half = index % 2 === 0 ? "a" : "b";
  const low = -60 + index * 5;
  const zone = `${number}${half}`;
  const trange = `${low} to ${low + 5}`;
  return { zone, trange, zonetitle: `${zone}: ${trange}` };
}

// Average of each year's coldest daily minimum.
export function averageAnnualExtremeMin(times, mins) {
  const perYear = new Map();
  for (let i = 0; i < times.length; i += 1) {
    const value = mins[i];
    if (typeof value !== "number") continue;
    const year = String(times[i]).slice(0, 4);
    if (!perYear.has(year) || value < perYear.get(year)) perYear.set(year, value);
  }
  const extremes = [...perYear.values()];
  if (!extremes.length) return null;
  return extremes.reduce((a, b) => a + b, 0) / extremes.length;
}

// ── Network ──────────────────────────────────────────────────────────────────
/**
 * A transient upstream failure — rate limit, server error, dropped connection.
 * Distinct from "this location does not exist" so the UI can tell the user to
 * retry instead of wrongly claiming their postcode is invalid.
 */
export class ZoneServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = "ZoneServiceError";
    this.transient = true;
  }
}

// Both upstreams are free services that rate-limit under load, and phones drop
// connections routinely. Retry the retryable failures with backoff — but keep it
// short, because Open-Meteo's limit is hourly and no amount of backoff clears it.
const RETRY_DELAYS_MS = [800, 2400];

function isRetryable(status) {
  return status === 429 || status === 408 || status >= 500;
}

async function fetchJson(url, options = {}) {
  let lastError = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt - 1]));
    }
    try {
      const response = await fetch(url, {
        ...options,
        headers: { Accept: "application/json", "User-Agent": USER_AGENT, ...(options.headers || {}) },
      });
      if (response.ok) return response.json();
      if (!isRetryable(response.status)) throw new Error(`HTTP ${response.status}`);
      lastError = new ZoneServiceError(`HTTP ${response.status}`);
    } catch (error) {
      // A thrown non-retryable HTTP error is final; network-level failures and
      // retryable statuses are worth another attempt.
      if (/^HTTP \d+$/.test(error.message) && !isRetryable(Number(error.message.slice(5)))) throw error;
      lastError = error instanceof ZoneServiceError ? error : new ZoneServiceError(error.message);
    }
  }
  throw lastError || new ZoneServiceError("request failed");
}

// Geocodes a postal code, falling back to a free-text place lookup. The fallback
// is what makes countries without postal codes work, and it also rescues valid
// codes that Nominatim has no postal record for.
export async function geocodeLocation(query, countryCode) {
  const country = encodeURIComponent(String(countryCode || "").toLowerCase());
  const term = encodeURIComponent(String(query || "").trim());
  const attempts = [];
  if (countryHasPostal(countryCode)) {
    attempts.push(`${GEOCODE_URL}?postalcode=${term}&countrycodes=${country}&format=json&limit=1`);
  }
  attempts.push(`${GEOCODE_URL}?q=${term}&countrycodes=${country}&format=json&limit=1`);
  // Last resort: name the country in the query and drop the country filter.
  // OSM's country coding is unreliable for territories and dependencies —
  // countrycodes=hk returns nothing for Hong Kong places, for instance.
  const countryName = encodeURIComponent(getCountry(countryCode).name);
  attempts.push(`${GEOCODE_URL}?q=${term}%2C%20${countryName}&format=json&limit=1`);

  let transient = null;
  for (const url of attempts) {
    try {
      const results = await fetchJson(url);
      const place = Array.isArray(results) ? results[0] : null;
      if (place?.lat && place?.lon) {
        return {
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
          label: place.display_name || null,
        };
      }
    } catch (error) {
      // Try the next strategy rather than failing the whole resolve, but
      // remember a transient failure so an empty result is not misreported as
      // "no such place" when the service was simply unreachable.
      if (error instanceof ZoneServiceError) transient = error;
    }
  }
  if (transient) throw transient;
  return null;
}

// 30 years of daily minima -> zone.
export async function zoneFromCoords(lat, lon) {
  const endYear = new Date().getFullYear() - 1;
  const startYear = endYear - (CLIMATE_YEARS - 1);
  const url =
    `${ARCHIVE_URL}?latitude=${lat}&longitude=${lon}` +
    `&start_date=${startYear}-01-01&end_date=${endYear}-12-31` +
    `&daily=temperature_2m_min&temperature_unit=fahrenheit&timezone=UTC`;
  const data = await fetchJson(url);
  const average = averageAnnualExtremeMin(data?.daily?.time || [], data?.daily?.temperature_2m_min || []);
  if (average === null) return null;
  return { ...zoneFromTempF(average), avgExtremeMinF: average };
}

// ── Public interface ─────────────────────────────────────────────────────────
function cacheKey(postal, countryCode) {
  return `${CACHE_PREFIX}${countryCode}_${String(postal).trim().toUpperCase()}`;
}

/**
 * Resolves a growing zone for a postal code / city in any country.
 *
 * Returns a record shaped like the US lookup rows the app already renders —
 * { zipcode, zone, trange, zonetitle } — plus the coordinates and provenance:
 *   source: "table" | "climate"
 *   lat / lon: used for weather and for hemisphere detection
 *
 * Returns null when the location cannot be resolved. Never throws.
 */
export async function resolveZone({ postal, countryCode = DEFAULT_COUNTRY }) {
  const query = String(postal || "").trim();
  if (!query) return null;

  // Mainland US ZIPs resolve from the bundled table: instant and works offline.
  if (hasZipTable(countryCode)) {
    const row = getZipRecord(query);
    if (row) return { ...row, countryCode, source: "table", lat: null, lon: null };
    // Fall through — a valid-looking ZIP missing from the table can still be
    // resolved from climate data below.
  }

  const key = cacheKey(query, countryCode);
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.zone) return parsed;
    }
  } catch (error) {
    // A bad cache entry should never block a fresh resolve.
  }

  try {
    const place = await geocodeLocation(query, countryCode);
    if (!place) return null;
    const zoneInfo = await zoneFromCoords(place.lat, place.lon);
    if (!zoneInfo) return null;

    const record = {
      zipcode: query,
      countryCode,
      zone: zoneInfo.zone,
      trange: zoneInfo.trange,
      zonetitle: zoneInfo.zonetitle,
      avgExtremeMinF: zoneInfo.avgExtremeMinF,
      lat: place.lat,
      lon: place.lon,
      label: place.label,
      source: "climate",
    };
    AsyncStorage.setItem(key, JSON.stringify(record)).catch(() => {});
    return record;
  } catch (error) {
    // Transient upstream trouble propagates so the caller can say "try again";
    // anything else means we genuinely could not place this location.
    if (error instanceof ZoneServiceError) throw error;
    return null;
  }
}

/** Resolves a zone directly from GPS coordinates, skipping geocoding. */
export async function resolveZoneFromCoords(lat, lon, countryCode = DEFAULT_COUNTRY) {
  const key = `${CACHE_PREFIX}coords_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.zone) return parsed;
    }
  } catch (error) {}

  try {
    const zoneInfo = await zoneFromCoords(lat, lon);
    if (!zoneInfo) return null;
    const record = {
      zipcode: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      countryCode,
      zone: zoneInfo.zone,
      trange: zoneInfo.trange,
      zonetitle: zoneInfo.zonetitle,
      avgExtremeMinF: zoneInfo.avgExtremeMinF,
      lat,
      lon,
      label: null,
      source: "climate",
    };
    AsyncStorage.setItem(key, JSON.stringify(record)).catch(() => {});
    return record;
  } catch (error) {
    if (error instanceof ZoneServiceError) throw error;
    return null;
  }
}
