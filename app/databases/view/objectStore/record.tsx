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
                    return <td key={indexCounter} className="border-2">
                        {(showTypes ? 
                        new DataValue(data[index.getName()]).getValuePretty(index.getType() == DATA_TYPE.STRING)
                        :
                        new DataValue(data[index.getName()]).getValue()) as ReactNode}
                        </td>
                }
            )}
            <td className="border-2">
                <WarningButton text="Delete Record" clicked={() => {deleteRecord(data)}}/>
            </td>
        </tr>
    )
}