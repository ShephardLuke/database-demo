export default function DeleteButton({text, clicked, classAdd}: {text: string, clicked: Function, classAdd?: string}) {
    return (
        <button className={"bg-red-500 hover:bg-red-400 p-2 m-5 " + classAdd} onClick={() => {clicked()}}>{text}</button>
    )
}