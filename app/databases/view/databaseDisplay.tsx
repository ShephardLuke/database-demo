// Shows one database, so object stores and records

'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ObjectStoreDisplay from "./objectStore/objectStoreDisplay";
import ObjectStoreCreation from "./objectStore/objectStoreCreation";
import { DatabaseIndex } from "./databaseIndex";
import { ObjectStore } from "./objectStore";
import Link from "next/link";
import Button from "@/app/template/buttons/button";
import SubmitButton from "@/app/template/buttons/submitButton";

export default function DatabaseDisplay() {
    const searchParams = useSearchParams();
    const searchName = searchParams.get("database");

    const [databaseName, setDatabaseName] = useState("Unknown")
    const [foundDatabase, setFoundDatabase] = useState<boolean | null>(null);
    const [databaseVersion, setDatabaseVersion] = useState(0);

    let errorMessage = <></>;

    if (foundDatabase == false) {
        errorMessage =                 
           (
                <div className="p-5">  
                    <p className="text-center text-4xl font-bold underline whitespace-pre p-5">Database Not Found.</p>
                    <p><Link className="text-3xl" href="./databases/">Click here to return to database menu.</Link></p>
                </div>
           );

    } else if (foundDatabase == null) {
        errorMessage = 
        (
            <div className="p-5">  
                <p className="text-center text-4xl font-bold underline whitespace-pre p-5">Loading database...</p>
            </div>
        )
    }

    const [objectStores, setObjectStores] = useState<ObjectStore[]>([]);

    const [currentObjectStore, setCurrentObjectStore]  = useState<number | null>(null);

    const objectStoreSelects = objectStores.map(store => {return <Button key={store.getName()} text={store.getName()} clicked={() => {setCurrentObjectStore(objectStores.indexOf(store))}}/>});
    objectStoreSelects.unshift(<SubmitButton key={-1} text={"New Object Store"} clicked={() => {setCurrentObjectStore(-1)}}/>)

    useEffect(() => { // Find the database if it exists
        async function getObjectStores() {
            if (!searchName) {
                return
            }

            const databases = await indexedDB.databases()
            let found = false;
            for (const database of databases) {
                if (database.name == searchName) {
                    found = true;
                }
            }

            if (!found) {
                setFoundDatabase(false);
                return
            }

            setDatabaseName(searchName);
            setFoundDatabase(true)
        }

        getObjectStores()
    }, [searchName])

    useEffect(() => { // When database is found open it

        function updateObjectStores(db: IDBDatabase) { // Create an array to display each object store
            if (db.objectStoreNames.length == 0) {
                setObjectStores([])
                db.close()
                return;
            }
            const allObjectStores: ObjectStore[] = [];
            const transaction = db.transaction([... db.objectStoreNames]);
    
            for (const name of [... db.objectStoreNames]) {
                const objectStore = transaction.objectStore(name);
    
                allObjectStores.push(new ObjectStore(name, objectStore.getAll()))
            }  

            transaction.oncomplete = () => {
                setObjectStores(allObjectStores)
                db.close()
            }     
            transaction.onerror = () => {
                db.close()
            }
        }

        if (!foundDatabase) {
            return;
        }
        const request = window.indexedDB.open(databaseName);

        request.onerror = (event) => {
            console.error(event)
        }

        request.onsuccess = () => {
            setDatabaseVersion(request.result.version)
            updateObjectStores(request.result)
        }
    }, [databaseName, databaseVersion, foundDatabase])



    function openDatabase() { // Open a new version of the database to add/remove object stores
        const newVersion = databaseVersion + 1;
    
        const request = window.indexedDB.open(databaseName, newVersion);

        request.onsuccess = () => {
            if (request.result.version != databaseVersion) {
                setDatabaseVersion(request.result.version)
            }
            request.result.close()
        }

        request.onerror = (event) => {
            console.error(event)
            request.result.close()
        }

        return request
    }

    function newObjectStore(name:string, indexes: DatabaseIndex[], result: (success: boolean, message: string) => void) { // Adds object store to database

        if (!foundDatabase) {
            console.log("no database")
            return;
        }

        for (const store of objectStores) {
            if (store.getName() == name) {
                result(false, "Object store with the name " + name + " alreay exists.");
                return;
            }
        }

        const request = openDatabase()

        request.onupgradeneeded = () => {
            const newdb = request.result

            const keys = [];
            const nonKeys = [];

            for (const index of indexes) {
                const match = index.name.match("[A-Za-z][A-Za-z0-9]*");
                if(!match || match[0] != index.name) {
                    result(false, "Name for index " + index.name + " is invalid. Indexes must start with a letter and can only contain letters and numbers.");
                    return;
                }
                if (index.isKey) {
                    keys.push(index.name);
                } else {
                    nonKeys.push(index);
                }
            }



            const objectStore = newdb.createObjectStore(name, { keyPath: keys.length == 1 ? keys[0] : keys})

            for (const index of nonKeys) {
                objectStore.createIndex(index.name, index.name, {unique: false})
            }

            result(true, "Object store " + name + " created.")

        }

    }

    
    function deleteObjectStore(store: string) { // Deletes object store from database
        if (!foundDatabase) {
            console.log("no database")
            return;
        }

        const newVersion = databaseVersion + 1;

        const request = window.indexedDB.open(databaseName, newVersion);

        request.onsuccess = () => {
            setDatabaseVersion(request.result.version)
            request.result.close();
        }

        request.onerror = () => {
            console.error(request)
            request.result.close();
        }

        request.onupgradeneeded = () => {
            const newdb = request.result;

            newdb.deleteObjectStore(store)
        }

        setCurrentObjectStore(null)
    }    

    return (
        <div className="text-center">  
        {foundDatabase ? 
            <>
                <div className="p-10">
                    <p className="text-center text-4xl font-bold underline whitespace-pre">{databaseName}</p>
                    <p className="text-3xl p-5">(Version {databaseVersion})</p>
                </div>
                <p className="text-xl">Object Stores ({objectStores.length} found):</p>
                <div className="p-5 flex gap-5 justify-center">
                    {objectStoreSelects}
                </div>
                <div className="p-5">
                    {currentObjectStore == null || currentObjectStore == -1 ? null : <ObjectStoreDisplay objectStore={objectStores[currentObjectStore]} deleteObjectStore={deleteObjectStore} />}
                    {currentObjectStore == -1 ? <ObjectStoreCreation newObjectStore={newObjectStore} />: null}
                </div> 
            </>
            :
            errorMessage
        }

        </div>
    )
}