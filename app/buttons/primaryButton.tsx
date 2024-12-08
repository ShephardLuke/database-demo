import { ReactNode } from "react"

export default function PrimaryButton({text, clicked, classAdd}: {text: ReactNode, clicked: () => void, classAdd?: string}) { // Blue button for main stuff
    return (
        <button className={"bg-green-500 hover:bg-green-400 p-2 m-5 " + classAdd} onClick={() => {clicked()}}>{text}</button>
    )
}