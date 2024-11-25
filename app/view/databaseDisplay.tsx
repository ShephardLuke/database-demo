// Shows one database, so object stores and records

'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ObjectStore from "./objectStoreDisplay";
import PrimaryButton from "../buttons/primaryButton";
import ObjectStoreCreation from "./objectStoreCreation";
import { DBIndex } from "./DBIndex";

export default function DatabaseDisplay() {
    const searchParams = useSearchParams();
    let searchName = searchParams.get("database");

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
            for (let database of databases) {
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
    }, [])

    useEffect(() => { // When database is found open it
        if (!foundDatabase) {
            return;
        }
        const request = window.indexedDB.open(databaseName);

        request.onerror = (event) => {
            console.error(event)
        }

        request.onsuccess = (event) => {
            setDatabaseVersion(request.result.version)
            updateObjectStores(request.result)
        }
    }, [foundDatabase])

    useEffect(() => { // Refresh the object stores when the database name/version is updated
        if (!foundDatabase) {
            return;
        }
        const request = window.indexedDB.open(databaseName);

        request.onerror = (event) => {
            console.error(event)
        }

        request.onsuccess = (event) => {
            updateObjectStores(request.result)
        }
        
    }, [databaseName, databaseVersion])

    function updateObjectStores(db: IDBDatabase) { // Create an array to display each object store
        if (db.objectStoreNames.length == 0) {
            setObjectStores([])
            db.close()
            return;
        }
        let allObjectStores: JSX.Element[] = [];
        const transaction = db.transaction([... db.objectStoreNames]);

        for (let name of [... db.objectStoreNames]) {
            const objectStore = transaction.objectStore(name);

            allObjectStores.push(<ObjectStore key={name} idbRequest={objectStore.getAll()} deleteObjectStore={deleteObjectStore}></ObjectStore>)
        }  
        setObjectStores(allObjectStores)
        transaction.oncomplete = (event) => {
            db.close()
        }     
        transaction.onerror = (event) => {
            db.close()
        }
    }

    function openDatabase() { // Open a new version of the database to add/remove object stores
        let newVersion = databaseVersion + 1;
    
        const request = window.indexedDB.open(databaseName, newVersion);

        request.onsuccess = (event) => {
            setDatabaseVersion(request.result.version)
            updateObjectStores(request.result)
        }

        request.onerror = (event) => {
            console.error(event)
        }

        return request
    }

    function newObjectStore(name:string, indexes: DBIndex[]) { // Adds object store to database

        if (!foundDatabase) {
            console.log("no database")
            return;
        }

        let request = openDatabase()


        request.onupgradeneeded = (event) => {
            let newdb = request.result

            let keys = [];
            let nonKeys = [];

            for (let index of indexes) {
                if (index.isKey) {
                    keys.push(index.name);
                } else {
                    nonKeys.push(index);
                }
            }

            let objectStore = newdb.createObjectStore(name, { keyPath: keys.length == 1 ? keys[0] : keys})

            for (let index of nonKeys) {
                objectStore.createIndex(index.name, index.name, {unique: false})
            }

        }
    }

    function deleteObjectStore(store: string) { // Deletes object store from database
        if (!foundDatabase) {
            console.log("no database")
            return;
        }

        let request = openDatabase()

        request.onupgradeneeded = (event) => {
            let newdb = request.result;

            newdb.deleteObjectStore(store)
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