// website-template v1.2

import Link from "next/link";
import { NavLink } from "../link/navLink";
import { NameLink } from "../link/nameLink";

export default function Header({currentPage}: {currentPage?: string}) {

    const MAIN_TITLE = "Database Demo";
    
    const PAGES = [
        new NavLink("All Databases", "/"),
        new NameLink("View on Github", "https://github.com/shephardluke/database-demo"),
        new NameLink("Main Website", "https://shephardluke.co.uk")
    ]

    const pageLinks = PAGES.map(page => {
        const label = page.getLabel();
        if (currentPage == label) {
            return <div key={"currentPage"} className="underline header">{page.generateElement()}</div>
        } 
        return page.generateElement();
    })

    return (
        <div className="flex justify-between p-10 header">
            <Link className="basis-1/2 text-4xl" href={"/"}>{MAIN_TITLE}</Link>
            <div key={"links"} className="basis-1/2 flex justify-around header text-2xl">
                {pageLinks}
            </div>
        </div>

    )
}
