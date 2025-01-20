import { useShallow } from "zustand/react/shallow";
import { useEcomStore } from "../../ecomStore/useEcomStore"
import { useEffect, useState } from "react";

export default function NavBar() {
    const { categoriesList, callListCategories } = useEcomStore(useShallow(s => ({
        categoriesList: s.categories,
        callListCategories: s.actionCallListCategoriesOnHome,
    })));
    const [categoriesBox, setCategoriesBox] = useState(false);
    const [basketBox, setBasketBox] = useState(false);

    useEffect(() => {
        if (!categoriesList) {
            callListCategories(6)
        }
    }, []);


    return (
        <div className="navbar w-full h-10 bg-gradient-to-r from-gray-500 via-sky-200 to-gray-500 flex items-center justify-between px-4 text-gray-200">
            <div className="flex gap-2">
                <div className="text-nav">หน้าหลัก</div>

                <div className="relative">
                    <div className="text-nav" onMouseOver={() => setCategoriesBox(true)} onMouseOut={() => setCategoriesBox(false)}>หมวดหมู่</div>
                    {categoriesBox
                        ?
                        <div className="bg-white absolute w-max p-2 rounded box-shadow text-gray-500" onMouseOver={() => setCategoriesBox(true)} onMouseOut={() => setCategoriesBox(false)}>
                            <ul>
                                {categoriesList
                                    ? categoriesList.map((e, i) => (
                                        <li key={i} className="p-2 hover:bg-gray-300 cursor-pointer">{e.category_name}</li>
                                    ))
                                    : <></>}
                            </ul>
                        </div>
                        : <></>
                    }
                </div>

            </div>

            <div>
                <div className="relative">
                    <div className="text-nav" onMouseOver={() => setBasketBox(true)} onMouseOut={() => setBasketBox(false)}>ตะกร้า</div>
                    {basketBox
                        ?
                        <div className="bg-white absolute right-0 w-max p-2 rounded box-shadow text-gray-500" onMouseOver={() => setBasketBox(true)} onMouseOut={() => setBasketBox(false)}>
                            <ul>
                                <li></li>
                            </ul>
                        </div>
                        : <></>
                    }
                </div>
            </div>
        </div>
    )
};