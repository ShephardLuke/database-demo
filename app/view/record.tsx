import { ReactNode } from "react";
import DeleteButton from "../buttons/deleteButton";

export default function Record({indexOrder, data, deleteRecord}: {indexOrder: string[], data: any, deleteRecord: Function}) { // Displaying a single record (all values from the given object)
    let indexCounter = -1
    return (
        <tr>
            {indexOrder.map((index) => {indexCounter += 1; return <td key={indexCounter} className="border-2">{data[index]}</td>})}
            <td className="border-2">
                <DeleteButton text="Delete Record" clicked={() => {deleteRecord(data)}}/>
            </td>
        </tr>
    )
}