import { Link } from "react-router-dom";

export default function LandingPage({ title, goto,linkto }) {
    return (
        // <div className="w-full h-screen flex justify-center items-center">
            <div>
                <h1 className="text-4xl text-gray-500 font-bold">{title}</h1>
                <Link to={`${linkto}`}> <div className="text-center text-gray-500 font-bold">{goto}</div></Link>
            </div>
        // </div>
    )
};