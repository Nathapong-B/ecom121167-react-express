import { useState } from "react";
import ListUsers from "./components/listUsers";
import UserInfo from "./components/userInfo";

export default function Users(props) {
    const [showActivePage, setShowActivePage] = useState(true);
    const [dataUserInfo, setDataUserInfo] = useState();

    const hdlShowActivePage = (item) => {
        const btnName = item.target.name;

        if (btnName === 'active') return setShowActivePage(true);
        if (btnName === 'inactive') return setShowActivePage(false);
    };

    const hdlUserInfo = (item) => {
        setDataUserInfo(item)
    };

    const hdlClose=()=>{
        setDataUserInfo();
    };

    return (
        <div>
            <div className="bo-title">Users Management</div>

            {!dataUserInfo
                ?
                <div>

                    <div className={showActivePage ? "mt-6 ps-2 flex gap-2 border-b-2 border-green-500" : "mt-6 ps-2 flex gap-2 border-b-2 border-gray-500"}>
                        <button name="active" onClick={(e) => hdlShowActivePage(e)} className={showActivePage ? 'font-bold bg-green-500 px-2 rounded-t text-gray-200' : 'px-2'}>Active</button>
                        <button name="inactive" onClick={(e) => hdlShowActivePage(e)} className={showActivePage ? 'px-2' : 'font-bold bg-gray-500 px-2 rounded-t text-gray-200'}>Inactive</button>
                    </div>

                    <div>
                        <ListUsers showActive={showActivePage} userInfo={hdlUserInfo} />
                    </div>
                </div>
                :
                <div>
                    <UserInfo data={dataUserInfo} close={hdlClose} />
                </div>
            }
        </div>
    );
};