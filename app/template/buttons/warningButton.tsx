// website-template v1.2

import { ReactNode } from "react"
import Button from "./button"

export default function WarningButton({text, clicked}: {text: ReactNode, clicked?: () => void}) { // Red delete button
    return (
        <Button text={text} clicked={clicked} classAdd="bg-red-700 hover:bg-red-800 active:bg-red-900"/>
    )
}