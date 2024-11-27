export default function Footer() { // Global footer
    const pk = require("../../package.json")
    return (
        <footer className="text-center">
            <hr></hr>
            <p className="pt-10">Version {pk.version}</p>
            <p>(Pre-release version, everything is subject to change and bugs or crashes may occur.)</p>
        </footer>
    )
}