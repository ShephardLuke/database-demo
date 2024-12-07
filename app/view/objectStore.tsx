export class ObjectStore {
    private name: string
    private source: IDBObjectStore;
    private keys: string[];
    private indexes: string[];
    private records: {[key: string]: string}[];

    constructor(name: string, idbRequest: IDBRequest) {
        this.name = name;
        this.source = (idbRequest.source as IDBObjectStore);
        this.keys = [];
        this.indexes = [];
        this.records = [];


        idbRequest.onsuccess = () => {
            this.source = idbRequest.source as IDBObjectStore;
            this.keys = typeof this.source.keyPath == "string" ? [this.source.keyPath] : this.source.keyPath;
            this.indexes = [... this.source.indexNames];
            this.records = idbRequest.result;
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

}