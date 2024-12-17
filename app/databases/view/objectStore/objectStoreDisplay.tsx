// Displays one object store based on the given request

import { useEffect, useState } from "react";
import Record from "./record";
import DatabaseInput from "../input/databaseInput";
import SuccessMessage from "@/app/message/successMessage";
import { ObjectStore } from "./objectStore";
import { saveAs } from "file-saver";
import SubmitButton from "@/app/template/buttons/submitButton";
import WarningButton from "@/app/template/buttons/warningButton";
import { DataValue } from "./dataValue";
import { Index } from "..";

export default function ObjectStoreDisplay({objectStore, deleteObjectStore}: {objectStore: ObjectStore, deleteObjectStore: (name: string) => void}) { // Deleting itself requires parent to give method as parent needs to delete this from array etc

    const [creationMessage, setCreationMessage] = useState<{success: boolean, text: string}>()
    const keys = objectStore.getKeys();
    const indexes = objectStore.getIndexes();
    const [records, setRecords] = useState<{[key: string]: unknown}[]>([]);

    const [showTypes, setShowTypes] = useState(true);

    const metadata = objectStore.getMetadata();

    const indexOrder = [... keys, ...indexes]; // Eventually can possibly be rearranged by the user to whatever they pick
    
    const headings = indexOrder.map(index => <th key={indexOrder.indexOf(index)} className={"border-solid"}><span className={keys.includes(index) ? " underline" : ""}>{index}</span>{showTypes ? " (" + metadata[index] + ")" : null}</th>)
    headings.push(<th key={"-1"} className="border-solid">Option</th>)

    const inputs = []; // Add inputs for adding a new record
    for (const index of indexOrder) {
        inputs.push(<td className="border-2" key={index}><DatabaseInput id={"input" + objectStore.getName() + index} placeholder={"Enter " + index + "..."}/></td>)
    }

    useEffect(() => {
        setRecords(objectStore.getRecords());
    }, [objectStore])


    const recordRows = records.map(record => <Record key={Object.values(record).toString()} deleteRecord={deleteRecord} indexOrderTypes={indexOrder.map(index => new Index(index, metadata[index]))} data={record} showTypes={showTypes}/>) // bug if record has 2 indexes same data (will cause same keys)#=

    recordRows.push(
        <tr className="border-2" key={recordRows.length}>
            {inputs}
            <td><SubmitButton key={"new"} text="Create Record" clicked={newRecord}/></td>
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
    
            const newData: {[key: string]: unknown} = {}
            const types = indexOrder.map(index => metadata[index]);

            for (let i = 0; i < indexOrder.length; i++) {

                const element = document.getElementById("input" + name + indexOrder[i]) as HTMLInputElement;
                const value: string | null = element.value;
                const dataValue = DataValue.createFromString(value, types[i]);
                if (dataValue == false) {
                    setCreationMessage({success: false, text: "Index " + indexOrder[i] + " must be a value of type " + types[i] + ", got " + DataValue.decideType(value) + "."});
                    return;
                }
                if (dataValue.isNull() && dbObjectStore.autoIncrement && keys.includes(indexOrder[i])) {
                    continue;
                }
                if (dataValue.isNull() && keys.includes(indexOrder[i])) {
                    setCreationMessage({success: false, text: "Key " + indexOrder[i] + " must contain at least 1 non-space character."});
                    return;
                }
                
                newData[indexOrder[i]] = dataValue.getValue();
 
            }
    
            const newRequest = dbObjectStore.add(newData)
            newRequest.onsuccess = (event) => {
                if (dbObjectStore.autoIncrement) { // Needs more work
                    newData[keys[0]] = (event.target as IDBRequest).result;
                }
                const newRecords = [... records, newData]
                objectStore.setRecords(newRecords);
                setRecords(newRecords);
            }
            
            transaction.onerror = (event) => {
                if ((event.target as IDBRequest).error?.name == "ConstraintError") {
                    setCreationMessage({success: false, text: ("A record already exists with the same " + (keys.length > 1? "keys." : "key."))})
                } else {
                    setCreationMessage({success: false, text: "Record creation failed due to " + (event.target as IDBRequest).error?.name})
                }
                db.close();
            }

            transaction.oncomplete = () => {
                db.close()
                setCreationMessage({success: true, text: "Record created."})
            }
        }

    }

    function deleteRecord(record: {[key: string]: unknown}) { // Removes record from database and internal array
        const request = openDatabase();

        request.onsuccess = () => {
            const name = objectStore.getName();
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const dbObjectStore = transaction.objectStore(name);

            let toDelete: IDBValidKey = [];

            if (keys.length == 1) {
                toDelete = record[keys[0]] as IDBValidKey;
            } else {
                for (const key of keys) {
                    toDelete.push(record[key] as IDBValidKey)
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

    function createCSV() {
        const file = new Blob([objectStore.toCSV()], {type: "text/plain"});
        saveAs(file, objectStore.getName() + ".csv");
    }

    return (
        <div>
            <p className="text-xl font-bold underline pb-5">{objectStore.getName()}</p>

            <div className="flex gap-4 justify-center">
                <WarningButton text="Delete Object Store" clicked={() => deleteObjectStore(objectStore.getName())}/>
                <SubmitButton text="Export to CSV" clicked={createCSV}/>
            </div>
            <div className="pt-5">
                <label htmlFor="showTypes">Show Types: </label>
                <input defaultChecked={true} type="checkbox" id="showTypes" onChange={() => {setShowTypes(!showTypes)}}/>
            </div>
            <>
                <div className="p-5 overflow-x-auto">
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