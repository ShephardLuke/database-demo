export enum DATA_TYPE {
    STRING = "STRING",
    INT = "INT",
    FLOAT = "FLOAT",
}


export class DataValue {

    private value: unknown;
    private type: DATA_TYPE | null;

    constructor(value: unknown, type: DATA_TYPE | null) {
        this.value = value
        this.type = type;
    }

    public static createFromString(value: string | null, type: DATA_TYPE) {
        if (value === null || value.trim() == "") {
            return new DataValue(null, null);
        }
        switch (type) {
            case DATA_TYPE.STRING:
                return new DataValue(value, DATA_TYPE.STRING);
            case DATA_TYPE.INT:
                if (value === String(Math.floor(Number(value)))) {
                    return new DataValue(Number(value), DATA_TYPE.INT);
                }
                return false;
            case DATA_TYPE.FLOAT:
                if (!isNaN(Number(value))) {
                    return new DataValue(Number(value), DATA_TYPE.FLOAT);
                }
                return false;
        }
    }

    public static canConvert(from: DATA_TYPE, to: DATA_TYPE) {
        if (from === to || to === DATA_TYPE.STRING) {
            return true;
        }

        switch (from) {
            case DATA_TYPE.INT:
                switch (to) {
                    case DATA_TYPE.FLOAT:
                        return true;
                }
        }
    }

    
    public static decideType(value: string | null) {
        if (value === null || value.trim() === "") {
            return null;
        }


        if (value === String(Math.floor(Number(value)))) {
            return DATA_TYPE.INT;
        }
        if (!isNaN(Number(value))) {
            return DATA_TYPE.FLOAT;
        }
        return DATA_TYPE.STRING;
    }

    isNull() {
        return this.value === null;
    }


    getType() { // Returns what type its value is
        return this.type;
    }

    getValue() {
        return this.value;
    }

    getValuePretty(): string | null {
        if (this.value === null) {
            return "NULL";
        }

        switch (this.type) {
            case DATA_TYPE.STRING:
                return "'" + this.value + "'";
            case DATA_TYPE.FLOAT:
                let s = String(this.value);
                if (!s.includes(".")) {
                    s = s + ".0";
                }
                return s;
            default:
                return String(this.value);
        }
    }
}