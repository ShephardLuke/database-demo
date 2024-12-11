export default function SuccessMessage({text, success=true}: {text?: string, success?: boolean}) {
    return (
        <p className={success? "text-green-500" : "text-red-500"}>{text}</p>
    )
}