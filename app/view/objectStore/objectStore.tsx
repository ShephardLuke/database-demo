import storageAvailable from "../storageAvailable";
import { DATA_TYPE, DataValue } from "./dataValue";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pk = require("../../../package.json");

export type DatabaseMetadata = {
    _version: string,
    objectStores: {
        [key: string]: ObjectStoreMetadata
    }
}

export type ObjectStoreMetadata = {
    [key: string]: DATA_TYPE
}

export class ObjectStore { // Class to hold all of the info when requesting an object store
    private name: string
    private source: IDBObjectStore;
    private keys: string[];
    private indexes: string[];
    private records: {[key: string]: unknown}[];
    private metadata: ObjectStoreMetadata

    constructor(name: string, idbRequest: IDBRequest, customMetadata?: ObjectStoreMetadata) {
        this.name = name;
        this.source = idbRequest.source as IDBObjectStore;
        this.keys = [];
        this.indexes = [];
        this.records = [];
        this.metadata = {};

        idbRequest.onsuccess = () => {
            this.source = idbRequest.source as IDBObjectStore;
            this.keys = typeof this.source.keyPath == "string" ? [this.source.keyPath] : this.source.keyPath;
            this.indexes = [... this.source.indexNames];
            this.records = idbRequest.result;
            
            let databaseMetadata: DatabaseMetadata = {
                "_version": pk.version,
                "objectStores": {},
            }

            if (customMetadata !== undefined) {
                this.metadata = customMetadata;
                return;
            }

            const storage = storageAvailable("localStorage");
            if (storage) {
                databaseMetadata = JSON.parse(localStorage.getItem("database" + this.source.transaction.db.name) as string) as DatabaseMetadata
                if (databaseMetadata === null) {
                    databaseMetadata = {
                        "_version": pk.version,
                        "objectStores": {},
                    };
                }
            }


            
            if (storage && databaseMetadata.objectStores[this.name] != null) { // Metadata exists, update if needed
                this.metadata = databaseMetadata.objectStores[this.name];
                if (databaseMetadata._version == pk.version) {
                    return;
                }

                console.warn(this.name + " is from a different database version (" + databaseMetadata._version + "). Attempting to update...")

                let updated = false;
                switch (databaseMetadata._version) { // Updates
                    case ("0.7.0-alpha.2"):
                        const mKeys = Object.keys(this.metadata)
                        const mValues = Object.values(this.metadata);
                        for (let i = 0; i <= mValues.length; i++) {
                            if (String(mValues[i]) === "INT") {
                                this.metadata[mKeys[i]] = DATA_TYPE.INTEGER;
                            }
                        }
                        this.updateRecords();
                        updated = true;
                        break;
                }
                
                if (updated) {
                    console.log("Updated " + this.name + ": " + databaseMetadata._version + " -> " + pk.version)
                } else {
                    console.warn("Failed to update: " + this.name + " was last in a newer/unknown version (" + databaseMetadata._version + "), problems may occur.")
                }

            } else { // No metadata, create new metadata (all strings)
                console.warn("Object store " + this.name + " has no metadata, creating metadata...");
                const types: ObjectStoreMetadata = {};
                for (const index of this.keys.concat(this.indexes)) {
                    types[index] = DATA_TYPE.STRING;
                }
                this.metadata = types;

                if (storage) {
                    databaseMetadata.objectStores[this.name] = types;
        
                    localStorage.setItem("database" + this.source.transaction.db.name, JSON.stringify(databaseMetadata));   
                }

                this.updateRecords();

                console.log("Finished creating metadata for " + this.name + ".");

            }


        }

    }

    // Method that auto detects types, probably will be removed.
    // detectTypes() {
    //     const attributes: {[key: string]: DATA_TYPE} = {};

    //     for (const index of this.keys.concat(this.indexes)) { // tries to detect type by check if all records have the same type if not then string
    //         if (this.records.length == 0) {
    //             attributes[index] = DATA_TYPE.STRING;
    //         } else {
    //             let type = DataValue.decideType(String(this.records[0][index]));
    //             for (let i = 0; i < this.records.length; i++ ) {
    //                 const currentType = DataValue.decideType(String(this.records[i][index]));
    //                 if (type === null) {
    //                     type = currentType;
    //                 } 
    //                 else if (currentType !== null && type !== currentType && currentType !== DATA_TYPE.STRING) {
    //                     if (DataValue.canConvert(type, currentType)) {
    //                         type = currentType;
    //                     }

    //                     type = DATA_TYPE.STRING;
    //                 }
    //             }
    //             if (type !== null && attributes[index] !== type) {
    //                 console.log(index + " -> " + type);
    //             }
    //             attributes[index] = type? type : DATA_TYPE.STRING;
    //         }
    //     }
    //     const info: ObjectStoreMetadata = attributes; 

    //     return info;

    // }

    updateRecords() {
        // Convert unknown databases to current format
        for (const record of this.records) {
            const recordKeys = Object.keys(record);
            const recordValues = Object.values(record);

            let changed = false;
            for (let i = 0; i < recordValues.length; i++) {
                const rec = String(recordValues[i]);
                const value = DataValue.createFromString(recordValues[i] === null ? null : rec, this.metadata[recordKeys[i]]) as DataValue;
                if (value.getValue() !== recordValues[i]) {
                    changed = true;
                }
            }
            if(changed) {
                this.regenerateRecord(record);
            }
        }
    }

    regenerateRecord(record: {[key: string]: unknown}) {
        const recordKeys = Object.keys(record);
        const recordValues = Object.values(record);
        const newRecord: {[key: string]: unknown} = {};
        for (let i = 0; i < recordValues.length; i++) {
            const value = String(recordValues[i]);
            newRecord[recordKeys[i]] = (DataValue.createFromString(recordValues[i] === null ? null : value, this.metadata[recordKeys[i]]) as DataValue).getValue();
        }
        const path = this.keys.map(key => record[key]);
        console.log("Regenerated record '" + Object.values(record) + "'.");
        this.source.delete((path.length > 1 ? path : path[0]) as IDBValidKey);
        this.source.add(newRecord);
    }

    setRecords(records: {[key: string]: unknown}[]) {
        this.records = records;
    }

    getName() {
        return this.name;
    }

    getSource() {
        return this.source;
    }

    getRecords() {
        return this.records;
    }
    
    getKeys() {
        return this.keys;
    }

    getIndexes() {
        return this.indexes;
    }

    toCSV() {
        let output = "";

        const allIndexes = this.keys.concat(this.indexes);
        for (let i = 0; i < allIndexes.length; i++) {
            const currentIndex = allIndexes[i];
            output += currentIndex;
            if (i < allIndexes.length - 1) {
                output += ",";
            }
        }

        output += "\n";

        for (let i = 0; i < this.records.length; i++) {
            const currentRecord = this.records[i];
            for (let j = 0; j < allIndexes.length; j++) {
                const currentData = new DataValue(currentRecord[allIndexes[j]], this.metadata[allIndexes[j]]);
                output += currentData.getValuePretty()
                if (j < allIndexes.length - 1) {
                    output += ",";
                }

            }

            if (i < this.records.length - 1) {
                output += "\n";
            }
        }
        
        return output;
    }

    getMetadata() {
        return this.metadata;
    }

}