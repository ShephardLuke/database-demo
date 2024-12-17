'use client'

import WarningButton from "@/app/template/buttons/warningButton";
import { DataValue } from "./dataValue";
import { Index } from "..";
import { ReactNode } from "react";

export default function Record({indexOrderTypes, data, deleteRecord, showTypes}: {indexOrderTypes: Index[], data: {[key: string]: unknown}, deleteRecord: (data: {[key: string]: unknown}) => void, showTypes: boolean}) { // Displaying a single record (all values from the given object)
    let indexCounter = -1
    return (
        <tr>
            {indexOrderTypes.map((index) => 
                {
                    indexCounter += 1;
                    const value = new DataValue(data[index.getName()], index.getType());
                    if (value) { 
                        if (showTypes) {
                            return <td className="border-2" key={indexCounter}>{value.getValuePretty() as ReactNode}</td>
                        }
                        return <td className="border-2" key={indexCounter}>{value.getValue() as ReactNode}</td>
                    }
                    return <td className="border-2" key={indexCounter}></td>;
                }
            )}
            <td className="border-2">
                <WarningButton text="Delete Record" clicked={() => {deleteRecord(data)}}/>
            </td>
        </tr>
    )
}