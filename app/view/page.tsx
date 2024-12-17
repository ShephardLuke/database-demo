import { Suspense } from "react";
import DatabaseDisplay from "./databaseDisplay";
import Header from "@/app/template/global/header";
import Footer from "@/app/template/global/footer";


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