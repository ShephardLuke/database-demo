export enum DATA_TYPE {
    STRING = "STRING",
    INT = "INT",
}


export class DataValue {

    private value: string | null;

    constructor(value: string | null) {
        this.value = value? value.trim() : null;
        if (this.value == "") {
            this.value = null;
        }
    }

    isType(type: DATA_TYPE) { // Changes type if requirements met
        return type == DATA_TYPE.STRING || type == this.getType();
    }

    isNull() {
        return this.value === null;
    }

    getType() {
        if (!isNaN(Number(this.value)) && this.value?.trim() != "") {
            return DATA_TYPE.INT;
        } else {
            return DATA_TYPE.STRING;
        }
    }

    getValue() {
        return this.value ? this.value : "";
    }

    getValuePretty(toString: boolean = false) {
        const type = this.getType();
        if (this.value === null) {
            return "NULL";
        }
        if (type == DATA_TYPE.STRING || toString) {
            if (this.value[0] != "'" || this.value[this.value.length - 1] != "'") {
                return "'" + this.value + "'";
            }
        }

        return this.value;

    }
}