import { ChangeEvent, useState } from "react";
import PrimaryButton from "../buttons/primaryButton";
import DatabaseIndex from "./table/databaseIndex";
import DatabaseInput from "./table/databaseInput";

export default function ObjectStoreCreation() {

    const [indexes, setIndexes] = useState<JSX.Element[]>([<DatabaseIndex key="index0" text={<DatabaseInput id="index0" changed={indexChange} placeholder="index1"/>}/>, <DatabaseIndex key="index1" text={<DatabaseInput changed={indexChange} id="index1" placeholder="index2"/>}/>]);

    
    function newIndex() {
        let newNextObjectStores = [...indexes];
        let length = newNextObjectStores.length;
        if (length >= 10) {
            return;
        }

        newNextObjectStores.push(<DatabaseIndex key={length} text={<DatabaseInput id={"index" + length} changed={indexChange} placeholder={"index" + (length + 1)}/>}/>)
        setIndexes(newNextObjectStores)
    }

    
    function indexChange(id: string, event: ChangeEvent<HTMLInputElement>) {
        console.log(id);
    }



    return (
        <>
            <div>
                <input className="text-center m-4 border-4 w-1/4" placeholder="Enter name..." type="text" />
                <div className="flex">
                    <table className="table-fixed w-full">
                        <thead>
                            <tr>
                                {indexes}
                            </tr>
                        </thead>
                    </table>
                    <PrimaryButton text="New Index" clicked={newIndex}/>
                </div>
            </div>
        </>
    )
}