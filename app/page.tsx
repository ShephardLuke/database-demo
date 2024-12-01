'use client'

import { useEffect, useState } from "react";
import Footer from "./pageTemplates/footer";
import DbLink from "./dbLink";
import PrimaryButton from "./buttons/primaryButton";
import SuccessMessage from "./messages/successMessage";
import Header from "./pageTemplates/header";

export default function ChooseDatabase() { // Displaying every database allowing the user to view them and choose one or create/delete them

    const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);
    const [creationResult, setCreationResult] = useState<{success: boolean, text: string}>();

    const databaseSelect = databases.map(database => <DbLink key={database.name} database={database} deleteDatabase={deleteDatabase}></DbLink>);
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
            if (database.name == name) {
                setCreationResult({success: false, text:"Database with name " + name + " already exists."});
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
            const newDatabases = [... databases];
            newDatabases.splice(newDatabases.indexOf(database), 1)
            setDatabases(newDatabases)
            
            if (creationResult != undefined) {
                setCreationResult(undefined);
            }
        }
    }

    return (
        <>
            <Header home={true}/>
            <div className="text-center p-10 bg-dark-blue">
                <p className="p-10 pb-5 text-4xl text-bold underline">Found databases: {databases?.length}</p>   
                <br/>
                {databases.length > 0 ? dbTable : noDbTable}
                <div key={new Date().getTime()} className="p-10 text-center">
                    <SuccessMessage success={creationResult?.success} text={creationResult?.text}/>
                    <input className="text-center m-2 border-4 w-1/4" id="inputDatabaseName" placeholder="Enter Name..." />
                    <PrimaryButton text="Create Database" clicked={newDatabase}></PrimaryButton>
                </div>
            </div>
            <Footer></Footer>
        </>
    )

}