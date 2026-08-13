import { dataStoreService, dataStore } from "./database.js";

declare global {
    var datastoreService: dataStoreService;
    var datastore: dataStore;
}

export async function setupGlobals() {
  const datastoreService = global.datastoreService = new dataStoreService(process.env.mongo ? process.env.mongo : ``, `ddc`);
  await datastoreService.connect();
  const datastore = global.datastore = datastoreService.getDataStore(`main`);
  return {datastoreService, datastore}
} 
