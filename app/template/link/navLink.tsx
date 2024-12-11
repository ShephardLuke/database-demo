// website-template v1.2

import Link from "next/link"
import { NameLink } from "./nameLink"
import React from "react"

export class NavLink extends NameLink {
    constructor(label: string, customLink?: string) {
        super(label, customLink ? customLink : "/" + label.toLowerCase().replace(" ", "-"))
    }    

    generateElement(): React.JSX.Element {
        return <Link key={this.getLabel()} href={this.getLink()}>{this.getLabel()}</Link>
    }
}