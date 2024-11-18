import { Suspense } from "react";
import Database from "./database";


export default function View() {
    
    return (
        <Suspense>
            <Database></Database>
        </Suspense>
    )
}