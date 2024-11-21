import { ReactNode, useEffect, useState } from "react";
import ObjectStoreData from "./objectStoreData";
import Record from "./record";

export default function ObjectStoreDisplay({db, name}: {db: IDBDatabase, name: string}) {

    const [keys, setKeys] = useState<string[]>([]);
    const [indexes, setIndexes] = useState<string[]>([]);
    const [data, setData] = useState<unknown[][]>([]);

    useEffect(() => {
        const transaction = db.transaction([name]);
        const objectStore = transaction.objectStore(name);

        const request = objectStore.getAll()
        request.onsuccess = (event) => {
            console.log(request.result)
            let result = request.result;
            let source = request.source as IDBObjectStore
            let indexes = [... source.indexNames];
    
            
            setKeys(typeof source.keyPath == "string" ? [source.keyPath] : source.keyPath)
            setIndexes(indexes)
            setData(result.map(data => Object.values(data)));
        }
    
    }, [])
    

    
    let indexHeadings = indexes.map(index => <th key={indexes.indexOf(index)} className="border-solid border-4">{index}</th>)
    let keyHeadings = keys.map(key => <th key={keys.indexOf(key)} className={`border-solid border-4 underline`}>{key}</th>)

    let recordRows = data.map(record => <Record key={data.indexOf(record)} data={record}/>) // bug if record has 2 indexes same data (will cause same keys)
    
    function newRecord() {
        const transaction = db.transaction([name], "readwrite")
        const objectStore = transaction.objectStore(name);

        let newData: any = {}
        for (let i = 0; i < indexes.length; i++) {
            newData[indexes[i]] = prompt(indexes[i]) as string;
        }
        const request = objectStore.add(newData)
        request.onsuccess = (event) => {
            let newArr = Object.values(newData) as unknown[]
            newArr.push(request.result as string)
            setData([...data, newArr])
        }

    }

    return (
        <div className="mt-10 border-4">
            {name}
            <table className="table-fixed w-full">
                <thead>
                    <tr>
                        {indexHeadings}
                        {keyHeadings}
                    </tr>
                </thead>
                <tbody>
                    {recordRows}
                </tbody>
            </table>
            <button className="bg-blue-500 hover:bg-blue-400 p-2 m-5" onClick={newRecord}>Insert New Record</button>
        </div>
    )
}