export default function Footer() {
    let pk = require("../../package.json")
    return (
        <footer className="text-center">
            <hr></hr>
            <p>Version {pk.version}</p>
        </footer>
    )
}