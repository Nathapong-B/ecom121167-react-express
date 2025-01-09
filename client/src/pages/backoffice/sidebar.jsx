import { NavLink } from "react-router-dom";

export default function SideBar() {
    return (
        // <div className="w-full bg-green-900">
        <div className="min-w-max m-auto text-gray-400 font-bold">
            <div className="mt-10 mb-16 text-2xl">ADMIN PANEL</div>
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

            </div>
            <hr className="m-5 border-gray-400"></hr>
            <div>
                <button className="hover:text-gray-50">
                    Sign out
                </button>
            </div>
        </div>
        // </div>
    );
};