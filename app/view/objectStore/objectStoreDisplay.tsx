// Displays one object store based on the given request

import { useEffect, useState } from "react";
import Record from "./record/record";
import PrimaryButton from "../../buttons/primaryButton";
import DeleteButton from "../../buttons/deleteButton";
import DatabaseInput from "../input/databaseInput";
import SuccessMessage from "@/app/messages/successMessage";
import { ObjectStore } from "../objectStore";

export default function ObjectStoreDisplay({objectStore, deleteObjectStore}: {objectStore: ObjectStore, deleteObjectStore: (name: string) => void}) { // Deleting itself requires parent to give method as parent needs to delete this from array etc

    const [creationMessage, setCreationMessage] = useState<{success: boolean, text: string}>()

    const keys = objectStore.getKeys();
    const indexes = objectStore.getIndexes();
    const [records, setRecords] = useState<{[key: string]: string}[]>([]);

    const indexOrder = [... keys, ...indexes]; // Eventually can possibly be rearranged by the user to whatever they pick

    const headings = indexOrder.map(index => <th key={indexOrder.indexOf(index)} className={"border-solid" + (keys.includes(index) ? " underline" : "")}>{index}</th>)
    headings.push(<th key={"-1"} className="border-solid">Option</th>)

    const inputs = []; // Add inputs for adding a new record
    for (const index of indexOrder) {
        inputs.push(<td className="border-2" key={index}><DatabaseInput id={"input" + objectStore.getName() + index} placeholder={"Enter " + index + "..."}/></td>)
    }

    useEffect(() => {
        setRecords(objectStore.getRecords());
    }, [objectStore])


    const recordRows = records.map(record => <Record key={Object.values(record).toString()} deleteRecord={deleteRecord} indexOrder={indexOrder} data={record}/>) // bug if record has 2 indexes same data (will cause same keys)#=

    recordRows.push(
        <tr className="border-2" key={recordRows.length}>
            {inputs}
            <td><PrimaryButton key={"new"} text="Create Record" clicked={newRecord}></PrimaryButton></td>
        </tr>
    )

    function openDatabase() { // Opens database from request
        const request = window.indexedDB.open(objectStore.getSource().transaction.db.name);

        request.onerror = (event) => {
            console.error(event)
        }
        
        return request;
    }

    function newRecord() { // Adds a new record to the database and internal array
        const request = openDatabase();

        request.onsuccess = () => {
            const name = objectStore.getName()
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const dbObjectStore = transaction.objectStore(name);
    
            const newData: {[key: string]: string} = {}

            for (let i = 0; i < indexOrder.length; i++) {
                const element = document.getElementById("input" + name + indexOrder[i]) as HTMLInputElement;
                if (element.value.trim() == "") {
                    if (keys.includes(indexOrder[i])) {
                        setCreationMessage({success: false, text: "Keys cannot be empty."})
                        return;
                    }
                    newData[indexOrder[i]] = "NULL";
                } else {
                    newData[indexOrder[i]] = element.value
                }
 
            }
    
            const newRequest = dbObjectStore.add(newData)
            newRequest.onsuccess = () => {
                const newRecords = [... records, newData]
                setRecords(newRecords);
                objectStore.setRecords(newRecords);
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
            const name = objectStore.getName();
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const dbObjectStore = transaction.objectStore(name);

            let toDelete: IDBValidKey = [];

            if (keys.length == 1) {
                toDelete = record[keys[0]];
            } else {
                for (const key of keys) {
                    toDelete.push(record[key])
                }
            }

            dbObjectStore.delete(toDelete)

            transaction.oncomplete = () => {
                const newRecords = [...records];
                newRecords.splice(newRecords.indexOf(record), 1);
                setRecords(newRecords)
                objectStore.setRecords(newRecords);
                db.close()
            }
        }

        if (creationMessage != undefined) {
            setCreationMessage(undefined);
        }
    }

    return (
        <div>
            <p className="text-xl font-bold underline">{objectStore.getName()}</p>
            <DeleteButton classAdd="flex-1 max-w-40" text="Delete Object Store" clicked={() => deleteObjectStore(objectStore.getName())}/>
            <>
                <div className="p-10 overflow-x-auto">
                    <table className="table-fixed border-4">
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
            </>
        </div>
    )
}