// Displays one object store based on the given request

import { useEffect, useState } from "react";
import Record from "./record/record";
import PrimaryButton from "../../buttons/primaryButton";
import DeleteButton from "../../buttons/deleteButton";
import DatabaseInput from "../input/databaseInput";
import SuccessMessage from "@/app/messages/successMessage";

export default function ObjectStoreDisplay({idbRequest, deleteObjectStore}: {idbRequest: IDBRequest<{[key: string]: string}[]>, deleteObjectStore: (name: string) => void}) { // Deleting itself requires parent to give method as parent needs to delete this from array etc

    const [keys, setKeys] = useState<string[]>([]);
    const [indexes, setIndexes] = useState<string[]>([]);
    const [data, setData] = useState<{[key: string]: string}[]>([]);
    const [creationMessage, setCreationMessage] = useState<{success: boolean, text: string}>()

    const indexOrder = [... keys, ...indexes]; // Eventually can possibly be rearranged by the user to whatever they pick

    const headings = indexOrder.map(index => <th key={indexOrder.indexOf(index)} className={"border-solid" + (keys.includes(index) ? " underline" : "")}>{index}</th>)
    headings.push(<th key={"-1"} className="border-solid">Option</th>)

    const recordRows = data.map(record => <Record key={Object.values(record).toString()} deleteRecord={deleteRecord} indexOrder={indexOrder} data={record}/>) // bug if record has 2 indexes same data (will cause same keys)#=

    const inputs = []; // Add inputs for adding a new record
    for (const index of indexOrder) {
        inputs.push(<td className="border-2" key={index}><DatabaseInput id={"input" + (idbRequest.source as IDBObjectStore).name + index} placeholder={"Enter " + index + "..."}/></td>)
    }

    recordRows.push(
        <tr className="border-2" key={recordRows.length}>
            {inputs}
            <td><PrimaryButton key={"new"} text="Create Record" clicked={newRecord}></PrimaryButton></td>
        </tr>
    )

    //deleteButtons.push()
    
    useEffect(() => { // Get keys, indexes and records from given request
        idbRequest.onsuccess = () => {
            const result = idbRequest.result;
            const source = idbRequest.source as IDBObjectStore
            const indexes = [... source.indexNames];
    
            
            setKeys(typeof source.keyPath == "string" ? [source.keyPath] : source.keyPath)
            setIndexes(indexes)
            setData(result);
        }
    
    }, [idbRequest])

    function openDatabase() { // Opens database from request
        const source = idbRequest.source as IDBObjectStore
        const request = window.indexedDB.open(source.transaction.db.name);

        request.onerror = (event) => {
            console.error(event)
        }
        
        return request;
    }

    function newRecord() { // Adds a new record to the database and internal array
        const request = openDatabase();

        request.onsuccess = () => {
            const name = (idbRequest.source as IDBObjectStore).name
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const objectStore = transaction.objectStore(name);
    
            const newData: {[key: string]: string} = {}
            const sourceName = (idbRequest.source as IDBObjectStore).name;
            for (let i = 0; i < indexOrder.length; i++) {
                const element = document.getElementById("input" + sourceName + indexOrder[i]) as HTMLInputElement;
                newData[indexOrder[i]] = element.value
            }
    
            const newRequest = objectStore.add(newData)
            newRequest.onsuccess = () => {
                setData([...data, newData])
            }
            
            transaction.onerror = (event) => {
                if ((event.target as IDBRequest).error?.name == "ConstraintError") {
                    setCreationMessage({success: false, text: ("A record already exists with the same " + (keys.length > 1? "keys." : "key."))})
                } else {
                    setCreationMessage({success: false, text: "Record creation failed."})
                }
            }

            transaction.oncomplete = () => {
                db.close()
                setCreationMessage({success: true, text: "Record created."})
            }
        }

    }

    function deleteRecord(record: {[key: string]: string}) { // Removes record from database and internal array
        const request = openDatabase();

        request.onsuccess = () => {
            const name = (idbRequest.source as IDBObjectStore).name
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const objectStore = transaction.objectStore(name);

            let toDelete: IDBValidKey = [];

            if (keys.length == 1) {
                toDelete = record[keys[0]];
            } else {
                for (const key of keys) {
                    toDelete.push(record[key])
                }
            }

            objectStore.delete(toDelete)

            transaction.oncomplete = () => {
                const newData = [... data];
                newData.splice(data.indexOf(record), 1);
                db.close()
                setData(newData)
            }
        }

        if (creationMessage != undefined) {
            setCreationMessage(undefined);
        }
    }

    return (
        <div className="mt-40 pb-10">
            <p className="text-xl font-bold underline">{(idbRequest.source as IDBObjectStore).name}</p>
            <div className="flex justify-center">
                <DeleteButton classAdd="flex-1 max-w-40" text="Delete Object Store" clicked={() => deleteObjectStore((idbRequest.source as IDBObjectStore).name)}/>
            </div>
            <div className="p-10">
                <table className="table-fixed w-full border-4">
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
            <SuccessMessage success={creationMessage?.success} text={creationMessage?.text}/>
        </div>
    )
}