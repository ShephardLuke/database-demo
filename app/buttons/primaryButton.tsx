export default function PrimaryButton({text, clicked, classAdd}: {text: string, clicked: () => void, classAdd?: string}) { // Blue button for main stuff
    return (
        <button className={"bg-blue-500 hover:bg-blue-400 p-2 m-5 " + classAdd} onClick={() => {clicked()}}>{text}</button>
    )
}