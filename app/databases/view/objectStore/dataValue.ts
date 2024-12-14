export enum DATA_TYPE {
    ANY = "ANY",
    STRING = "STRING",
    INT = "INT",
    NULL = "NULL",
}


export class DataValue {

    private value: unknown;
    private type: DATA_TYPE;

    constructor(value: unknown) {
        this.value = value;
        this.type = DATA_TYPE.ANY;

        if (value === null) {
            this.type = DATA_TYPE.NULL;
        } else if (String(value) === value) {
            this.type = DATA_TYPE.STRING;
        } else if (Number(value) === value) {
            this.type = DATA_TYPE.INT;
        }

    }

    isType(type: DATA_TYPE) {
        if (type == DATA_TYPE.ANY || this.value === null) {
            return true;
        }
        return this.type == type;
    }

    getValue() {
        return this.value;
    }
}