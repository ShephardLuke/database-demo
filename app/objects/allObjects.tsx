import { useEffect, useState } from "react";
import Button from "../template/buttons/button";
import SubmitButton from "../template/buttons/submitButton";
import ObjectDisplay from "./objectDisplay";
import ObjectCreation from "./objectCreation";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pk = require("../../package.json");

export default function AllObjects() {
    // const allObjects = ["Cat", "Train"];

    // localStorage.setItem("allObjects", JSON.stringify(allObjects))

    const [objects, setObjects] = useState<string[]>([]);
    const [selectedObject, setSelectedObject] = useState<number | null>(null);

    useEffect(() => { // Stops hydration error / localStorage undefined on server side
        function getObjects() { // Takes names from localStorage starting with "object" then returns them as a list with "object" removed, so just the object names are returned
            const objs = Object.keys(localStorage).filter(obj => obj.substring(0, 6) === "object").map(obj => obj.substring(6));
            objs.sort()
            return objs;
        }

        setObjects(getObjects());
    }, [])

    function CREATE_TEST() {
        const name = prompt("OBJECT_NAME") as string;
        const values = Number(prompt("FIELD_COUNT") as string);
        const object: {[key: string]: string} = {}

        for (let i = 1; i <= values; i++) {
            object[prompt("FIELD_" + i + "_NAME") as string] = prompt("FIELD_" + i + "_TYPE") as string;
        }

        object["_version"] = pk.version;
        
        return [name, object] as [string, {[key: string]: string}]
    }

    function newObject() {

        const [name, object] = CREATE_TEST()

        localStorage.setItem("object" + name, JSON.stringify(object));
    
        const newObjects =[... objects, name];
        newObjects.sort();
        setObjects(newObjects)
    }

    function deleteObject(name: string) {

        localStorage.removeItem("object" + name);

        const newObjects = [... objects];
        newObjects.splice(newObjects.indexOf(name), 1);
        setSelectedObject(null);
        setObjects(newObjects);
    }

    return (
        <div className="text-center">
            <h1>Found Objects: {objects.length}</h1>
            <div className="flex gap-5 justify-center pb-5">
                <SubmitButton text={"New Object"} clicked={() => {setSelectedObject(-1)}}/>
                {objects.map(obj => <Button key={obj} text={obj} clicked={() => {setSelectedObject(objects.indexOf(obj))}}/>)}
            </div>
            {selectedObject != null && selectedObject != -1 ? <ObjectDisplay objectName={objects[selectedObject]} deleteObject={deleteObject}/> : null}
            {selectedObject == -1 ? <ObjectCreation newObject={newObject}/> : null}
        </div>
    )
}