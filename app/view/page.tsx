import { Suspense } from "react";
import DatabaseDisplay from "./databaseDisplay";
import Footer from "../template/global/footer";
import Header from "../template/global/header";


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