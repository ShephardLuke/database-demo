'use client'

import Footer from "../template/global/footer";
import Header from "../template/global/header";
import AllDatabases from "./allDatabases";

export default function Databases() { // Displaying every database allowing the user to view them and choose one or create/delete them

    return (
        <>
            <Header currentPage="Databases"/>
            <div className="main">
                <AllDatabases/>
            </div>
            <Footer></Footer>
        </>
    )

}