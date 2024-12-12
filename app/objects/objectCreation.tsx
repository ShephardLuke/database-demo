import SubmitButton from "../template/buttons/submitButton";

export default function ObjectCreation({newObject}: {newObject: () => void}) {

    return (
        <>
            <p className="pb-5 text-2xl underline">Object Creation</p>
            <SubmitButton text="CREATE_TEST" clicked={(newObject)}/>
        </>
    )
}