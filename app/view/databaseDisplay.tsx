// Shows one database, so object stores and records

'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ObjectStore from "./objectStore/objectStoreDisplay";
import ObjectStoreCreation from "./objectStore/objectStoreCreation";
import { DBIndex } from "./DBIndex";

export default function DatabaseDisplay() {
    const searchParams = useSearchParams();
    const searchName = searchParams.get("database");

    const [databaseName, setDatabaseName] = useState("Database Not Found")
    const [foundDatabase, setFoundDatabase] = useState(false);
    const [databaseVersion, setDatabaseVersion] = useState(0);
    const [objectStores, setObjectStores] = useState<JSX.Element[]>([]);

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
                return
            }

            setDatabaseName(searchName);
            setFoundDatabase(true)
        }

        getObjectStores()
    }, [searchName])

    useEffect(() => { // When database is found open it

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
        }    

        function updateObjectStores(db: IDBDatabase) { // Create an array to display each object store
            if (db.objectStoreNames.length == 0) {
                setObjectStores([])
                db.close()
                return;
            }
            const allObjectStores: JSX.Element[] = [];
            const transaction = db.transaction([... db.objectStoreNames]);
    
            for (const name of [... db.objectStoreNames]) {
                const objectStore = transaction.objectStore(name);
    
                allObjectStores.push(<ObjectStore key={name} idbRequest={objectStore.getAll()} deleteObjectStore={deleteObjectStore}></ObjectStore>)
            }  
            setObjectStores(allObjectStores)
            transaction.oncomplete = () => {
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
            setDatabaseVersion(request.result.version)
            request.result.close()
        }

        request.onerror = (event) => {
            console.error(event)
            request.result.close()
        }

        return request
    }

    function newObjectStore(name:string, indexes: DBIndex[]) { // Adds object store to database

        if (!foundDatabase) {
            console.log("no database")
            return;
        }

        const request = openDatabase()


        request.onupgradeneeded = () => {
            const newdb = request.result

            const keys = [];
            const nonKeys = [];

            for (const index of indexes) {
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

        }
    }

    return (
        <>  
            <div className="p-10">
                <p className="text-center text-4xl font-bold underline whitespace-pre">{databaseName}</p>
                <p className="text-3xl p-5">(Version {databaseVersion})</p>
            </div>
            <p className="text-xl pb-20">Object Stores ({objectStores.length} found):</p>
            {<ObjectStoreCreation key={new Date().getTime()} newObjectStore={newObjectStore}/>}
            {objectStores}
        </>
    )
}