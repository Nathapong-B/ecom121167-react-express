import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../../../ecomStore/authStore";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function ListProductsInactive() {
    const token = useAuthStore(s => s.token);
    const { inactiveProducts, callInactiveData, updateStatus, removeProduct } = useEcomStore(
        useShallow((s) => ({
            inactiveProducts: s.inactiveProducts,
            callInactiveData: s.actionCallListInactiveProducts,
            updateStatus: s.actionUpdateStatusProduct,
            removeProduct: s.actionRemoveProduct,
        }))
    );

    const callInactive = async () => {
        const res = await callInactiveData(6, token)

        if (res.status === 200) {
            // console.log(res)
        } else if (res.error) {
            toast.error(res.error.message)
            console.log(res)
        }
    };

    const hdlChangeStatus = async (item) => {
        const event = await Swal.fire({
            title: 'Change to active product ?',
            icon: 'question',
            text: `${item.product_name}`,
            showCancelButton: 'true'
        });

        if (event.isConfirmed) {
            const res = await updateStatus(item, token);

            if (res.status === 200) {
                toast.success(`${res.data.message}`);
            } else if (res.error) {
                toast.error(`${res.error.message}`);
                console.log(res.error.message)
            };
        };
    };

    const hdlRemoveProduct = async (item) => {
        const even = await Swal.fire({
            title: 'Remove Product ?',
            icon: 'warning',
            text: `${item.product_name}`,
            showCancelButton: 'true'
        });

        if (even.isConfirmed) {
            const id = item.id;
            const res = await removeProduct(id, token);

            if (res.status === 200) {
                toast.success(`${res.data.message}`);
            } else if (res.error) {
                toast.error(`${res.error.message}`);
                console.log(res.error.message)
            };
        };
    };

    useEffect(() => {
        if (!inactiveProducts) {
            callInactive();
        }
    }, []);

    return (
        <div>

            <table className="bo-tb">
                <thead>
                    <tr>
                        <th className="w-2/12">image</th>
                        <th className="w-4/12">Product name</th>
                        <th className="w-1/12">Stock</th>
                        <th className="w-1/12">Sold</th>
                        <th className="w-2/12">Status</th>
                        <th className="w-2/12">Delete</th>
                    </tr>
                </thead>

                <tbody>

                    {inactiveProducts
                        ? inactiveProducts.map((e, i) => (
                            <tr key={i} className="tb-tr-hover">
                                <td>
                                    {/* {e.Image[0]?.url} */}
                                    <img src={e.Image[0]?.url} className="img-list"></img>
                                </td>
                                <td>{e.product_name}</td>
                                <td className="text-center">{e.stock}</td>
                                <td className="text-center">{e.sold}</td>
                                <td className="text-center">
                                    <button className="bo-btn-add bg-gray-500" onClick={() => hdlChangeStatus(e)}>Inactive</button>
                                </td>
                                <td className="text-center">
                                    <button className="bo-btn-add bg-red-500" onClick={() => hdlRemoveProduct(e)}>Delete</button>
                                </td>
                            </tr>
                        ))
                        : <></>
                    }

                </tbody>
            </table>
        </div>
    )
};