// website-shared v1.1

export default function Footer() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pk = require("../../package.json");
    const repo = pk.name;
    return (
        <>
            <div className="text-center p-10 flex justify-center gap-4 bg-darkest-blue">
            <p className="text-lg">{repo} v{pk.version}</p>
            </div>
        </>
    )
}
