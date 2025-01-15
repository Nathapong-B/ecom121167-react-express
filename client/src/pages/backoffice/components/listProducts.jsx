import { useEffect, useState } from "react";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../ecomStore/authStore";
import Swal from "sweetalert2";

export default function ListProducts(props) {
    // const [dataProducts, setDataProducts] = useState();
    const token = useAuthStore(s => s.token);
    const { dataProducts, callListProducts, updateStatus } = useEcomStore(
        useShallow((s) => ({
            dataProducts: s.products,
            callListProducts: s.actionCallListProduct,
            updateStatus: s.actionUpdateStatusProduct,
        }))
    );

    const callDataListProducts = async () => {
        try {
            const res = await callListProducts(6);

            if (res.status === 200) {
                // console.log(res)
            } else if (res.error) {
                toast.error(res.error.message)
                console.log(res)
            }
        } catch (err) {
            console.log(err)
            console.log(err.response.data.message)
        }
    };

    const hdlChangeStatus = async (item) => {
        const event = await Swal.fire({
            title: 'Change to inactive product ?',
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

    useEffect(() => {
        if (!dataProducts) {
            callDataListProducts();
        }
    }, []);

    const hdlClickProduct = (e) => {
        props.data(e);
    };

    const sortArrImages = (arrImgs) => {
        return arrImgs.sort((a, b) => (a.position - b.position));
    };

    return (
        <div>

            <table className="bo-tb">
                <thead>
                    <tr>
                        <th className="w-2/12">image</th>
                        <th className="w-4/12">Product name</th>
                        <th className="w-2/12">Price</th>
                        <th className="w-1/12">Stock</th>
                        <th className="w-1/12">Sold</th>
                        <th className="w-2/12">Status</th>
                    </tr>
                </thead>

                <tbody>

                    {dataProducts
                        ? dataProducts.map((e, i) => (
                            <tr key={i} className="tb-tr-hover">
                                <td className="cursor-pointer" onClick={() => hdlClickProduct(e)}>
                                    {/* {e.Image[0]?.url} */}
                                    {/* <img src={e.Image[0]?.url} className="img-list"></img> */}
                                    <img src={sortArrImages(e.Image)[0]?.url} className="img-list"></img>
                                </td>
                                <td className="cursor-pointer" onClick={() => hdlClickProduct(e)}>{e.product_name}</td>
                                <td className="text-end">{e.price.toLocaleString('th-TH')}</td>
                                <td className="text-center">{e.stock}</td>
                                <td className="text-center">{e.sold}</td>
                                <td className="text-center">
                                    <button className="bo-btn-add bg-green-500" onClick={() => hdlChangeStatus(e)}>Active</button>
                                </td>
                            </tr>
                        ))
                        : <></>
                    }

                </tbody>
            </table>
        </div>
    );
};