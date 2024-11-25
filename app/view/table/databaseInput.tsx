export default function DatabaseInput({id, text, underline, placeholder}: {id : string, underline?: boolean, text?: string, placeholder?: string}) {
    return (
        <input value={text} id={id} className={"text-center border-2 w-3/4" + (underline ? " underline" : "")} placeholder={placeholder}/>
    )
}