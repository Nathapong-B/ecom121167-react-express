import { useEffect, useState } from "react"
import UploadImages from "./products/uploadImages";
import FormProduct from "./products/formProduct";
import { useAuthStore } from "../../../ecomStore/authStore";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";
import LoadingCover from "../../loadingCover";

export default function AddNUpdateProduct(props) {
    const [data, setData] = useState(() => (props.data ? props.data : null));
    const [productId, setProductId] = useState(() => (props.data?.id ? props.data.id : null));
    const [dataImg, setDataImg] = useState(() => (props.data?.Image ? [...props.data.Image] : null)); // เก็บข้อมูลรูปภาพ
    const [imgFile, setImgFile] = useState(); // เก็บไฟล์ไบนารี่
    const [eventAdd, setEventAdd] = useState(props.data ? false : true);
    const token = useAuthStore(s => s.token);
    const { addProduct, updateProduct } = useEcomStore(
        useShallow(s => ({
            addProduct: s.actionAddProduct,
            updateProduct: s.actionUpdateProduct
        }))
    );
    const [isLoadingCoverPage, setIsLoadingCoverPage] = useState(false);

    const hdlReturnImg = (imgs) => {
        setDataImg({ ...imgs }); // ข้อมูลรูปภาพ
        setImgFile([...imgs.images]); // ไฟล์ไบนารี่
    };

    const hdlReturnData = (product) => {
        setData({ ...product });
    };

    const hdlSettingDataProduct = (product, imgs) => {
        const { product_name, price, cost, description, stock, category_id } = product;
        return { product_name, price, cost, description, stock, category_id, image: [{ ...imgs }] };
    };

    const hdlSettingFormData = (productDetail, fileImg) => {
        const formData = new FormData();

        formData.append('data', JSON.stringify(productDetail));

        for (let e of fileImg) {
            formData.append('images', e);
        };

        return formData;
    };

    const hdlSubmit = async () => {
        const productDetail = hdlSettingDataProduct(data, dataImg);
        const formData = hdlSettingFormData(productDetail, imgFile);

        setIsLoadingCoverPage(true);

        if (eventAdd) {
            const res = await addProduct(formData, token);

            if (res.status === 200) {
                setIsLoadingCoverPage(false);
                toast.success(`${res.data.message}`);
                hdlSuccess();
            } else if (res.error) {
                setIsLoadingCoverPage(false);
                toast.error(`${res.error.message}`);
                console.log(res.error.message)
            };

        } else {
            const res = await updateProduct(productId, formData, token);

            if (res.status === 200) {
                setIsLoadingCoverPage(false);
                toast.success(`${res.data.message}`);
                hdlSuccess();
            } else if (res.error) {
                setIsLoadingCoverPage(false);
                toast.error(`${res.error.message}`);
                console.log(res.error.message)
            };
        };

        return;
    };

    // แจ้งให้ component product ทราบว่าดำเนินการเสร็จสิ้น(save,cancel) เพื่อปิด component นี้
    const hdlSuccess = () => {
        props.processDone()
    };

    return (
        <div className="flex flex-col items-center">

            {/* loadingpage */}
            {/* <LoadingCover title={'Processing please wait.'} isLoading={true} /> */}
            <LoadingCover title={'Processing please wait.'} isLoading={isLoadingCoverPage} />

            <div className="pb-4 font-medium">
                {props.data ? <div>Update product</div> : <div>Add new product</div>}
            </div>

            <div className="w-2/3">
                <UploadImages dataImg={dataImg} returnImg={hdlReturnImg} />
            </div>

            <div className="w-2/3">
                <FormProduct data={data} returnData={hdlReturnData} />
            </div>

            <div className="w-2/3 text-end">
                <button className="bo-btn-add bg-sky-500 me-2" onClick={() => hdlSubmit()}>Save</button>
                <button className="bo-btn-add bg-gray-500" onClick={hdlSuccess}>Cancel</button>
            </div>
        </div>
    )
};