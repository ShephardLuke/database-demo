'use client'

import WarningButton from "@/app/template/buttons/warningButton";
import { DATA_TYPE, DataValue } from "./dataValue";
import { Index } from "..";
import { ReactNode } from "react";

export default function Record({indexOrderTypes, data, deleteRecord, showTypes}: {indexOrderTypes: Index[], data: {[key: string]: unknown}, deleteRecord: (data: {[key: string]: unknown}) => void, showTypes: boolean}) { // Displaying a single record (all values from the given object)
    let indexCounter = -1
    return (
        <tr>
            {indexOrderTypes.map((index) => 
                {
                    indexCounter += 1;
                    let value = new DataValue(data[index.getName()], index.getType());
                    if (value.getType() == DATA_TYPE.STRING && value.getValue() === "") {
                        console.warn("record " + "'" + Object.values(data) + "'" + " contains an empty string, which is deprecated and will be read as null. Use null instead.");
                        value = new DataValue(null, null);
                    }
                    if (value) { 
                        if (showTypes) {
                            return <td className="border-2" key={indexCounter}>{value.getValuePretty() as ReactNode}</td>
                        }
                        const v = value.getValue();
                        return <td className="border-2" key={indexCounter}>{v === null ? null : String(v)}</td>
                    }
                    return <td className="border-2" key={indexCounter}></td>;
                }
            )}
            <td className="border-2">
                <WarningButton clicked={() => {deleteRecord(data)}}>Delete Record</WarningButton>
            </td>
        </tr>
    )
}