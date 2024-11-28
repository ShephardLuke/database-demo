import { ReactNode } from "react";

export default function DatabaseIndexDisplay({text}: {text: unknown}) {
    return (
        <th className="p-4">{text as ReactNode}</th>
    )
}