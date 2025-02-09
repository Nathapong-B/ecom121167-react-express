import { Link, NavLink } from "react-router-dom";
import { signOut } from "../auth/components/signout";
import LoadingCover from "../loadingCover";
import { useState } from "react";

export default function SideBar() {
    const [isLoadingCoverPage, setIsLoadingCoverPage] = useState(false);

    const hdlSignout = () => {
        setIsLoadingCoverPage(true)
        setTimeout(() => {
            setIsLoadingCoverPage(false);
            signOut({ isReload: true });
        }, 2000);
    };

    return (
        <div>

            {/* <LoadingCover title={'Processing please wait.'} isLoading={true} /> */}
            <LoadingCover title={'Processing please wait.'} isLoading={isLoadingCoverPage} />

            <div className="min-w-max m-auto text-gray-400 font-bold">

                <div className="mt-10 mb-16">
                    <div className="w-max m-auto">
                        <div className="text-end text-10px relative top-2">
                            <Link to={'/'}>
                                <span className="italic text-gray-500">goto</span>Home page
                            </Link>
                        </div>
                        <div className="text-2xl">ADMIN PANEL</div>
                    </div>
                </div>
                <div className="text-start pl-10 flex flex-col ">

                    <NavLink to={'dashboard'} className={({ isActive }) => isActive ? 'active-menu-sidebar' : 'menu-sidebar'}>
                        <button>
                            Dashboard
                        </button>
                    </NavLink>

                    <NavLink to={'categories'} className={({ isActive }) => isActive ? 'active-menu-sidebar' : 'menu-sidebar'}>
                        <button>
                            Categories
                        </button>
                    </NavLink>

                    <NavLink to={'product'} className={({ isActive }) => isActive ? 'active-menu-sidebar' : 'menu-sidebar'}>
                        <button>
                            Products
                        </button>
                    </NavLink>

                    <NavLink to={'order'} className={({ isActive }) => isActive ? 'active-menu-sidebar' : 'menu-sidebar'}>
                        <button>
                            Orders
                        </button>
                    </NavLink>

                    <NavLink to={'user'} className={({ isActive }) => isActive ? 'active-menu-sidebar' : 'menu-sidebar'}>
                        <button>
                            Users
                        </button>
                    </NavLink>

                    <NavLink to={'profile'} className={({ isActive }) => isActive ? 'active-menu-sidebar mt-4' : 'menu-sidebar mt-4'}>
                        <button>
                            Profile
                        </button>
                    </NavLink>

                </div>
                <hr className="m-5 border-gray-400"></hr>
                <div>
                    <button className="hover:text-gray-50" onClick={hdlSignout}>
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};