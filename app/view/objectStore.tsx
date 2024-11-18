import { useState } from "react";
import ObjectStoreAll from "./objectStoreAll";

export default function ObjectStore({objectStore}: {objectStore: ObjectStoreAll}) {

    const [columns, setColumns] = useState<String[]>([]);
    
    let columnNames = columns.map(column => <th key={columns.indexOf(column)}>{column}</th>)
    
    objectStore.all.onsuccess = (event) => {
        console.log(objectStore.all.result)
        let result = objectStore.all.result;
        let cols = Object.keys(result[0])
        setColumns(cols);
    }

    return (
        <>
            {objectStore.name}
            <table>
                <thead>
                    <tr>
                        {columnNames}
                    </tr>
                </thead>
            </table>
        </>
    )
}