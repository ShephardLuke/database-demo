export default function Footer() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pk = require("../../package.json");
    const repo = "database-demo";
    return (
        <>
            <hr/>
            <div className="text-center p-10">
                <a className="font-bold underline text-xl" href={"https://github.com/shephardluke/" + repo}>View on GitHub</a>
                <p className="text-lg">{repo} v{pk.version}</p>
            </div>
        </>
    )
}