export default function Footer() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pk = require("../../package.json");
    const repo = "database-demo";
    return (
        <>
            <hr/>
            <div className="text-center p-10 flex justify-center gap-4">
            <p className="text-lg">{repo} v{pk.version}</p>
            <a className="font-bold underline text-lg text-link" href={"https://github.com/shephardluke/" + repo}>View on GitHub</a>
            </div>
        </>
    )
}