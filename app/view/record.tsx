import { ReactNode } from "react";

export default function Record({data}: {data: object}) { // Displaying a single record (all values from the given object)
    let keyCounter = -1
    return (
        <tr>
            {Object.values(data).map((value) => {keyCounter += 1; return <td key={keyCounter} className="border-2">{value as ReactNode}</td>})}
        </tr>
    )
}