// Displays one object store based on the given request

import { useEffect, useState } from "react";
import Record from "./record";
import PrimaryButton from "../buttons/primaryButton";
import DeleteButton from "../buttons/deleteButton";
import DatabaseInput from "./table/databaseInput";

export default function ObjectStoreDisplay({idbRequest, deleteObjectStore}: {idbRequest: IDBRequest<any[]>, deleteObjectStore: Function}) { // Deleting itself requires parent to give method as parent needs to delete this from array etc

    const [keys, setKeys] = useState<string[]>([]);
    const [indexes, setIndexes] = useState<string[]>([]);
    const [data, setData] = useState<object[]>([]);

    let indexOrder = [... keys, ...indexes]; // Eventually can possibly be rearranged by the user to whatever they pick

    let headings = indexOrder.map(index => <th key={indexOrder.indexOf(index)} className={"border-solid border-4" + (keys.includes(index) ? " underline" : "")}>{index}</th>)
    headings.push(<th key={"-1"} className="border-solid border-4">Option</th>)

    let recordRows = data.map(record => <Record key={"record"+(record as any)[keys[0]]} deleteRecord={deleteRecord} indexOrder={indexOrder} data={record}/>) // bug if record has 2 indexes same data (will cause same keys)#=

    let inputs = []; // Add inputs for adding a new record
    for (let index of indexOrder) {
        inputs.push(<td className="border-2" key={index}><DatabaseInput id={"input" + (idbRequest.source as IDBObjectStore).name + index} placeholder={"Enter " + index + "..."}/></td>)
    }

    recordRows.push(
        <tr className="border-2" key={recordRows.length}>
            {inputs}
            <td><PrimaryButton key={"new"} text="New Record" clicked={newRecord}></PrimaryButton></td>
        </tr>
    )

    //deleteButtons.push()
    
    useEffect(() => { // Get keys, indexes and records from given request
        idbRequest.onsuccess = (event) => {
            let result = idbRequest.result;
            let source = idbRequest.source as IDBObjectStore
            let indexes = [... source.indexNames];
    
            
            setKeys(typeof source.keyPath == "string" ? [source.keyPath] : source.keyPath)
            setIndexes(indexes)
            setData(result);
        }
    
    }, [])

    function openDatabase() { // Opens database from request
        let source = idbRequest.source as IDBObjectStore
        const request = window.indexedDB.open(source.transaction.db.name);

        request.onerror = (event) => {
            console.error(event)
        }
        
        return request;
    }

    function newRecord() { // Adds a new record to the database and internal array
        const request = openDatabase();

        request.onsuccess = (event) => {
            let name = (idbRequest.source as IDBObjectStore).name
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const objectStore = transaction.objectStore(name);
    
            let newData: any = {}
            let sourceName = (idbRequest.source as IDBObjectStore).name;
            for (let i = 0; i < indexOrder.length; i++) {
                let element = document.getElementById("input" + sourceName + indexOrder[i]) as HTMLInputElement;
                newData[indexOrder[i]] = element.value
            }
    
            const newRequest = objectStore.add(newData)
            newRequest.onsuccess = (event) => {
                setData([...data, newData])
            }

            transaction.oncomplete = (event) => {
                db.close()
            }
        }

    }

    function deleteRecord(record: any) { // Removes record from database and internal array
        const request = openDatabase();

        request.onsuccess = (event) => {
            let name = (idbRequest.source as IDBObjectStore).name
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const objectStore = transaction.objectStore(name);

            let toDelete: IDBValidKey = [];

            if (keys.length == 1) {
                toDelete = record[keys[0]];
            } else {
                for (let key of keys) {
                    toDelete.push(record[key])
                }
            }

            objectStore.delete(toDelete)

            transaction.oncomplete = () => {
                let newData = [... data];
                newData.splice(data.indexOf(record), 1);
                db.close()
                setData(newData)
            }
        }
    }

    return (
        <div className="mt-40 pb-10">
            <p className="text-xl font-bold underline">{(idbRequest.source as IDBObjectStore).name}</p>
            <div className="flex justify-center">
                <DeleteButton classAdd="flex-1 max-w-40" text="Delete Object Store" clicked={() => deleteObjectStore((idbRequest.source as IDBObjectStore).name)}/>
            </div>
            <div className="flex">
                <table className="table-fixed w-full">
                    <thead className="h-2">
                        <tr>
                            {headings}
                        </tr>
                    </thead>
                    <tbody>
                        {recordRows}
                    </tbody>
                </table>
            </div>
        </div>
    )
}