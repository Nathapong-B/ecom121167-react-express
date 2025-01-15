import { useEffect, useState } from "react";
import { useAuthStore } from "../../../ecomStore/authStore";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useShallow } from "zustand/react/shallow";
import Swal from "sweetalert2";
import { toast } from 'react-toastify';

export default function ListCategoriesInactive() {
    const token = useAuthStore(s => s.token);
    const { callListCategories, updateStatus, removeCategory, inactiveCategories } = useEcomStore(
        useShallow((s) => ({
            inactiveCategories: s.inactiveCategories,
            updateStatus: s.actionUpdateStatusCategory,
            callListCategories: s.actionCallListCategories,
            updateCategory: s.actionUpdateCategory,
            removeCategory: s.actionRemoveCategory,
        }))
    );

    const hdlUpdateStatusCategory = async (item) => {
        const event = await Swal.fire({
            title: 'Change to Active Category ?',
            icon: 'question',
            text: `${item.category_name}`,
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

    const hdlRemoveCategory = async (item) => {
        const even = await Swal.fire({
            title: 'Remove Category ?',
            icon: 'warning',
            text: `${item.category_name}`,
            showCancelButton: 'true'
        });

        if (even.isConfirmed) {
            const id = item.id;
            const res = await removeCategory(id, token);

            if (res.status === 200) {
                toast.success(`${res.data.message}`);
            } else if (res.error) {
                toast.error(`${res.error.message}`);
                console.log(res.error.message)
            };
        };
    };

    useEffect(() => {
        if (!inactiveCategories) {
            callListCategories('inactive', token);
        }
    }, [])

    return (
        <div>
            {/* <div className="text-end px-5 py-2">
                <input type="text" placeholder="Search category" className="frm-input py-0"></input>
                <button className="bo-btn-add bg-sky-500 py-0 ms-1">Search</button>
            </div> */}

            <div>

                <table className="bo-tb">
                    <thead>
                        <tr>
                            <th className="w-3/4">Catagories</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {inactiveCategories
                            ? inactiveCategories.map((e, i) => (
                                <tr key={i} className="tb-tr">
                                    <td>
                                        <div className="relative w-max">
                                            <div>
                                                {e.category_name}
                                            </div>
                                            <div className="absolute top-0 -right-5 h-4 bg-yellow-200 flex items-center px-1 text-8px border border-orange-300 rounded-full">{e.Product.length}</div>
                                        </div>
                                    </td>

                                    <td className="text-center">
                                        <button className="bo-btn-add bg-gray-500" onClick={() => hdlUpdateStatusCategory(e)}>Inactive</button>
                                        <button className="bo-btn-add bg-red-500 ms-2" onClick={() => hdlRemoveCategory(e)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                            : <></>
                        }

                    </tbody>
                </table>

            </div>
        </div>
    )
};