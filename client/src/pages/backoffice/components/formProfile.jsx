import { useEffect, useState } from "react"
import { hdlClickInput, hdlInputOnBlur, cssSetting } from "../../util/animateInputForm";
import UploadImageProfile from "./profile/uploadImageProfile";
import { useAuthStore } from "../../../ecomStore/authStore";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";
import LoadingCover from "../../loadingCover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../auth/components/zodConfig";

export default function FormProfile(props) {
    const { token, updateProfile } = useAuthStore(useShallow(s => ({
        token: s.token,
        updateProfile: s.actionUpdateProfile,
    })));
    const [data, setData] = useState(() => (props.data ? { ...props.data } : null));
    const { cssTopNag, cssTopNagDes } = cssSetting;
    const [dataImage, setDataImage] = useState();
    const [isLoadingCoverPage, setIsLoadingCoverPage] = useState(false);
    const { register, reset, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            address: data.address,
        }
    });

    // ข้อมูลรูปภาพที่ส่งมาจาก UploadImageProfile
    const hdlImageReturnData = (dataImg) => {
        setDataImage(dataImg);

    };

    const hdlSettingFormData = (profile, imgFile) => {
        const formData = new FormData();

        formData.append('data', JSON.stringify(profile));
        formData.append('image', imgFile);

        return formData;
    };

    const hdlSubmit = async (data) => {
        // e.preventDefault();
        setIsLoadingCoverPage(true);

        const formData = hdlSettingFormData(data, dataImage);

        const res = await updateProfile(formData, token);

        if (res.status === 200) {
            setIsLoadingCoverPage(false);
            toast.success(`${res.data.message}`);
        } else if (res.error) {
            setIsLoadingCoverPage(false);
            toast.error(`${res.error.message}`);
            hdlReset();
            console.log(res.error.message)
        };
    };

    const hdlReset = () => {
        reset({
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            address: data.address,
        });
        return setData(() => (props.data ? { ...props.data } : null));
    };

    const debug = (e) => {
        e.preventDefault();
        console.log('data : ', watch())
        // console.log('props.data : ', props.data)
    }

    return (
        <div className="flex justify-center">

            {/* loadingpage */}
            {/* <LoadingCover title={'Updating please wait.'} isLoading={true} /> */}
            <LoadingCover title={'Updating please wait.'} isLoading={isLoadingCoverPage} />

            {/* <button className="bo-btn-add bg-green-500" onClick={debug}>debug</button> */}
            <div className="w-1/3">

                <div className="font-bold text-center">Profile</div>

                <div className="py-4">
                    <UploadImageProfile data={data?.ProfileImage} returnData={hdlImageReturnData} />
                </div>

                <form className="my-4" onSubmit={handleSubmit(hdlSubmit)} onReset={() => hdlReset()}>
                    {/* <form className="my-4" onSubmit={() => hdlSubmit()} onReset={() => hdlReset()}> */}
                    <div className="relative flex items-center py-4">
                        <label name="first_name" id="label_first_name" htmlFor="first_name" className={watch().first_name ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>First name</label>

                        <input {...register("first_name")} required={errors.first_name} id="first_name" name="first_name" className="frm-input w-full required:text-red-500 focus:required:ring-red-500" onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)} value={watch().first_name ?? ''}></input>
                        {errors.first_name && (<p className="absolute bottom-0 text-red-500 text-xs">{errors.first_name.message}</p>)}
                    </div>

                    <div className="relative flex items-center py-4">
                        <label name="last_name" id="label_last_name" htmlFor="last_name" className={watch().last_name ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Last name</label>

                        <input {...register("last_name")} required={errors.last_name} id="last_name" name="last_name" className="frm-input w-full required:text-red-500 focus:required:ring-red-500" onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)} value={watch().last_name ?? ''}></input>
                        {errors.last_name && (<p className="absolute bottom-0 text-red-500 text-xs">{errors.last_name.message}</p>)}
                    </div>

                    <div className="relative flex items-center py-4">
                        <label name="phone" id="label_phone" htmlFor="phone" className={watch().phone ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Phone</label>

                        <input {...register("phone")} required={errors.phone} id="phone" name="phone" className="frm-input w-full required:text-red-500 focus:required:ring-red-500" onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)} value={watch().phone ?? ''}></input>
                        {errors.phone && (<p className="absolute bottom-0 text-red-500 text-xs">{errors.phone.message}</p>)}
                    </div>

                    <div className="relative py-4">
                        <label name="address" id="label_address" htmlFor="address" className={watch().address ? `label-input-animate ${cssTopNagDes}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Address</label>

                        <textarea {...register("address")} required={errors.address} id="address" name="address" className="frm-input w-full required:text-red-500 focus:required:ring-red-500" onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)} rows={5} value={watch().address ?? ''}></textarea>
                        {errors.address && (<p className="absolute bottom-1 text-red-500 text-xs">{errors.address.message}</p>)}
                    </div>

                    <div className="text-end py-4">
                        <button type="submit" className="bo-btn-add bg-sky-500 me-2">Save</button>
                        <button type="reset" className="bo-btn-add bg-red-500">Cancel</button>
                    </div>

                </form>

            </div>
        </div>
    )
};