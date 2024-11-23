import { ReactNode } from "react";
import DeleteButton from "../buttons/deleteButton";

export default function Record({data}: {data: unknown[]}) {
    let keyCounter = -1
    return (
        <tr>
            {data.map((value) => {keyCounter += 1; return <td key={keyCounter} className="border">{value as ReactNode}</td>})}
        </tr>
    )
}