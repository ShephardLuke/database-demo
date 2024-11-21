'use client'

import { useSearchParams } from "next/navigation";
import Record from "../row";
import { useEffect, useState } from "react";
import ObjectStore from "./objectStoreDisplay";
import ObjectStoreAll from "./objectStoreData";

export default function DatabaseDisplay() {
    const searchParams = useSearchParams();
    let searchName = searchParams.get("database");
    const [databaseName, setDatabaseName] = useState("Database Not Found.")
    const [databaseVersion, setDatabaseVersion] = useState(0);

    const [objectStores, setObjectStores] = useState<JSX.Element[]>([]);

    useEffect(() => {
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

            const request = window.indexedDB.open(searchName);
            request.onerror = (event) => {
                console.error(event)
            }

            request.onsuccess = (event) => {
                setDatabaseVersion(request.result.version)
                updateObjectStores(request.result)
            }
            
        }

        getObjectStores()
    }, [])

    function updateObjectStores(db: IDBDatabase) {
        let allObjectStores: JSX.Element[] = [];
        console.log("ran")
        for (let name of [... db.objectStoreNames]) {
            allObjectStores.push(<ObjectStore key={name} db={db} name={name}></ObjectStore>)
        }
        setObjectStores(allObjectStores)
    }

    function newObjectStore() {

        let newVersion = databaseVersion + 1;
    

        const request = window.indexedDB.open(databaseName, newVersion);
        console.log("requested")
        request.onerror = (event) => {
            console.error(event)
        }

        request.onsuccess = (event) => {
            setDatabaseVersion(request.result.version)
            updateObjectStores(request.result)
        }

        request.onupgradeneeded = (event) => {
            let newdb = request.result
            let name = prompt("Name: ") as string;

            let objectStore = newdb.createObjectStore(name, { keyPath: "id" as string, autoIncrement: true})

            let indexNum = 3
            let indexPrompt = Number(prompt("Indexes: "));

            if (!isNaN(indexPrompt)) {
                indexNum = Math.min(indexPrompt, 10)
            }

            for (let i = 0; i < indexPrompt; i++) {
                let index = prompt("Index " + i + ": ") as string;
                objectStore.createIndex(index, index, {unique: false})
            }

    
        }

    }


    return (
        <>
            <p className="text-center">{databaseName}, Version {databaseVersion}</p>
            Object Stores: {objectStores}
            <button className="bg-blue-500 hover:bg-blue-400 p-2 m-5" onClick={newObjectStore}>New Object Store</button>
        </>
    )
}