import Link from "next/link";

export default function Header({home}: {home?: boolean}) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pk = require("../../package.json");
    const repo = pk.name;
    return (
        <>
        <div className="flex justify-between p-10 bg-dark-blue">
            <Link className="basis-1/2 text-4xl" href={"/"}>Database Demo</Link>
            <div className="basis-1/2 text-2xl flex justify-around items-center">
                <Link className={home == true ? "underline" : ""} href={"/"}>All Databases</Link>
                <a href={"https://github.com/shephardluke/" + repo}>View on GitHub</a>
                <a href="https://shephardluke.co.uk">Main Website</a>
            </div>
        </div>
        </>
    )
}