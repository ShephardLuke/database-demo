import { ReactNode } from "react"

export default function DeleteButton({text, clicked, classAdd}: {text: ReactNode, clicked: () => void, classAdd?: string}) { // Red delete button
    return (
        <button className={"bg-red-500 hover:bg-red-400 p-2 m-5 " + classAdd} onClick={() => {clicked()}}>{text}</button>
    )
}