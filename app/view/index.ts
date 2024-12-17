import { DATA_TYPE } from "./objectStore/dataValue";

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

    setName(name: string) {
        this.name = name;
    }

    setType(type: DATA_TYPE) {
        this.type = type;
    }
}