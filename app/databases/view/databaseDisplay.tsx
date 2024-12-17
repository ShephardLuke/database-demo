// Shows one database, so object stores and records

'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ObjectStoreDisplay from "./objectStore/objectStoreDisplay";
import { DatabaseIndex } from "./databaseIndex";
import { DatabaseMetadata, ObjectStore, ObjectStoreMetadata } from "./objectStore/objectStore";
import Link from "next/link";
import Button from "@/app/template/buttons/button";
import SubmitButton from "@/app/template/buttons/submitButton";
import ObjectStoreCreation from "./objectStore/objectStoreCreation";
import { DATA_TYPE } from "./objectStore/dataValue";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pk = require("../../../package.json");

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
                const metadata: DatabaseMetadata = {
                    "_version": pk.version,
                    "objectStores": {}
                }
                localStorage.setItem("database" + databaseName, JSON.stringify(metadata))

                setObjectStores([])
                db.close()
                return;
            }
            const allObjectStores: ObjectStore[] = [];

            if (localStorage.getItem("database" + databaseName) == undefined) {
                const metadata: DatabaseMetadata = {
                    "_version": pk.version,
                    "objectStores": {}
                }
                localStorage.setItem("database" + databaseName, JSON.stringify(metadata))
            }

            const transaction = db.transaction([... db.objectStoreNames], "readwrite");
    
            for (const name of [... db.objectStoreNames]) {
                const objectStore = transaction.objectStore(name);
    
                allObjectStores.push(new ObjectStore(name, objectStore.getAll()))
            }  

            transaction.oncomplete = () => {
                setObjectStores(allObjectStores)
                const metadata = (JSON.parse(localStorage.getItem("database" + db.name) as string) as DatabaseMetadata);
                if (metadata._version != pk.version) {
                    metadata._version = pk.version;
                    localStorage.setItem("database" + db.name, JSON.stringify(metadata));
                }
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
            if (store.getName().toLowerCase() == name.toLowerCase()) {
                result(false, "Object store with the name " + name.toLowerCase() + " already exists.");
                return;
            }
        }

        const request = openDatabase()

        request.onupgradeneeded = () => {
            const newdb = request.result

            const keys = [];
            const nonKeys = [];
            const attributes: {[key: string]: DATA_TYPE} = {};

            for (const index of indexes) {
                const match = index.getName().match("[A-Za-z][A-Za-z0-9]*");
                attributes[index.getName()] = index.getType();
                if(!match || match[0] != index.getName()) {
                    result(false, "Name for index " + index.getName() + " is invalid. Indexes must start with a letter and can only contain letters and numbers.");
                    return;
                }
                if (index.getIsKey()) {
                    keys.push(index.getName());
                } else {
                    nonKeys.push(index);
                }
            }

            const objectStore = newdb.createObjectStore(name, {keyPath: keys.length == 1 ? keys[0] : keys})

            for (const index of nonKeys) {
                objectStore.createIndex(index.getName(), index.getName(), {unique: false})
            }

            const objectStoreMetadata: ObjectStoreMetadata = attributes
            
            const metadata = (JSON.parse(localStorage.getItem("database" + databaseName) as string) as DatabaseMetadata);
            metadata.objectStores[name] = objectStoreMetadata;

            localStorage.setItem("database" + databaseName, JSON.stringify(metadata));

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