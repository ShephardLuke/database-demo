'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChooseDatabase() {

    const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([]);

    const databaseSelect = databases.map(database => <Link href={{pathname: "/view", query: {database: database.name }}} key={databases.indexOf(database)}>{database.name}</Link>)
    console.log(databases)

    useEffect(() => {
        async function getDatabases() {
            const databases = await indexedDB.databases()
            setDatabases(databases);
        }

        getDatabases()
    }, [])

    return (
        <>
            <p>
                Found databases: {databases?.length}    
            </p>    
            {databaseSelect}
        </>
    )

}