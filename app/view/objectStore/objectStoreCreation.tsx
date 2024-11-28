import { MouseEvent, useState } from "react";
import PrimaryButton from "../../buttons/primaryButton";
import DatabaseIndex from "../table/databaseIndex";
import DatabaseInput from "../input/databaseInput";
import DeleteButton from "../../buttons/deleteButton";
import { DBIndex } from "../dbIndex";
import SuccessMessage from "@/app/messages/successMessage";

export default function ObjectStoreCreation({newObjectStore}: {newObjectStore: (name: string, indexes: DBIndex[], result: (success: boolean, message: string) => void) => void}) { // User interface for creating new object stores

    const [idPointer, setIdPointer] = useState<number>(0);
    const [indexes, setIndexes] = useState<DBIndex[]>(getDefaultIndexes);
    const [creationMessage, setCreationMessage] = useState<{success: boolean, text: string}>();

    const indexRows = indexes.map(index => {return <DatabaseIndex key={index.id} text={<DatabaseInput underline={index.isKey} id={"name" + index.id} placeholder={"Enter index..."}/>}/>})

    const keyCheckboxes = indexes.map(index => <td className="border-2" key={index.id}><label htmlFor={"isKey" + index.id}>Key:</label><input type="checkbox" defaultChecked={index.isKey} className="m-2" id={"isKey" + index.id} onClick={(event) => changeKey(index, event)}/></td>)
    const deleteButtons = indexes.map(index => {return <td className="border-2" key={index.id}><DeleteButton text="Delete Index" clicked={() => {deleteIndex(index)}}/></td>})

    function getDefaultIndexes() {
        setIdPointer(idPointer + 2);
        return [new DBIndex(idPointer, "", true), new DBIndex(idPointer + 1, "", false)];
    }
    
    function newIndex() { // Creates a new index and adds to array
        const newInputs = [...indexes];
        const length = newInputs.length;
        if (length >= 10) {
            return;
        }

        newInputs.push(new DBIndex(idPointer))
        setIdPointer(idPointer + 1);
        setIndexes(newInputs)

        if (creationMessage != undefined) {
            setCreationMessage(undefined);
        }
    }

    function deleteIndex(index: DBIndex) { // Removes the specified index from the array
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

    function changeKey(index: DBIndex, event: MouseEvent) { // When a user toggles the key checkbox on an index, this updates the DBIndex object
        const i = indexes.indexOf(index)
        const newIndexes = [... indexes];
        newIndexes[i] = new DBIndex(index.id, index.name, (event.target as HTMLInputElement).checked)
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
        <>
            <p className="text-xl font-bold underline">New Object Store Setup</p>
            <PrimaryButton text="Create Index" clicked={newIndex}/>
            <table className="m-4 table-fixed w-full">
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
            <div className="p-10">
                <SuccessMessage success={creationMessage?.success} text={creationMessage?.text}/>
                <input className="text-center m-4 border-4 w-1/4" placeholder="Enter name..." id="objectStoreName" type="text" />
                <PrimaryButton text="Create Object Store" clicked={() => {exportIndexes()}}/>
            </div>
        </>
    )
}

