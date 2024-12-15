export enum DATA_TYPE {
    STRING = "STRING",
    INT = "INT",
    FLOAT = "FLOAT",
}


export class DataValue {

    private value: unknown;
    private type: DATA_TYPE | null;

    private constructor(value: unknown, type: DATA_TYPE | null) {
        if (value === undefined) {
            value = null;
        }
        console.log(value, "a"); // 0 TURNS INTO NOTHING?
        this.value = value
        this.type = type;
        if (this.type == DATA_TYPE.STRING && this.type.trim() == "") {
            this.value = null;
            this.type = null;
        }
    }

    public static createFromString(value: string, type: DATA_TYPE) {
        if (value.trim() == "") {
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

    
    public static decideType(value: string) {
        if (value === null) {
            return null;
        }


        if (value === String(Math.floor(Number(value)))) {
            return DATA_TYPE.INT
        }
        if (!isNaN(Number(value))) {
            return DATA_TYPE.FLOAT
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
        return this.value ? this.value : "";
    }

    getValuePretty(toString: boolean = false) {
        // const type = this.getType();
        // if (this.value === null) {
        //     return "NULL";
        // }
        // if (type == DATA_TYPE.STRING || toString) {
        //     if (this.value[0] != "'" || this.value[this.value.length - 1] != "'") {
        //         return "'" + this.value + "'";
        //     }
        // }

        return this.value;

    }
}