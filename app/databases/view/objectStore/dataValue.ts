export enum DATA_TYPE {
    STRING = "STRING",
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    BOOLEAN = "BOOLEAN",
}


export class DataValue {

    private value: unknown;
    private type: DATA_TYPE | null;

    constructor(value: unknown, type: DATA_TYPE | null) {
        this.value = value
        this.type = type;
    }

    public static createFromString(value: string | null, type: DATA_TYPE) { // Takes a string and returns a new datavalue only if it can fit into the data type
        if (value === null || value.trim() == "") {
            return new DataValue(null, null);
        }
        switch (type) {
            case DATA_TYPE.STRING:
                return new DataValue(value, DATA_TYPE.STRING);
            case DATA_TYPE.INTEGER:
                if (value === String(Math.floor(Number(value)))) {
                    return new DataValue(Number(value), DATA_TYPE.INTEGER);
                }
                return false;
            case DATA_TYPE.FLOAT:
                if (!isNaN(Number(value))) {
                    return new DataValue(Number(value), DATA_TYPE.FLOAT);
                }
                return false;
            case DATA_TYPE.BOOLEAN:
                const v = value.trim().toLowerCase();
                if (v === "true" || v === "1") {
                    return new DataValue(1, DATA_TYPE.BOOLEAN)
                } else if (v === "false" || v === "0") {
                    return new DataValue(0, DATA_TYPE.BOOLEAN);
                }
                return false;
        }
    }

    // Old method might be deleted, ran from detect types from objectstore.tsx

    // public static canConvert(from: DATA_TYPE, to: DATA_TYPE) { // true if one type can be safely converted to another without any changes
    //     if (from === to || to === DATA_TYPE.STRING) {
    //         return true;
    //     }

    //     switch (from) {
    //         case DATA_TYPE.INTEGER:
    //             switch (to) {
    //                 case DATA_TYPE.FLOAT:
    //                     return true;
    //             }
    //         case DATA_TYPE.BOOLEAN:
    //             switch (to) {
    //                 case DATA_TYPE.INTEGER:
    //                     return true;
    //                 case DATA_TYPE.FLOAT:
    //                     return true;
    //             }
    //     }

    //     return false;
    // }

    
    public static decideType(value: string | null) { // Returns type for string, might be removed as all booleans can be ints and all ints can be floats. Only current used in ObjectStoreDisplay.tsx for an error message.
        if (value === null || value.trim() === "") {
            return null;
        }

        if (value.trim().toLowerCase() === "true" || value.trim().toLowerCase() === "false" || value === "0" || value === "1") {
            return DATA_TYPE.BOOLEAN;
        }
        
        if (value === String(Math.floor(Number(value)))) {
            return DATA_TYPE.INTEGER;
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

    getValuePretty(): string | null { // Returns a nicer looking value that shows its type eaiser.
        if (this.value === null) {
            return "null";
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
            case DATA_TYPE.BOOLEAN:
                if (this.value === 0) {
                    return "false";
                }
                return "true";
            default:
                return String(this.value);
        }
    }
}