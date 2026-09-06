const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));
const zr = require(path.join(ROOT, "lib/zoneResolver.js"));

describe("zoneMatch", () => {
  it("respects the half-zone, which citrus depends on", () => {
    // A plant rated 8b does not survive 8a — five degrees colder.
    eq(core.zoneMatch("8a", "8b", "10b"), false);
    eq(core.zoneMatch("8b", "8b", "10b"), true);
    eq(core.zoneMatch("9a", "9b", "11b"), false);
    eq(core.zoneMatch("9b", "9b", "11b"), true);
    eq(core.zoneMatch("10a", "10b", "11b"), false);
  });
  it("reads a bare bound as the whole zone", () => {
    // minZone 4 starts at 4a; maxZone 11 runs through 11b.
    eq(core.zoneMatch("4a", "4", "11"), true);
    eq(core.zoneMatch("11b", "9b", "11"), true);
    eq(core.zoneMatch("3b", "4", "11"), false);
  });
  it("keeps ordinary ranges intact", () => {
    for (const z of ["5a", "5b", "7a", "9a", "9b"]) eq(core.zoneMatch(z, "5a", "9b"), true, z);
    for (const z of ["4b", "10a"]) eq(core.zoneMatch(z, "5a", "9b"), false, z);
  });
  it("rejects unparseable input rather than guessing", () => {
    eq(core.zoneMatch("", "5a", "9b"), false);
    eq(core.zoneMatch("7a", null, "9b"), false);
    eq(core.zoneMatch("7a", "5a", "abc"), false);
  });
});

describe("zoneFromTempF", () => {
  it("agrees with the USDA table", () => {
    eq(zr.zoneFromTempF(-60).zone, "1a");
    eq(zr.zoneFromTempF(-55).zone, "1b");
    eq(zr.zoneFromTempF(-50).zone, "2a");
    eq(zr.zoneFromTempF(0).zone, "7a");
    eq(zr.zoneFromTempF(5).zone, "7b");
    eq(zr.zoneFromTempF(35).zone, "10b");
    eq(zr.zoneFromTempF(40).zone, "11a");
  });
  it("puts every temperature inside the range it is labelled with", () => {
    for (let t = -70; t <= 70; t += 1) {
      const r = zr.zoneFromTempF(t);
      const [lo, hi] = r.trange.split(" to ").map(Number);
      ok(t >= lo - 10 && t <= hi + 10, `${t}F labelled ${r.zonetitle}`);
    }
  });
});

describe("getCountry", () => {
  it("falls back to the US, not to the first row of the table", () => {
    // COUNTRIES[0] is Afghanistan: no ZIP format, no bundled lookup table.
    for (const c of [undefined, null, "", "ZZ"]) {
      eq(zr.getCountry(c).code, "US", String(c));
      eq(zr.usesZipFormat(c), true, String(c));
      eq(zr.hasZipTable(c), true, String(c));
    }
  });
  it("ignores case and surrounding space", () => {
    eq(zr.getCountry("us").code, "US");
    eq(zr.getCountry("gb").code, "GB");
    eq(zr.getCountry(" gb ").code, "GB");
  });
});

describe("findCountry", () => {
  it("stays strict so the stored/cloud/detected guards still reject garbage", () => {
    eq(zr.findCountry("ZZ"), null);
    eq(zr.findCountry(""), null);
    eq(zr.findCountry(null), null);
    eq(zr.findCountry("gb").code, "GB");
  });
});

describe("parseFrostOverride", () => {
  const fmt = (d) => (d ? `${d.getMonth() + 1}-${d.getDate()}` : null);
  it("clamps a day that does not exist in that month", () => {
    // new Date(y, 1, 31) rolls into March; a typed "2-31" became a March frost.
    eq(fmt(core.parseFrostOverride("2-31")), "2-28");
    eq(fmt(core.parseFrostOverride("4-31")), "4-30");
    eq(fmt(core.parseFrostOverride("6-31")), "6-30");
    eq(fmt(core.parseFrostOverride("9-31")), "9-30");
  });
  it("keeps real dates and rejects impossible ones", () => {
    eq(fmt(core.parseFrostOverride("5-25")), "5-25");
    eq(fmt(core.parseFrostOverride("12-31")), "12-31");
    eq(core.parseFrostOverride("13-01"), null);
    eq(core.parseFrostOverride("0-5"), null);
    eq(core.parseFrostOverride("nonsense"), null);
    eq(core.parseFrostOverride(null), null);
  });
});

describe("flipDate", () => {
  it("never rolls into the next month", () => {
    core.setHemisphereFromLatitude(-33.87);
    const f = (iso) => {
      const d = core.flipDate(new Date(`${iso}T12:00:00`));
      return `${d.getMonth() + 1}-${d.getDate()}`;
    };
    eq(f("2026-01-31"), "7-31");
    eq(f("2026-03-31"), "9-30"); // September has 30 days, not 31
    eq(f("2026-08-31"), "2-28"); // used to come back as March 3
    eq(f("2026-12-31"), "6-30");
    eq(f("2026-05-25"), "11-25");
    core.setHemisphereFromLatitude(40.7);
  });
  it("is a no-op in the northern hemisphere", () => {
    const d = new Date("2026-03-31T12:00:00");
    eq(core.flipDate(d), d);
  });
});

describe("csvEscape", () => {
  const Q = '"';
  // Row breaks the way a real consumer sees them. Excel and the rest end a row on
  // CR, LF *or* CRLF, so an unquoted lone \r splits the row — which is the whole
  // reason csvEscape has to quote it. A parser that only breaks on \n would pass
  // the broken code too, and did.
  const parse = (text) => {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i];
      if (q) { if (c === Q) { if (text[i + 1] === Q) { cell += Q; i += 1; } else q = false; } else cell += c; }
      else if (c === Q) q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\r" || c === "\n") {
        if (c === "\r" && text[i + 1] === "\n") i += 1;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    row.push(cell); rows.push(row); return rows;
  };
  it("round-trips every character that can break a row", () => {
    const data = [
      ["Tomato", 'he said "hi"', "a,b"],
      ["Basil", "line1\nline2", "x"],
      ["Kale", "carriage\rreturn", "y"],   // a lone CR ends a row for Excel
      ["Mint", "crlf\r\nhere", "z"],
      ["Sage", "", null],
    ];
    const back = parse(core.buildCsv(["Plant", "Note", "Misc"], data));
    eq(back.length, data.length + 1, "row count");
    data.forEach((r, i) => r.forEach((c, j) => {
      eq(back[i + 1][j], c == null ? "" : String(c), `row ${i} col ${j}`);
    }));
  });
});
