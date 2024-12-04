// website-shared v1.1

export class NameLink {
    private label: string;
    private link: string;
    
    constructor(label: string, link: string) {
        this.label = label;
        this.link = link;
    }

    getLabel() {
        return this.label;
    }
    
    getLink() {
        return this.link;
    }

    generateElement(): JSX.Element {
        return <a key={this.getLabel()} className="text-2xl" href={this.getLink()}>{this.getLabel()}</a>
    }
}
