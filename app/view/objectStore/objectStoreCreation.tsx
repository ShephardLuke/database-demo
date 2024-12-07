import { MouseEvent, useState } from "react";
import PrimaryButton from "../../buttons/primaryButton";
import DatabaseIndexDisplay from "../table/databaseIndexDisplay";
import DatabaseInput from "../input/databaseInput";
import DeleteButton from "../../buttons/deleteButton";
import SuccessMessage from "@/app/messages/successMessage";
import { DatabaseIndex } from "../databaseIndex";

export default function ObjectStoreCreation({newObjectStore}: {newObjectStore: (name: string, indexes: DatabaseIndex[], result: (success: boolean, message: string) => void) => void}) { // User interface for creating new object stores

    const [idPointer, setIdPointer] = useState<number>(0);
    const [indexes, setIndexes] = useState<DatabaseIndex[]>(getDefaultIndexes);
    const [creationMessage, setCreationMessage] = useState<{success: boolean, text: string}>();

    const indexRows = indexes.map(index => {return <DatabaseIndexDisplay key={index.id} text={<DatabaseInput underline={index.isKey} id={"name" + index.id} placeholder={"Enter index..."}/>}/>})

    const keyCheckboxes = indexes.map(index => <td className="border-2" key={index.id}><label htmlFor={"isKey" + index.id}>Key:</label><input type="checkbox" defaultChecked={index.isKey} className="m-2" id={"isKey" + index.id} onClick={(event) => changeKey(index, event)}/></td>)
    const deleteButtons = indexes.map(index => {return <td className="border-2" key={index.id}><DeleteButton text="Delete Index" clicked={() => {deleteIndex(index)}}/></td>})

    function getDefaultIndexes() {
        setIdPointer(idPointer + 2);
        return [new DatabaseIndex(idPointer, "", true), new DatabaseIndex(idPointer + 1, "", false)];
    }
    
    function newIndex() { // Creates a new index and adds to array
        const newInputs = [...indexes];
        const length = newInputs.length;
        if (length >= 8) {
            return;
        }

        newInputs.push(new DatabaseIndex(idPointer))
        setIdPointer(idPointer + 1);
        setIndexes(newInputs)

        if (creationMessage != undefined) {
            setCreationMessage(undefined);
        }
    }

    function deleteIndex(index: DatabaseIndex) { // Removes the specified index from the array
        if (indexes.length <= 2) {
            setCreationMessage({success: false, text: "Object stores must have at least 2 indexes."});
            return;
        }
        const i = indexes.indexOf(index)
        const newIndexes = [... indexes];
        newIndexes.splice(i, 1)
        setIndexes(newIndexes);

        if (creationMessage != undefined) {
            setCreationMessage(undefined);
        }
    }

    function changeKey(index: DatabaseIndex, event: MouseEvent) { // When a user toggles the key checkbox on an index, this updates the DatabaseIndex object
        const i = indexes.indexOf(index)
        const newIndexes = [... indexes];
        newIndexes[i] = new DatabaseIndex(index.id, index.name, (event.target as HTMLInputElement).checked)
        setIndexes(newIndexes);
        
    }  

    function exportIndexes() { // Adds index names and calls parent method to create the new object store

        const nameInput = document.getElementById("objectStoreName") as HTMLInputElement

        if (nameInput.value.trim() == "") {
            setCreationMessage({success: false, text: "Please enter a valid object store name."})
            return;
        }

        let keys = 0;
        const pastNames: string[] = [];

        for (const index of indexes) {
            const element = document.getElementById("name" + index.id) as HTMLInputElement;
            if (element.value.trim() == "") {
                setCreationMessage({success: false, text: "Please enter a name for all of the indexes."})
                return;
            }

            index.name = element.value.trim();
            if(pastNames.includes(index.name)) {
                setCreationMessage({success: false, text: "Please enter a different name for all of the indexes."})
                return;
            }

            pastNames.push(index.name);
            if (index.isKey) {
                keys += 1;
            }
        }

        if (keys == 0) {
            setCreationMessage({success: false, text: "Object stores must have at least one key."})
            return;
        }

        newObjectStore(nameInput.value, indexes, dbResult);
    }

    function dbResult(success: boolean, message: string) {
        if (success) {
            setIndexes(getDefaultIndexes);
            (document.getElementById("objectStoreName") as HTMLInputElement).value = "";
        }

        setCreationMessage({success: success, text: message});
    }

    return (
        <div>
            <p className="text-xl font-bold underline">New Object Store Setup</p>
            <p className="pt-5">Use the interface below to create a new object store to hold records. Object stores need at least one key and at least 2 indexes</p>
            {<PrimaryButton text="Create Index" clicked={newIndex}/>}
            <div className="p-10">
                <table className="table-fixed border-4">
                    <thead>
                        <tr>
                            {indexRows}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {keyCheckboxes}
                        </tr>
                        <tr>
                            {deleteButtons}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <SuccessMessage success={creationMessage?.success} text={creationMessage?.text}/>
                <input className="text-center m-4 border-4 w-1/4" placeholder="Enter name..." id="objectStoreName" type="text" />
                <PrimaryButton text="Create Object Store" clicked={() => {exportIndexes()}}/>
            </div>
        </div>
    )
}

