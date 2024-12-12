import Footer from "./template/global/footer";
import Header from "./template/global/header";

export default function Home() {
    return (
        <>
            <Header currentPage="Home"/>
            <div className="main">
                <h1>Database Demo</h1>
            </div>
            <Footer/>
        </>
    )
}