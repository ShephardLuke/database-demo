import { ReactNode } from "react"

export default function SecondaryButton({text, clicked, classAdd}: {text: ReactNode, clicked: () => void, classAdd?: string}) { // Red delete button
    return (
        <button className={"bg-blue-500 hover:bg-blue-400 p-2 m-5 " + classAdd} onClick={() => {clicked()}}>{text}</button>
    )
}