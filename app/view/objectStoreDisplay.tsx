import { ReactNode, useState } from "react";
import ObjectStoreData from "./objectStoreData";

export default function ObjectStoreDisplay({objectStore}: {objectStore: ObjectStoreData}) {

    const [columns, setColumns] = useState<String[]>([]);
    const [records, setRecords] = useState<unknown[][]>([]);
    
    let columnHeadings = columns.map(column => <th key={columns.indexOf(column)} className="border-solid border-4">{column}</th>)
    let recordRows = records.map(record => <tr key={records.indexOf(record)}>{record.map(value => <td key={record.indexOf(value)} className="border">{value as ReactNode}</td>)}</tr>)
    
    objectStore.all.onsuccess = (event) => {
        console.log(objectStore.all.result)
        let result = objectStore.all.result;
        let colNames = Object.keys(result[0])
        let rows = result.map(record => Object.values(record))
        setColumns(colNames);
        setRecords(rows);
    }

    return (
        <>
            {objectStore.name}
            <table className="table-fixed w-full">
                <thead>
                    <tr>
                        {columnHeadings}
                    </tr>
                </thead>
                <tbody>
                    {recordRows}
                </tbody>
            </table>
        </>
    )
}