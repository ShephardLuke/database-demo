'use client'

import Footer from "../template/global/footer";
import Header from "../template/global/header";
import AllObjects from "./allObjects";

export default function Objects() {

    return (
        <>
            <Header currentPage="Objects"/>
                <div className="main">
                    <AllObjects/>
                </div>
            <Footer/>
        </>
    )
}