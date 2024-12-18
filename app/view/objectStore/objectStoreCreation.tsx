import { ChangeEvent, MouseEvent, useState } from "react";
import DatabaseIndexDisplay from "../table/databaseIndexDisplay";
import DatabaseInput from "../input/databaseInput";
import SuccessMessage from "@/app/message/successMessage";
import { DatabaseIndex } from "../databaseIndex";
import SubmitButton from "@/app/template/buttons/submitButton";
import WarningButton from "@/app/template/buttons/warningButton";
import { DATA_TYPE } from "./dataValue";

export default function ObjectStoreCreation({newObjectStore}: {newObjectStore: (name: string, indexes: DatabaseIndex[], result: (success: boolean, message: string) => void) => void}) { // User interface for creating new object stores

    const [idPointer, setIdPointer] = useState<number>(0);
    const [indexes, setIndexes] = useState<DatabaseIndex[]>(getDefaultIndexes);
    const [creationMessage, setCreationMessage] = useState<{success: boolean, text: string}>();

    const indexRows = indexes.map(index => {return <DatabaseIndexDisplay key={index.getId()} text={<DatabaseInput underline={index.getIsKey()} id={"name" + index.getId()} placeholder={"Enter index..."}/>}/>})
    
    const acceptedTypes = Object.values(DATA_TYPE).map(type => <option key={type} value={type}>{type}</option>)

    const keyCheckboxes = indexes.map(index => <td className="border-2" key={index.getId()}><label htmlFor={"isKey" + index.getId()}>Primary Key?</label><input type="checkbox" defaultChecked={index.getIsKey()} className="m-2" id={"isKey" + index.getId()} onClick={(event) => changeKey(index, event)}/></td>)
    const dataTypeDropdowns = indexes.map(index => <td className="border-2" key={index.getId()}><label htmlFor={index.getId() + "type"}>Type:</label><select id={index.getId() + "type"} className="text-center bg-dark-blue border-2 m-4" onChange={(event) => changeType(index, event)}>{acceptedTypes}</select></td>)
    const deleteButtons = indexes.map(index => {return <td className="border-2" key={index.getId()}><WarningButton clicked={() => {deleteIndex(index)}}>Delete Index</WarningButton></td>})

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

        newInputs.push(new DatabaseIndex(idPointer, undefined))
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
        newIndexes[i] = new DatabaseIndex(index.getId(), index.getName(), (event.target as HTMLInputElement).checked, index.getType())
        setIndexes(newIndexes);
    }
    
    function changeType(index: DatabaseIndex, event: ChangeEvent) {
        const i = indexes.indexOf(index)
        const newIndexes = [... indexes];
        newIndexes[i] = new DatabaseIndex(index.getId(), index.getName(), index.getIsKey(), DATA_TYPE[(event.target as HTMLInputElement).value as keyof typeof DATA_TYPE])
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
            const element = document.getElementById("name" + index.getId()) as HTMLInputElement;
            if (element.value.trim() == "") {
                setCreationMessage({success: false, text: "Please enter a name for all of the indexes."})
                return;
            }

            index.setName(element.value.trim());
            if(pastNames.includes(index.getName())) {
                setCreationMessage({success: false, text: "Please enter a different name for all of the indexes."})
                return;
            }

            pastNames.push(index.getName());
            if (index.getIsKey()) {
                keys += 1;
            }
        }

        if (keys == 0) {
            setCreationMessage({success: false, text: "Object stores must have at least one key."})
            return;
        }

        newObjectStore(nameInput.value.trim(), indexes, dbResult);
    }

    function dbResult(success: boolean, message: string) { // Called from databaseDisplay after requesting to create the object store
        if (success) {
            setIndexes(getDefaultIndexes);
            (document.getElementById("objectStoreName") as HTMLInputElement).value = "";
        }

        setCreationMessage({success: success, text: message});
    }

    return (
        <div>
            <p className="text-xl font-bold underline">New Object Store Setup</p>
            <p className="pt-5 pb-10">Use the interface below to create a new object store to hold records. Object stores need at least one key and at least 2 indexes</p>
            {<SubmitButton clicked={newIndex}>Create Index</SubmitButton>}
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
                            {dataTypeDropdowns}
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
                <SubmitButton clicked={() => {exportIndexes()}}>Create Object Store</SubmitButton>
            </div>
        </div>
    )
}

