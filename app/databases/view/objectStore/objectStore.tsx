import { DATA_TYPE, DataValue } from "./dataValue";

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

    constructor(name: string, idbRequest: IDBRequest) {
        this.name = name;
        this.source = idbRequest.source as IDBObjectStore;
        this.keys = [];
        this.indexes = [];
        this.records = [];
        this.metadata = {}

        idbRequest.onsuccess = () => {
            this.source = idbRequest.source as IDBObjectStore;
            this.keys = typeof this.source.keyPath == "string" ? [this.source.keyPath] : this.source.keyPath;
            this.indexes = [... this.source.indexNames];
            this.records = idbRequest.result;

            const metadata: DatabaseMetadata = JSON.parse(localStorage.getItem("database" + this.source.transaction.db.name) as string) as DatabaseMetadata
            const stored = metadata.objectStores[this.name];
            
            if (stored) {
                this.metadata = stored
            } else { // Means it was made pre v0.7.0
                console.warn("Object store " + this.name + " has no metadata, checking types and creating metadata...");

                const attributes: {[key: string]: DATA_TYPE} = {};

                for (const index of this.keys.concat(this.indexes)) { // tries to detect type by check if all records have the same type if not then string
                    if (this.records.length == 0) {
                        attributes[index] = DATA_TYPE.STRING;
                    } else {
                        let type = DataValue.decideType(String(this.records[0][index]));
                        for (let i = 1; i < this.records.length; i++ ) {
                            const currentType = DataValue.decideType(String(this.records[i][index]));
                            if (type === null) {
                                type = currentType;
                            } else if (currentType !== null && type != currentType) {
                                if (currentType !== DATA_TYPE.STRING && DataValue.canConvert(type, currentType)) {
                                    type = currentType;
                                    break;
                                }

                                type = DATA_TYPE.STRING;
                                break;
                            }
                        }
                        if (type && attributes[index] !== type) {
                            console.log(index + " -> " + type);
                        }
                        attributes[index] = type? type : DATA_TYPE.STRING;
                    }
                }
                const info: ObjectStoreMetadata = attributes; 

                // Convert old databases to 0.7.0 format
                for (const record of this.records) {
                    const recordKeys = Object.keys(record);
                    const recordValues = Object.values(record);

                    let changed = false;
                    for (let i = 0; i < recordValues.length; i++) {
                        const rec = String(recordValues[i]);
                        const value = DataValue.createFromString(recordValues[i] === null ? null : rec, attributes[recordKeys[i]]) as DataValue;
                        if (value.getValue() !== recordValues[i]) {
                            changed = true;
                        }
                    }
                    if(changed) {
                        const newRecord: {[key: string]: unknown} = {};
                        for (let i = 0; i < recordValues.length; i++) {
                            const value = String(recordValues[i]);
                            newRecord[recordKeys[i]] = (DataValue.createFromString(recordValues[i] === null ? null : value, attributes[recordKeys[i]]) as DataValue).getValue();
                        }
                        const path = this.keys.map(key => record[key]);
                        console.log("Updated types for record " + Object.values(record) + ".");
                        this.source.delete((path.length > 1 ? path : path[0]) as IDBValidKey);
                        this.source.add(newRecord);
                    }
                }

                this.metadata = info;

                metadata.objectStores[this.name] = info;

                localStorage.setItem("database" + this.source.transaction.db.name, JSON.stringify(metadata));

                console.log("Finished checks and created metadata.");

            }


        }

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
                const currentData = currentRecord[allIndexes[j]];
                output += currentData
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