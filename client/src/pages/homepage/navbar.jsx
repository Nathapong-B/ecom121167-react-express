import { useShallow } from "zustand/react/shallow";
import { useEcomStore } from "../../ecomStore/useEcomStore"
import { useEffect, useState } from "react";
import { useAuthStore } from "../../ecomStore/authStore";
import BoxCategories from "./components/boxCategories";
import BoxProfileMenu from "./components/boxProfileMenu";
import BoxCart from "./components/boxCart";
import { Link } from "react-router-dom";
import { useCartStore } from "../../ecomStore/useCartStore";

export default function NavBar() {
    const { profile } = useAuthStore(useShallow(s => ({
        profile: s.profile,
    })));
    const { categoriesList, callListCategories } = useEcomStore(useShallow(s => ({
        categoriesList: s.categories,
        callListCategories: s.actionCallListCategoriesOnHome,
    })));
    const { cart } = useCartStore(useShallow(s => ({
        cart: s.cart,
    })));
    const [categoriesBox, setCategoriesBox] = useState(false);
    const [basketBox, setBasketBox] = useState(false);
    const [profileBox, setProfileBox] = useState(false);

    const updateStore=()=>{
        useCartStore.persist.rehydrate()
    };

    useEffect(() => {
        if (!categoriesList) {
            callListCategories(6)
        };

        window.addEventListener('focus', updateStore);

    }, []);


    return (
        <div className="navbar w-full h-10 bg-gradient-to-r from-gray-500 via-sky-200 to-gray-500 flex items-center justify-between px-4 text-gray-200">
            <div className="flex gap-2">
                <div className="text-nav">
                    <Link to={'/main'}>
                        หน้าหลัก
                    </Link>
                </div>

                <div className="relative">
                    <div className="text-nav" onMouseOver={() => setCategoriesBox(true)} onMouseOut={() => setCategoriesBox(false)}>หมวดหมู่</div>
                    {categoriesBox
                        ? <div onMouseOver={() => setCategoriesBox(true)} onMouseOut={() => setCategoriesBox(false)}>
                            <BoxCategories categoriesList={categoriesList} />
                        </div>
                        : <></>
                    }
                </div>

            </div>

            <div className="flex gap-4 items-center">

                <div>
                    {profile
                        ?
                        <div className="relative">
                            <div className="flex gap-2 items-center" onMouseOver={() => setProfileBox(true)} onMouseOut={() => setProfileBox(false)}>
                                <div className="text-nav bg-white w-6 h-6 overflow-hidden rounded rounded-full">
                                    {profile.ProfileImage.url
                                        ? <img src={profile.ProfileImage.url} className="w-full h-full"></img>
                                        : <div className="w-full h-full flex flex-col items-center justify-end">
                                            <div className="bg-gray-300 w-2/5 h-2/5 rounded rounded-full"></div>
                                            <div className="bg-gray-300 w-4/5 h-1/2 rounded-t-full"></div>
                                        </div>
                                    }
                                </div>
                                <div className="text-nav">{profile.email}</div>
                            </div>

                            {profileBox
                                ? <div onMouseOver={() => setProfileBox(true)} onMouseOut={() => setProfileBox(false)}>
                                    <BoxProfileMenu />
                                </div>
                                : <></>
                            }

                        </div>
                        : <div className="text-nav">
                            <Link to={'/auth/signin'}>
                                Sign in
                            </Link>
                        </div>
                    }
                </div>

                <div className="relative">
                    <div className="text-nav flex" onMouseOver={() => setBasketBox(true)} onMouseOut={() => setBasketBox(false)}>
                        <div>
                            ตะกร้าสินค้า
                        </div>
                        <div className="bg-red-500 rounded rounded-full text-xs h-max w-max px-1 flex justify-center items-center">
                            <div>
                                {cart.length}
                            </div>
                        </div>
                    </div>
                    {basketBox
                        ? <div onMouseOver={() => setBasketBox(true)} onMouseOut={() => setBasketBox(false)}>
                            <BoxCart />
                        </div>
                        : <></>
                    }
                </div>
            </div>
        </div>
    )
};