export default class ObjectStoreData {
    name: String;
    all: IDBRequest<any[]>;

    constructor(name: String, all: IDBRequest<any[]>) {
        this.name = name;
        this.all = all;
    }
}