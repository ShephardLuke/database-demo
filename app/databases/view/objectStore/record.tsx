import WarningButton from "@/app/template/buttons/warningButton";
import { DATA_TYPE, DataValue } from "./dataValue";
import { Index } from "..";

export default function Record({indexOrderTypes, data, deleteRecord, showTypes}: {indexOrderTypes: Index[], data: {[key: string]: string}, deleteRecord: (data: {[key: string]: string}) => void, showTypes: boolean}) { // Displaying a single record (all values from the given object)
    let indexCounter = -1
    return (
        <tr>
            {indexOrderTypes.map((index) => {indexCounter += 1; return <td key={indexCounter} className="border-2">{showTypes ? new DataValue(data[index.getName()]).getValuePretty(index.getType() == DATA_TYPE.STRING) : new DataValue(data[index.getName()]).getValue()}</td>})}
            <td className="border-2">
                <WarningButton text="Delete Record" clicked={() => {deleteRecord(data)}}/>
            </td>
        </tr>
    )
}