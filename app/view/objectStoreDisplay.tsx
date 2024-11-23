import { useEffect, useState } from "react";
import Record from "./record";
import PrimaryButton from "../buttons/primaryButton";
import DeleteButton from "../buttons/deleteButton";

export default function ObjectStoreDisplay({idbRequest, deleteObjectStore}: {idbRequest: IDBRequest<any[]>, deleteObjectStore: Function}) {

    const [keys, setKeys] = useState<string[]>([]);
    const [indexes, setIndexes] = useState<string[]>([]);
    const [data, setData] = useState<object[]>([]);

    useEffect(() => {
        idbRequest.onsuccess = (event) => {
            console.log(idbRequest.result)
            let result = idbRequest.result;
            let source = idbRequest.source as IDBObjectStore
            let indexes = [... source.indexNames];
    
            
            setKeys(typeof source.keyPath == "string" ? [source.keyPath] : source.keyPath)
            setIndexes(indexes)
            setData(result);
        }
    
    }, [])
    

    
    let indexHeadings = indexes.map(index => <th key={indexes.indexOf(index)} className="border-solid border-4">{index}</th>)
    let keyHeadings = keys.map(key => <th key={keys.indexOf(key)} className={`border-solid border-4 underline`}>{key}</th>)

    let recordRows = data.map(record => <Record key={data.indexOf(record)} data={record}/>) // bug if record has 2 indexes same data (will cause same keys)

    let deleteButtons = data.map(record => <DeleteButton key={data.indexOf(record)} text="Delete Record" clicked={() => {deleteRecord(record)}}/>)
    

    function openDatabase() {
        let source = idbRequest.source as IDBObjectStore
        const request = window.indexedDB.open(source.transaction.db.name);

        request.onerror = (event) => {
            console.error(event)
        }
        
        return request;
    }

    function newRecord() {
        const request = openDatabase();

        request.onsuccess = (event) => {
            let name = (idbRequest.source as IDBObjectStore).name
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const objectStore = transaction.objectStore(name);
    
            let newData: any = {}
            for (let i = 0; i < indexes.length; i++) {
                newData[indexes[i]] = prompt(indexes[i]) as string;
            }
    
            const newRequest = objectStore.add(newData)
            newRequest.onsuccess = (event) => {
                newData[keys[0]] = newRequest.result;
                setData([...data, newData])
            }

            transaction.oncomplete = (event) => {
                db.close()
            }
        }

    }

    function deleteRecord(record: any) {
        console.log(record, keys[0])
        const request = openDatabase();

        request.onsuccess = (event) => {
            let name = (idbRequest.source as IDBObjectStore).name
            const db = request.result

            const transaction = db.transaction([name], "readwrite")
            const objectStore = transaction.objectStore(name);

            objectStore.delete(record[keys[0]]) // wont work for multiple keys (not supported yet)

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
                <PrimaryButton classAdd="flex-1 max-w-40" text="New Record" clicked={newRecord}/>
                <DeleteButton classAdd="flex-1 max-w-40" text="Delete Object Store" clicked={deleteObjectStore}/>
            </div>
            <div className="flex">
                <table className="table-fixed w-full">
                    <thead className="h-2">
                        <tr>
                            {indexHeadings}
                            {keyHeadings}
                        </tr>
                    </thead>
                    <tbody>
                        {recordRows}
                    </tbody>
                </table>
                <div>
                <div className="flex flex-col pt-8">
                    {deleteButtons}
                </div>
                </div>
            </div>
        </div>
    )
}