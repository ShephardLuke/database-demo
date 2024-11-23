import Link from "next/link";
import DeleteButton from "./buttons/deleteButton";

export default function DbLink({name}: {name: string}) {
    return (
        <div className="flex justify-center items-center">
            <Link className="whitespace-pre basis-3/4" href={{pathname: "/view", query: {database: name}}}>{name}</Link>
            <div className="basis-1/4">
                <DeleteButton text="Delete Database" clicked={() => console.log("J")}/>
            </div>
        </div>
    )
}