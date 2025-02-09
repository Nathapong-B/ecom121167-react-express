import { useState } from "react"
import { hdlClickInput, hdlInputOnBlur, cssSetting } from "../../util/animateInputForm";
import UploadImageProfile from "./profile/uploadImageProfile";
import { useAuthStore } from "../../../ecomStore/authStore";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";
import LoadingCover from "../../loadingCover";

export default function FormProfile(props) {
    const { token, updateProfile } = useAuthStore(useShallow(s => ({
        token: s.token,
        updateProfile: s.actionUpdateProfile,
    })));
    const [data, setData] = useState(() => (props.data ? { ...props.data } : null));
    const { cssTopNag, cssTopNagDes } = cssSetting;
    const [dataImage, setDataImage] = useState();
    const [onChange, setOnChange] = useState(false); // if image or fill onchange set true value
    const [isLoadingCoverPage, setIsLoadingCoverPage] = useState(false);

    // ข้อมูลรายประวัติ
    const hdlInputChange = (item) => {
        setData(prev => ({
            ...prev,
            [item.target.name]: item.target.value
        }));

        setOnChange(true);
    };

    // ข้อมูลรูปภาพที่ส่งมาจาก UploadImageProfile
    const hdlImageReturnData = (dataImg) => {
        setDataImage(dataImg);

        setOnChange(true);
    };

    const hdlSettingFormData = (profile, imgFile) => {
        const formData = new FormData();

        formData.append('data', JSON.stringify(profile));
        formData.append('image', imgFile);

        return formData;
    };

    // console.log(token)
    const hdlSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingCoverPage(true);

        const formData = hdlSettingFormData(data, dataImage);

        const res = await updateProfile(formData, token);

        if (res.status === 200) {
            setIsLoadingCoverPage(false);
            toast.success(`${res.data.message}`);
            setOnChange(false);
        } else if (res.error) {
            setIsLoadingCoverPage(false);
            toast.error(`${res.error.message}`);
            hdlReset();
            console.log(res.error.message)
        };
    };

    const hdlReset = () => {
        setOnChange(false);
        return setData(() => (props.data ? { ...props.data } : null));
    };

    const debug = (e) => {
        e.preventDefault();
        console.log('data : ', data)
        console.log('props.data : ', props.data)
    }

    if (data) {
        return (
            <div className="flex justify-center">

                {/* loadingpage */}
                {/* <LoadingCover title={'Updating please wait.'} isLoading={true} /> */}
                <LoadingCover title={'Updating please wait.'} isLoading={isLoadingCoverPage} />

                <button className="bo-btn-add" onClick={debug}>debug</button>
                <div className="w-1/3">

                    <div className="font-bold text-center">Profile</div>

                    <div className="py-4">
                        <UploadImageProfile data={data?.ProfileImage} returnData={hdlImageReturnData} onReset={!onChange} />
                    </div>
                    <form className="my-4" onSubmit={hdlSubmit} onReset={hdlReset}>
                        <div className="relative flex items-center py-4">
                            <button name="first_name" className={data?.first_name ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>First name</button>
                            <input name="first_name" className="frm-input w-full" value={data.first_name ?? ''} onChange={(e) => hdlInputChange(e)} onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                        </div>

                        <div className="relative flex items-center py-4">
                            <button name="last_name" className={data?.last_name ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Last name</button>
                            <input name="last_name" className="frm-input w-full" value={data.last_name ?? ''} onChange={(e) => hdlInputChange(e)} onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                        </div>

                        <div className="relative flex items-center py-4">
                            <button name="phone" className={data?.phone ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Phone</button>
                            <input name="phone" className="frm-input w-full" value={data.phone ?? ''} onChange={(e) => hdlInputChange(e)} onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                        </div>

                        <div className="relative py-4">
                            <button name="address" className={data?.address ? `label-input-animate ${cssTopNagDes}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Address</button>
                            <textarea name="address" value={data?.address ?? ''} onChange={e => hdlInputChange(e)} className="frm-input w-full" onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)} rows={5} ></textarea>
                        </div>

                        {/* {onChange
                            ? */}
                            <div className="text-end py-4">
                                <button type="submit" className="bo-btn-add bg-sky-500 me-2 btn-disabled" disabled={!onChange}>Save</button>
                                <button type="reset" className="bo-btn-add bg-red-500">Cancel</button>
                            </div>
                            {/* : <></>
                        } */}
                    </form>

                </div>
            </div>
        )
    } else {
        return (
            <div>No data</div>
        )
    }
};