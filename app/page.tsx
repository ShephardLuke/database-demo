'use client'

import { useEffect, useState } from "react";
import Footer from "./footer/footer";
import DbLink from "./dbLink";
import PrimaryButton from "./buttons/primaryButton";

export default function ChooseDatabase() { // Displaying every database allowing the user to view them and choose one or create/delete them

    const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);

    const databaseSelect = databases.map(database => <DbLink key={database.name} database={database} deleteDatabase={deleteDatabase}></DbLink>)
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
            return;
        }

        const name = typedName.trim();
        const request = window.indexedDB.open(name);
        request.onerror = () => {

        }
        request.onsuccess = () => {
            request.result.close()
            
            async function getDatabases() {
                const databases = await indexedDB.databases();
                setDatabases(databases);
            }
    
            getDatabases();
        }
    }

    function deleteDatabase(database: IDBDatabaseInfo) { // Delete existing database
        if (!database.name) {
            return;
        }

        const DBDeleteRequest = window.indexedDB.deleteDatabase(database.name);

        DBDeleteRequest.onerror = (event) => {
            console.error(event)
        }

        DBDeleteRequest.onsuccess = () => {
            const newDatabases = [... databases];
            newDatabases.splice(newDatabases.indexOf(database), 1)
            setDatabases(newDatabases)
        }
    }

    return (
        <>
            <div className="text-center">
                <p className="p-10 pb-5 text-4xl text-bold underline">Found databases: {databases?.length}</p>   
                <br/>
                <table className="table-fixed w-full border-2">
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
                <div key={new Date().getTime()} className="text-center">
                    <input className="text-center m-2 border-4 w-1/4" id="inputDatabaseName" placeholder="Enter Name..." />
                    <PrimaryButton text="Create Database" clicked={newDatabase}></PrimaryButton>
                </div>
            </div>
            <Footer></Footer>
        </>
    )

}