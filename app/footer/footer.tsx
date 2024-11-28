export default function Footer() { // Global footer
    const pk = require("../../package.json")
    return (
        <footer className="text-center">
            <hr></hr>
            <div className="p-10">
                <p>Version {pk.version}</p>
                <p>(Pre-release version, everything is subject to change and bugs or crashes may occur.)</p>
            </div>
        </footer>
    )
}