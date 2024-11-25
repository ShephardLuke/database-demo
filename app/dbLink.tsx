import Link from "next/link";
import DeleteButton from "./buttons/deleteButton";
import { ReactElement, useEffect, useState } from "react";

export default function DbLink({database, deleteDatabase}: {database: IDBDatabaseInfo, deleteDatabase: Function}) { // Disaplying a summary of the database with the name being a link to the full database view page
    
    const [objectStoreNames, setObjectStoreNames] = useState<string>();

    useEffect(() => { // Get object store names

        function getObjectStoreNames() { // Sets the objectStoreNames state
            if (!database.name) {
                return;
            }
            let request = window.indexedDB.open(database.name)
    
            request.onerror = (event) => {
                console.error(event);
            }
    
            request.onsuccess = () => {
                let storeNames = "";
                for (let store of request.result.objectStoreNames) {
                    storeNames += store + ", ";
                }
                storeNames = storeNames.substring(0, storeNames.length - 2)
    
                if (storeNames.length >= 50) {
                    storeNames = storeNames.substring(0, 50);
                    storeNames += "..."
                }
                
                if (storeNames.length == 0) {
                    storeNames = "None";
                }
    
                setObjectStoreNames(storeNames);
                request.result.close();
            }
        }
        
        getObjectStoreNames();
    }, [])

    return (
        <tr className="border-2">
            <th>
                <Link className="whitespace-pre basis-2/4" href={{pathname: "/view", query: {database: database.name}}}>{database.name}</Link>
            </th>
            <td>
                {objectStoreNames}
            </td>
            <td>
                <DeleteButton text="Delete Database" clicked={() => {deleteDatabase(database)}}/>
            </td>
        </tr>
    )
}