'use client'

import { useSearchParams } from "next/navigation";
import Record from "../row";
import { useEffect, useState } from "react";
import ObjectStore from "./objectStoreDisplay";
import ObjectStoreData from "./objectStoreData";
import PrimaryButton from "../buttons/primaryButton";

export default function DatabaseDisplay() {
    const searchParams = useSearchParams();
    let searchName = searchParams.get("database");
    const [databaseName, setDatabaseName] = useState("Database Not Found")
    const [foundDatabase, setFoundDatabase] = useState(false);
    const [databaseVersion, setDatabaseVersion] = useState(0);

    const [objectStores, setObjectStores] = useState<JSX.Element[]>([]);

    let objectStoreNames = objectStores.map(objectStore => objectStore.props.name);
    console.log(databaseName)

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
            setFoundDatabase(true)
        }

        getObjectStores()
    }, [])

    useEffect(() => {
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

    useEffect(() => {
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

    function updateObjectStores(db: IDBDatabase) {
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

    function openDatabase() {
        let newVersion = databaseVersion + 1;
    
        const request = window.indexedDB.open(databaseName, newVersion);

        console.log(databaseName, newVersion)

        request.onsuccess = (event) => {
            console.log(request)
            setDatabaseVersion(request.result.version)
            updateObjectStores(request.result)
        }

        request.onerror = (event) => {
            console.error(event)
        }

        return request
    }

    function newObjectStore() {

        if (!foundDatabase) {
            console.log("no database")
            return;
        }

        let request = openDatabase()


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
                let index = prompt("Index " + (i + 1) + ": ") as string;
                objectStore.createIndex(index, index, {unique: false})
            }

        }
    }

    function deleteObjectStore(store: string) {
        if (!foundDatabase) {
            console.log("no database")
            return;
        }

        console.log(databaseName)
        let request = openDatabase()

        request.onupgradeneeded = (event) => {
            console.log("RAN")
            let newdb = request.result;
            console.log(event.oldVersion);

            newdb.deleteObjectStore(store)
        }
    }


    return (
        <>  
            <div className="p-10">
                <p className="text-center text-4xl font-bold underline whitespace-pre">{databaseName}</p>
                <p className="text-3xl p-5">(Version {databaseVersion})</p>
            </div>
            <p className="text-xl">Object Stores ({objectStores.length}):</p>
            <PrimaryButton text="New Object Store" clicked={newObjectStore}/>
            {objectStores}
        </>
    )
}