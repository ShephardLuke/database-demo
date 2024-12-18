// website-template v1.2

import { ReactNode } from "react"
import Button from "./button"

export default function WarningButton({clicked, children}: {clicked?: () => void, children?: ReactNode}) { // Red delete button
    return (
        <Button clicked={clicked} classAdd="bg-red-700 hover:bg-red-800 active:bg-red-900">
            {children}
        </Button>
    )
}