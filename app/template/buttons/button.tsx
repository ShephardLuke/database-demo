// website-template v1.2

import { ReactNode } from "react"

export default function Button({clicked, classAdd, children}: {clicked?: () => void, classAdd?: string, children?: ReactNode}) { // Blue button for main stuff
    let toAdd = "bg-blue-700 hover:bg-blue-800 active:bg-blue-900";
    if (classAdd) {
        toAdd = classAdd;
    }

    return (
        <button className={"p-2 " + toAdd} onClick={clicked? clicked : () => {}}>{children}</button>
    )
}