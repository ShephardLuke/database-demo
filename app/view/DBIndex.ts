export class DBIndex {
    id: number;
    name: string;
    isKey: boolean;

    constructor(id: number, name: string="", isKey: boolean=false) {
        this.id = id
        this.isKey = isKey;
        this.name = name;
    }
}