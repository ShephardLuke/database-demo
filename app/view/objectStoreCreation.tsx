import { ChangeEvent, MouseEvent, MouseEventHandler, useState } from "react";
import PrimaryButton from "../buttons/primaryButton";
import DatabaseIndex from "./table/databaseIndex";
import DatabaseInput from "./table/databaseInput";
import DeleteButton from "../buttons/deleteButton";
import { DBIndex } from "./DBIndex";

export default function ObjectStoreCreation({newObjectStore}: {newObjectStore: Function}) {

    const [indexes, setIndexes] = useState<DBIndex[]>([new DBIndex(0, "key", true), new DBIndex(1, "index1")]);
    const [idPointer, setIdPointer] = useState<number>(2);

    let indexCounter = -1
    let indexRows = indexes.map(index => {indexCounter += 1; return <DatabaseIndex key={index.id} text={<DatabaseInput underline={index.isKey} id={"name" + index.id} placeholder={"index" + (indexCounter + 1)}/>}/>})
    indexCounter = -1;
    let keyCheckboxes = indexes.map(index => <td className="border-2" key={index.id}><label htmlFor={"isKey" + index.id}>Key:</label><input type="checkbox" className="m-2" id={"isKey" + index.id} onClick={(event) => changeKey(index, event)}/></td>)
    let deleteButtons = indexes.map(index => {indexCounter += 1; if (indexCounter < 2) {return <td className="border-2" key={index.id}>Cannot delete, at least 2 indexes needed.</td>}; return <td className="border-2" key={index.id}><DeleteButton text="Delete Index" clicked={() => {deleteInput(index)}}/></td>})

    keyCheckboxes[0] = <td className="border-2" key={0}>Always a key.</td>
    
    function newIndex() {
        let newInputs = [...indexes];
        let length = newInputs.length;
        if (length >= 10) {
            return;
        }

        newInputs.push(new DBIndex(idPointer))
        setIdPointer(idPointer + 1);
        setIndexes(newInputs)
    }

    
    function indexChange(id: string, event: ChangeEvent<HTMLInputElement>) {
        console.log(id);
    }

    function deleteInput(index: DBIndex) {
        let i = indexes.indexOf(index)
        let newIndexes = [... indexes];
        newIndexes.splice(i, 1)
        setIndexes(newIndexes);
    }

    function changeKey(index: DBIndex, event: MouseEvent) {
        let i = indexes.indexOf(index)
        let newIndexes = [... indexes];
        console.log((event.target as HTMLInputElement).value);
        newIndexes[i] = new DBIndex(index.id, index.name, (event.target as HTMLInputElement).checked)
        setIndexes(newIndexes);
        
    }  

    function exportIndexes() {
        for (let index of indexes) {
            let element = document.getElementById("name" + index.id) as HTMLInputElement;
            index.name = element.value;
        }

        let nameInput = document.getElementById("objectStoreName") as HTMLInputElement
        newObjectStore(nameInput.value, indexes);
    }



    return (
        <>
            <div className="flex justify-center">
                <input className="text-center m-4 border-4 w-1/4" placeholder="Enter name..." id="objectStoreName" type="text" />
                <PrimaryButton text="New Object Store" clicked={() => {exportIndexes()}}/>
            </div>
            <div className="flex">
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
                <PrimaryButton text="New Index" clicked={newIndex}/>
            </div>
        </>
    )
}

