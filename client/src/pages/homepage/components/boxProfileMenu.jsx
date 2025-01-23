import { signOut } from "../../auth/components/signout";

export default function BoxProfileMenu() {

    const hdlSignOut = () => {
        signOut({ isReload: true });
    };

    return (
        <div className="box-float right-0">
            <div className="p-2 hover:bg-gray-300 cursor-pointer">Profile</div>
            <div className="p-2 hover:bg-gray-300 cursor-pointer">การซื้อของฉัน</div>
            <hr className="my-1"></hr>
            <div className="p-2 hover:bg-gray-300 cursor-pointer" onClick={() => hdlSignOut()}>Sign out</div>
        </div>
    )
};