export default function DatabaseInput({id, text, underline, placeholder}: {id : string, underline?: boolean, text?: string, placeholder?: string}) {
    return (
        <input value={text} id={id} className={"text-center bg-dark-blue border-2 m-4" + (underline ? " underline" : "")} placeholder={placeholder}/>
    )
}