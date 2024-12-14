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
    private records: {[key: string]: string}[];
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
                const attributes: {[key: string]: DATA_TYPE} = {};

                for (const index of this.keys.concat(this.indexes)) { // tries to detect type by check if all records have the same type if not then string
                    if (this.records.length == 0) {
                        attributes[index] = DATA_TYPE.STRING;
                    } else {
                        let type = new DataValue(this.records[0][index]).getType();
                        for (let i = 1; i < this.records.length; i++ ) {
                            const currentValue = new DataValue(this.records[i][index])
                            const recordType = currentValue.getType()
                            if (currentValue.getValue() != "NULL" && currentValue.getValue() != "" && type != recordType) {
                                type = DATA_TYPE.STRING;
                                break;
                            }
    
                        }
                        attributes[index] = type;
                    }
                }
                const info: ObjectStoreMetadata = attributes; 

                // Convert old databases to 0.7.0 format
                for (const record of this.records) {
                    const recordKeys = Object.keys(record);
                    const recordValues = Object.values(record);
                    for (let i = 0; i < recordValues.length; i++) {
                        if (recordValues[i] == "NULL") {
                            const path = this.keys.map(key => record[key]);
                            this.source.delete(path.length > 1 ? path : path[0]);
                            record[recordKeys[i]] = "";
                            this.source.add(record)
                        }
                    }
                }

                this.metadata = info;

                metadata.objectStores[this.name] = info;

                localStorage.setItem("database" + this.source.transaction.db.name, JSON.stringify(metadata));

                console.warn("Object store " + this.name + " was made in a version before v0.7.0 and has been converted.");

            }


        }

    }

    setRecords(records: {[key: string]: string}[]) {
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