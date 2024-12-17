'use client'

import AllDatabases from "./allDatabases";
import Footer from "./template/global/footer";
import Header from "./template/global/header";

export default function Databases() { // Displaying every database allowing the user to view them and choose one or create/delete them

    return (
        <>
            <Header currentPage="Home"/>
            <div className="main">
                <AllDatabases/>
            </div>
            <Footer></Footer>
        </>
    )

}