import { useState } from "react";
import ListProducts from "./components/listProducts";
import ListProductsInactive from "./components/listProductsInactive";
import AddNUpdateProduct from "./components/addNupdateProduct";

export default function Products() {
    const [openaddNupdateProduct, setOpenaddNupdateProduct] = useState(false);
    const [dataToUpdate, setDataToUpdate] = useState();
    const [showActivePage, setShowActivePage] = useState(true);

    const hdlAddNUpdateSuccess = () => {
        setDataToUpdate();
        setOpenaddNupdateProduct(false);
    };

    const hdlClickAddNUpdateProduct = (item) => {
        if (item.product_name) {
            setDataToUpdate(item);
            setOpenaddNupdateProduct(true);
            return;
        };

        if (item.target.name) {
            return setOpenaddNupdateProduct(true);
        };
    };

    const hdlShowActivePage = (item) => {
        const btnName = item.target.name;

        if (btnName === 'active') return setShowActivePage(true);
        if (btnName === 'inactive') return setShowActivePage(false);
    };

    return (
        <div>
            <div className="bo-title">Products Management</div>

            <div>

                {
                    !openaddNupdateProduct
                        ?
                        <div>
                            <div className="text-end">
                                <button name="btn-add" className="bo-btn-add bg-sky-500 py-1" onClick={hdlClickAddNUpdateProduct}>+ ADD NEW PRODUCT</button>
                            </div>

                            <div className={showActivePage ? "mt-6 ps-2 flex gap-2 border-b-2 border-green-500" : "mt-6 ps-2 flex gap-2 border-b-2 border-gray-500"}>
                                <button name="active" onClick={(e) => hdlShowActivePage(e)} className={showActivePage ? 'font-bold bg-green-500 px-2 rounded-t text-gray-200' : 'px-2'}>Active</button>
                                <button name="inactive" onClick={(e) => hdlShowActivePage(e)} className={showActivePage ? 'px-2' : 'font-bold bg-gray-500 px-2 rounded-t text-gray-200'}>Inactive</button>
                            </div>

                            <div>
                                {/* component table list products */}
                                {showActivePage
                                    ?
                                    <ListProducts data={hdlClickAddNUpdateProduct} />
                                    :
                                    <ListProductsInactive />
                                }
                            </div>
                        </div>
                        :
                        <AddNUpdateProduct data={dataToUpdate} processDone={hdlAddNUpdateSuccess} />
                }

            </div>

        </div >
    );
};