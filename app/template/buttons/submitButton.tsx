// website-template v1.2

import { ReactNode } from "react"
import Button from "./button"

export default function SubmitButton({clicked, children}: {clicked?: () => void, children?: ReactNode}) { // Red delete button
    return (
        <Button clicked={clicked} classAdd="bg-green-700 hover:bg-green-800 active:bg-green-900">
            {children}
        </Button>
    )
}