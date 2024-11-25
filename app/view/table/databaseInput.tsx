export default function DatabaseInput({changed, id, text, placeholder}: {changed: any, id:string, text?: string, placeholder?: string}) {
    return (
        <input value={text} id={id} onChange={(event) => changed(id, event)} className="text-center border-2 w-3/4" placeholder={placeholder}/>
    )
}