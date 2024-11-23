'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "./footer/footer";
import DbLink from "./dbLink";

export default function ChooseDatabase() {

    const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);

    const databaseSelect = databases.map(database => <DbLink key={databases.indexOf(database)} name={database.name ? database.name : "Unnamed"}></DbLink>)
    console.log(databases)

    useEffect(() => {
        async function getDatabases() {
            const databases = await indexedDB.databases()
            setDatabases(databases);
        }

        getDatabases()
    }, [])

    function newDatabase() {
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