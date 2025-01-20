import { Outlet } from "react-router-dom"
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate"
import { useState } from "react";
import HomepageCover from "./homepageCover";

export default function Homepage() {
    const path = window.location.pathname;
    const [homeCoverClose, setHomeCoverClose] = useState(false);

    const hdlCoverClose = (data) => {
        setHomeCoverClose(data);

    };

    const coverHidden = () => {
        if (homeCoverClose) return "hidden";
        return "";
    };

    return (
        <div className="relative w-full flex flex-col bg-main">

            {path === '/'
                ?
                <div className={`h-screen w-full fixed top-0 z-50 ${coverHidden()}`}>
                    <HomepageCover close={hdlCoverClose} />
                </div>
                : <></>
            }

            <div className="z-10">
                <Outlet />
            </div>

        </div>
    )
}