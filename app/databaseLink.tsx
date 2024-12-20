import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "./template/buttons/button";
import WarningButton from "./template/buttons/warningButton";

export default function DatabaseLink({database, deleteDatabase}: {database: IDBDatabaseInfo, deleteDatabase: (database: IDBDatabaseInfo) => void}) { // Disaplying a summary of the database with the name being a link to the full database view page
    
    const [objectStoreNames, setObjectStoreNames] = useState<string[]>([]);

    function getObjectStoreNamesString() { // Returns the store names as a single string for displaying on the page
        let storeNames = "";
        for (const store of objectStoreNames) {
            storeNames += store + ", ";
        }
        storeNames = storeNames.substring(0, storeNames.length - 2)
        
        if (storeNames.length == 0) {
            storeNames = "None";
        }

        return storeNames;

    }

    useEffect(() => { // Get object store names

        function getObjectStoreNames() { // Sets the objectStoreNames state
            if (!database.name) {
                return;
            }
            const request = window.indexedDB.open(database.name)
    
            request.onerror = (event) => {
                console.error(event);
            }
    
            request.onsuccess = () => {

                setObjectStoreNames([... request.result.objectStoreNames]);

                request.result.close();
            }
        }
        
        getObjectStoreNames();
    }, [database])

    return (
        <tr className="border-2">
            <th className="border-2">
                {database.name}
            </th>
            <td className="border-2">
                {database.version}
            </td>
            <td className="border-2">
                {objectStoreNames.length}: {getObjectStoreNamesString()}
            </td>
            <td className="border-2">
                <Link className="hover:text-white" href={{pathname: "/view", query: {database: database.name}}}>
                    <Button text="Open Database" clicked={() => {}}/>
                </Link>
            </td>
            <td>
                <WarningButton text="Delete Database" clicked={() => {deleteDatabase(database)}}/>
            </td>
        </tr>
    )
}