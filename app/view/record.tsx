import { ReactNode } from "react";

export default function Record({data}: {data: unknown[]}) {
    return (
        <tr>
            {data.map(value => <td key={data.indexOf(value)} className="border">{value as ReactNode}</td>)}
        </tr>
    )
}