'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "./footer/footer";
import DbLink from "./dbLink";
import PrimaryButton from "./buttons/primaryButton";

export default function ChooseDatabase() { // Displaying every database allowing the user to view them and choose one or create/delete them

    const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);

    const databaseSelect = databases.map(database => <DbLink key={database.name} database={database} deleteDatabase={deleteDatabase}></DbLink>)
    console.log(databases)

    useEffect(() => { // Get all databases
        async function getDatabases() {
            const databases = await indexedDB.databases()
            setDatabases(databases);
        }

        getDatabases()
    }, [])

    function newDatabase() { // Create new database
        let typedName = prompt("Name: ");
        if (!typedName || typedName.trim().length == 0) {
            return;
        }
        let name = typedName.trim();
        let request = window.indexedDB.open(name);
        request.onerror = (event) => {

        }
        request.onsuccess = (event) => {
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

        DBDeleteRequest.onsuccess = (event) => {
            let newDatabases = [... databases];
            let foundName
            newDatabases.splice(newDatabases.indexOf(database), 1)
            setDatabases(newDatabases)
        }
    }

    return (
        <>
            <div className="text-center">
                <p className="p-10">Found databases: {databases?.length}</p>   
                <PrimaryButton text="New Database" clicked={newDatabase}></PrimaryButton>
                <br/>
                <table className="table-fixed w-full border-2">
                    <thead className="border-2">
                        <tr>
                            <th>Database Name</th>
                            <th>Object Stores</th>
                            <th>Delete Database</th>
                        </tr>
                    </thead>
                    <tbody>
                        {databaseSelect}
                    </tbody> 
                </table>
            </div>
            <Footer></Footer>
        </>
    )

}