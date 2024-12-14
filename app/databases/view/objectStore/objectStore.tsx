import { DATA_TYPE } from "./dataValue";

export type Metadata = {
    _version: string,
    name: string,
    attributes: {[key: string]: DATA_TYPE}
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pk = require("../../../../package.json");

export class ObjectStore { // Class to hold all of the info when requesting an object store
    private name: string
    private source: IDBObjectStore;
    private keys: string[];
    private indexes: string[];
    private records: {[key: string]: string}[];
    private metadata: Metadata

    constructor(name: string, idbRequest: IDBRequest) {
        this.name = name;
        this.source = idbRequest.source as IDBObjectStore;
        this.keys = [];
        this.indexes = [];
        this.records = [];
        this.metadata = {_version: "-1", name: "", attributes: {}};

        idbRequest.onsuccess = () => {
            this.source = idbRequest.source as IDBObjectStore;
            this.keys = typeof this.source.keyPath == "string" ? [this.source.keyPath] : this.source.keyPath;
            this.indexes = [... this.source.indexNames];
            this.records = idbRequest.result;

            const stored = localStorage.getItem(this.source.transaction.db.name + this.name);
            if (stored) {
                this.metadata = JSON.parse(stored);
            } else {
                console.warn("Metadata for object store " + this.name + " (" + this.source.transaction.db.name + ") not found. Creating new metadata...");
                const attributes: {[key: string]: DATA_TYPE} = {};
                for (const index of this.keys.concat(this.indexes)) {
                    attributes[index] = DATA_TYPE.ANY;
                }
                const info = {
                    "_version": pk.version,
                    "name": this.name,
                    "attributes": attributes
                }

                this.metadata = info;

                localStorage.setItem(this.source.transaction.db.name + this.name, JSON.stringify(info));
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