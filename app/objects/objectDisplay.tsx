import WarningButton from "../template/buttons/warningButton";

export default function ObjectDisplay({objectName, deleteObject}: {objectName: string, deleteObject: (name: string) => void}) {

    const object: {[key: string]: string} = JSON.parse(localStorage.getItem("object" + objectName) as string);

    const keys = Object.keys(object).filter(obj => obj.substring(0, 1) != "_");

    return (
        <> 
            <div className="flex flex-col gap-2 pb-5">
                {keys.map(key => <p key={key}>{key + ": " + object[key]}</p>)}
            </div>
            <WarningButton text={"Delete Object"} clicked={() => {deleteObject(objectName)}}/>
        </>
    )
}