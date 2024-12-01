import { Suspense } from "react";
import DatabaseDisplay from "./databaseDisplay";
import Footer from "../pageTemplates/footer";
import Header from "../pageTemplates/header";


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