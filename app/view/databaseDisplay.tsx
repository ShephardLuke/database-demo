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


    const [objectStores, setObjectStores] = useState<ObjectStoreAll[]>([]);
    console.log(objectStores)

    let objectStoreViews = objectStores.map(objectStore => <ObjectStore key={objectStores.indexOf(objectStore)} objectStore={objectStore}></ObjectStore>) 

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
                let allObjectStores: ObjectStoreAll[] = []
                const db = request.result;
                for (let name of [... request.result.objectStoreNames]) {
                    const transaction = db.transaction([name]);
                    const objectStore = transaction.objectStore(name);
                    allObjectStores.push(new ObjectStoreAll(name, objectStore.getAll()));
                }
                setObjectStores(allObjectStores)
            }
            
        }

        getObjectStores()
    }, [])


    return (
        <>
            <p className="text-center">{databaseName}</p>
            Object Stores: {objectStoreViews}
        </>
    )
}