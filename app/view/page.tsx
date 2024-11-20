import { Suspense } from "react";
import DatabaseDisplay from "./databaseDisplay";
import Footer from "../footer/footer";


export default function View() {
    
    return (
        <>
            <div className="text-center">
                <Suspense>
                    <DatabaseDisplay></DatabaseDisplay>
                </Suspense>
                <Footer></Footer>
            </div>
        </>
    )
}