export default function PrimaryButton({text, clicked}: {text: string, clicked: Function}) {
    return (
        <button className="bg-blue-500 hover:bg-blue-400 p-2 m-5" onClick={() => {clicked()}}>{text}</button>
    )
}