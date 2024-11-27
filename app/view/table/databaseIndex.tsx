import { ReactNode } from "react";

export default function DatabaseIndex({text}: {text: unknown}) {
    return (
        <th className="border-4">{text as ReactNode}</th>
    )
}