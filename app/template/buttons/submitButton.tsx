// website-template v1.2

import { ReactNode } from "react"
import Button from "./button"

export default function SubmitButton({text, clicked}: {text: ReactNode, clicked?: () => void}) { // Red delete button
    return (
        <Button text={text} clicked={clicked} classAdd="bg-green-700 hover:bg-green-800 active:bg-green-900"/>
    )
}