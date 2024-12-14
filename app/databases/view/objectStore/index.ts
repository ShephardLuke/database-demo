import { DATA_TYPE } from "./dataValue";

export class Index {
    private name: string
    private type: DATA_TYPE;

    constructor(name: string, type: DATA_TYPE) {
        this.name = name;
        this.type = type;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }
}