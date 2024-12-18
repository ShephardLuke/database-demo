'use client'

import { useEffect, useState } from "react";
import DatabaseLink from "./databaseLink";
import SuccessMessage from "./message/successMessage";
import SubmitButton from "./template/buttons/submitButton";
import storageAvailable from "./view/storageAvailable";
import { DatabaseMetadata } from "./view/objectStore/objectStore";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pk = require("../package.json");

export default function AllDatabases() { // Displaying every database allowing the user to view them and choose one or create/delete them

    const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);
    const [creationResult, setCreationResult] = useState<{success: boolean, text: string}>();

    const databaseSelect = databases.map(database => <DatabaseLink key={database.name} database={database} deleteDatabase={deleteDatabase}/>);
    const dbTable = 
    (
        <table className="table-fixed border-4">
            <thead className="border-2">
                <tr>
                    <th>Database Name</th>
                    <th>Database Version</th>
                    <th>Object Stores</th>
                    <th>Open Database</th>
                    <th>Delete Database</th>
                </tr>
            </thead>
            <tbody>
                {databaseSelect}
            </tbody> 
        </table>    
    )

    const noDbTable = (<p>No databases found. To create a database type in the name below and press &lsquo;Create Database&rsquo;.</p>)

    useEffect(() => { // Get all databases
        async function getDatabases() {
            const databases = await indexedDB.databases()
            setDatabases(databases);
        }

        getDatabases()
    }, [])

    function newDatabase() { // Create new database
        const typedName = (document.getElementById("inputDatabaseName") as HTMLInputElement).value
        if (typedName.trim().length == 0) {
            setCreationResult({success: false, text: "Please enter a database name."});
            return;
        }

        const name = typedName.trim();

        for (const database of databases) {
            if ((database.name as string).trim().toLowerCase() == name.trim().toLowerCase()) {
                setCreationResult({success: false, text:"Database with name " + name.trim().toLowerCase() + " already exists."});
                return;
            }
        }

        const request = window.indexedDB.open(name);

        request.onerror = () => {
            setCreationResult({success: false, text: "Failed to create database " + name + "."});
        }

        request.onsuccess = () => {
            request.result.close()
            
            async function getDatabases() {
                const databases = await indexedDB.databases();
                setDatabases(databases);
            }

            if (storageAvailable("localStorage")) {
                const metadata: DatabaseMetadata = {
                    "_version": pk.version,
                    "objectStores": {},
                }
                localStorage.setItem("database" + name, JSON.stringify(metadata));
            }
            (document.getElementById("inputDatabaseName") as HTMLInputElement).value = "";
            getDatabases();
            setCreationResult({success: true, text:"Database " + name + " created."});
        }
    }

    function deleteDatabase(database: IDBDatabaseInfo) { // Delete existing database
        if (!database.name) {
            return;
        }

        const DBDeleteRequest = window.indexedDB.deleteDatabase(database.name);

        DBDeleteRequest.onerror = () => {
            setCreationResult({success: false, text: "Failed to delete database " + database.name + "."});
        }

        DBDeleteRequest.onsuccess = () => {
            if (storageAvailable("localStorage")) {
                localStorage.removeItem("database" + database.name);
            }
            const newDatabases = [... databases];
            newDatabases.splice(newDatabases.indexOf(database), 1)
            setDatabases(newDatabases)
            
            if (creationResult != undefined) {
                setCreationResult(undefined);
            }
        }
    }

    return (
        <div className="text-center">
            <p className="p-10 pb-5 text-4xl text-bold underline">Found databases: {databases?.length}</p>   
            <br/>
            {databases.length > 0 ? dbTable : noDbTable}
            <div className="p-10 text-center">
                <SuccessMessage success={creationResult?.success} text={creationResult?.text}/>
                <input className="text-center m-2 border-4 w-1/4" id="inputDatabaseName" placeholder="Enter Name..." />
                <SubmitButton clicked={newDatabase}>Create Database</SubmitButton>
            </div>
        </div>
    )

}