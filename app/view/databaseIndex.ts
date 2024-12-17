import { Index } from ".";
import { DATA_TYPE } from "./objectStore/dataValue";

export class DatabaseIndex extends Index {
    private id: number;
    private isKey: boolean;

    constructor(id: number, name: string="", isKey: boolean=false, type: DATA_TYPE=DATA_TYPE.STRING, ) {
        super(name, type)
        this.id = id
        this.isKey = isKey;
    }

    getId() {
        return this.id;
    }

    getIsKey() {
        return this.isKey;
    }

    setIsKey(isKey: boolean) {
        this.isKey = isKey;
    }
}