import { ReactNode } from "react";

export default function Record({indexOrder, data}: {indexOrder: string[], data: any}) { // Displaying a single record (all values from the given object)
    let indexCounter = -1
    return (
        <tr>
            {indexOrder.map((index) => {indexCounter += 1; return <td key={indexCounter} className="border-2">{data[index]}</td>})}
        </tr>
    )
}