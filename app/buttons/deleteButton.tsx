export default function DeleteButton({text, clicked}: {text: string, clicked: Function}) {
    return (
        <button className={"bg-red-500 hover:bg-red-400 p-2 m-5"} onClick={() => {clicked()}}>{text}</button>
    )
}