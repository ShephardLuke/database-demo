import { MouseEvent, useState } from "react";
import PrimaryButton from "../../buttons/primaryButton";
import DatabaseIndex from "../table/databaseIndex";
import DatabaseInput from "../input/databaseInput";
import DeleteButton from "../../buttons/deleteButton";
import { DBIndex } from "../DBIndex";

export default function ObjectStoreCreation({newObjectStore}: {newObjectStore: (name: string, indexes: DBIndex[]) => void}) { // User interface for creating new object stores

    const [indexes, setIndexes] = useState<DBIndex[]>([new DBIndex(0, undefined, true), new DBIndex(1)]);
    const [idPointer, setIdPointer] = useState<number>(2);

    let indexCounter = -1
    const indexRows = indexes.map(index => {indexCounter += 1; return <DatabaseIndex key={index.id} text={<DatabaseInput underline={index.isKey} id={"name" + index.id} placeholder={"index" + (indexCounter + 1)}/>}/>})
    indexCounter = -1;
    const keyCheckboxes = indexes.map(index => <td className="border-2" key={index.id}><label htmlFor={"isKey" + index.id}>Key:</label><input type="checkbox" className="m-2" id={"isKey" + index.id} onClick={(event) => changeKey(index, event)}/></td>)
    const deleteButtons = indexes.map(index => {indexCounter += 1; if (indexCounter < 2) {return <td className="border-2" key={index.id}>Cannot delete, at least 2 indexes needed.</td>}; return <td className="border-2" key={index.id}><DeleteButton text="Delete Index" clicked={() => {deleteIndex(index)}}/></td>})

    keyCheckboxes[0] = <td className="border-2" key={0}>Always a key.</td>
    
    function newIndex() { // Creates a new index and adds to array
        const newInputs = [...indexes];
        const length = newInputs.length;
        if (length >= 10) {
            return;
        }

        newInputs.push(new DBIndex(idPointer))
        setIdPointer(idPointer + 1);
        setIndexes(newInputs)
    }

    function deleteIndex(index: DBIndex) { // Removes the specified index from the array
        const i = indexes.indexOf(index)
        const newIndexes = [... indexes];
        newIndexes.splice(i, 1)
        setIndexes(newIndexes);
    }

    function changeKey(index: DBIndex, event: MouseEvent) { // When a user toggles the key checkbox on an index, this updates the DBIndex object
        const i = indexes.indexOf(index)
        const newIndexes = [... indexes];
        newIndexes[i] = new DBIndex(index.id, index.name, (event.target as HTMLInputElement).checked)
        setIndexes(newIndexes);
        
    }  

    function exportIndexes() { // Adds index names and calls parent method to create the new object store
        for (const index of indexes) {
            const element = document.getElementById("name" + index.id) as HTMLInputElement;
            index.name = element.value;
        }

        const nameInput = document.getElementById("objectStoreName") as HTMLInputElement
        newObjectStore(nameInput.value, indexes);
    }



    return (
        <>
            <p className="text-xl font-bold underline">New Object Store Setup</p>
            <PrimaryButton text="Create Index" clicked={newIndex}/>
            <table className="table-fixed w-full">
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
            <div className="flex justify-center">
                <input className="text-center m-4 border-4 w-1/4" placeholder="Enter name..." id="objectStoreName" type="text" />
                <PrimaryButton text="Create Object Store" clicked={() => {exportIndexes()}}/>
            </div>
        </>
    )
}

