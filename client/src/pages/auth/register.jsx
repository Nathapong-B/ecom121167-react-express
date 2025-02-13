import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { registerSchema } from "./components/zodConfig";
import { userRegister } from "../../api/userApi";
import { Link } from "react-router-dom";
import { hdlClickInput, hdlInputOnBlur, cssSetting } from "../util/animateInputForm";
import { toast } from "react-toastify";

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

    const [pwdScore, setPwdScore] = useState(0);
    const { cssTopNag } = cssSetting;

    const onSubmit = async (data) => {
        try {
            const res = await userRegister(data);

            if (res.status === 200) {
                toast.success('ลงทะเบียนเรียบร้อยแล้ว, กรุณาเข้าสู่ระบบ');
                console.log('Please login..');
            }
        } catch (err) {
            console.log(err)
            console.log('err : ', err.response.data.message)
            toast.error(err.response.data.message);
        };
    };

    // const setColorBar = () => {
    //     if (pwdScore === 0) return 'white';
    //     if (pwdScore === 1) return 'bg-red-500';
    //     if (pwdScore === 2) return 'bg-yellow-500';
    //     if (pwdScore === 3) return 'bg-blue-500';
    //     if (pwdScore === 4) return 'bg-green-500';
    // };
    const setColorBar = (i) => {
        if (i === 0) return 'bg-red-500';
        if (i === 1) return 'bg-orange-500';
        if (i === 2) return 'bg-yellow-500';
        if (i === 3) return 'bg-green-500';
    };

    const showPwdScoreBar = () => {
        return (
            Array(pwdScore).fill(null).map((el, index) => {
                // return <div key={index} className={`w-1/4 h-1 ${setColorBar(index)}`}></div>
                return (
                    <div key={index} className="w-1/4 h-1 px-1">
                        <div key={index} className={`w-full h-full ${setColorBar(index)}`}></div>
                    </div>
                )
            })
        );
    };

    const setScorePwd = (pwd) => {
        setPwdScore(zxcvbn(pwd).score);
    };

    console.log(errors)
    console.log(watch())

    useEffect(() => {
        setScorePwd(watch().password);
    }, [watch().password]);

    return (
        <div className="relative m-auto min-w-max w-96 h-max p-10 rounded rounded-md bg-gray-300/80">
            <div className="w-full min-w-60">
                <Link to={'/'}>
                    <div className="absolute top-2 left-2 font-bold text-10px text-gray-400 bg-gray-200 px-2 py-1 rounded rounded-full text-center contents-center cursor-pointer hover:text-gray-200 hover:bg-sky-500">
                        HOME
                    </div>
                </Link>

                <div className="text-center font-bold text-4xl text-gray-500 pb-6">Register</div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full">

                    <div className="relative flex items-center py-4">
                        <label name="email" id="label_email" htmlFor="email" className={watch().email ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>E-mail</label>

                        <input {...register("email")} required={errors.email} className="frm-input w-full required:text-red-500 focus:required:ring-red-500" id="email" name="email" placeholder='' onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                        {errors.email && (<p className="absolute bottom-0 text-red-500 text-xs">{errors.email.message}</p>)}
                    </div>

                    <div className="relative flex items-center py-4">
                        <label name="password" id="label_password" htmlFor="password" className={watch().password ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Password</label>

                        <input {...register('password')} type="password" required={errors.password} className="frm-input w-full required:text-red-500 focus:required:ring-red-500" id="password" name="password" placeholder='' onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                        {pwdScore > 0
                            ? <div className="flex w-full absolute bottom-0">
                                {showPwdScoreBar()}
                            </div>
                            : <></>}
                        {errors.password && (<p className="absolute bottom-0 text-red-500 text-xs">{errors.password.message}</p>)}
                    </div>

                    <div className="relative flex items-center py-4">
                        <label name="confirmpassword" id="label_confirmpassword" htmlFor="confirmpassword" className={watch().confirmpassword ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Confirm password</label>

                        <input {...register('confirmpassword')} type="password" required={errors.confirmpassword} className="frm-input w-full required:text-red-500 focus:required:ring-red-500" id="confirmpassword" name="confirmpassword" placeholder='' onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                        {errors.confirmpassword && (<p className="absolute bottom-0 text-red-500 text-xs">{errors.confirmpassword.message}</p>)}
                    </div>

                    <div>
                        <button type='submit' className="bo-btn-add bg-sky-500 hover:bg-sky-400 my-4 py-2 w-full">Register</button>
                    </div>
                </form>

                <div className="text-end">
                    <span className="me-1 text-xs italic">or</span>
                    <Link to={'/auth/signin'}>
                        <button className="inline hover:text-sky-500">Sign-in</button>
                    </Link>
                </div>

            </div>
        </div>
    );
};