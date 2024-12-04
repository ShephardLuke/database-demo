import { Suspense } from "react";
import DatabaseDisplay from "./databaseDisplay";
import Footer from "../website-shared/footer";
import Header from "../website-shared/header";


export default function View() { // Viewing one database
    
    return (
        <>
            <Header/>
                <Suspense>
                    <DatabaseDisplay></DatabaseDisplay>
                </Suspense>
            <Footer/>
        </>
    )
}