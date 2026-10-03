import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBatchedReader } from "./batchedReader";

// One reader for the whole app, so App's startup reads and the cards a tab
// mounts at the same moment share a multiGet.
export const readStored = createBatchedReader(AsyncStorage);
