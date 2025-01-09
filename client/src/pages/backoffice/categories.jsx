import { useState } from "react";
import AddCategory from "./components/addCategory";
import ListCategories from "./components/listCategories";
import ListCategoriesInactive from "./components/listCategoriesInactive";

export default function Categories() {
    const [showActivePage, setShowActivePage] = useState(true);

    const hdlShowActivePage = (item) => {
        const btnName = item.target.name;

        if (btnName === 'active') setShowActivePage(true)
        if (btnName === 'inactive') setShowActivePage(false)
    };

    return (
        <div>
            <div className="bo-title">Categories</div>

            <div>
                <div>
                    <AddCategory />
                </div>

                <div className={showActivePage?"mt-6 ps-2 flex gap-2 border-b-2 border-green-500":"mt-6 ps-2 flex gap-2 border-b-2 border-gray-500"}>
                    <button name="active" onClick={(e) => hdlShowActivePage(e)} className={showActivePage?'font-bold bg-green-500 px-2 rounded-t text-gray-200':'px-2'}>Active</button>
                    <button name="inactive" onClick={(e) => hdlShowActivePage(e)} className={showActivePage?'px-2':'font-bold bg-gray-500 px-2 rounded-t text-gray-200'}>Inactive</button>
                </div>

                <div>
                    {showActivePage
                        ?
                        <div>
                            {/* table list categories */}
                            <ListCategories />
                        </div>
                        :
                        <div>
                            <ListCategoriesInactive />
                        </div>
                    }

                </div>
            </div>
        </div>
    );
};