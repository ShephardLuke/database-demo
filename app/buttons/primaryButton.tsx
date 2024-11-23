export default function PrimaryButton({text, clicked, classAdd}: {text: string, clicked: Function, classAdd?: string}) {
    return (
        <button className={"bg-blue-500 hover:bg-blue-400 p-2 m-5 " + classAdd} onClick={() => {clicked()}}>{text}</button>
    )
}