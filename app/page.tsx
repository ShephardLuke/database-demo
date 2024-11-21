'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "./footer/footer";

export default function ChooseDatabase() {

    const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);

    const databaseSelect = databases.map(database => <Link href={{pathname: "/view", query: {database: database.name }}} key={databases.indexOf(database)}>{databases.indexOf(database) + 1}: {database.name}</Link>)
    console.log(databases)

    useEffect(() => {
        async function getDatabases() {
            const databases = await indexedDB.databases()
            setDatabases(databases);
        }

        getDatabases()
    }, [])

    function newDatabase() {
        let name = prompt("Name: ") as string;
        let request = window.indexedDB.open(name)
        request.onerror = (event) => {

        }
        request.onsuccess = (event) => {
            request.result.close()
            
            async function getDatabases() {
                const databases = await indexedDB.databases()
                setDatabases(databases);
            }
    
            getDatabases()
        }
    }

    return (
        <>
            <div className="text-center">
                <p>
                    Found databases: {databases?.length}    
                </p>   
                <br/>
                <div className="flex flex-col">
                    {databaseSelect}
                </div> 
                <button className="bg-blue-500 hover:bg-blue-400 p-2 m-5" onClick={newDatabase}>New Database</button>
            </div>
            <Footer></Footer>
        </>
    )

}