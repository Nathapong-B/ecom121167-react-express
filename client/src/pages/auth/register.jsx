import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { registerSchema } from "./components/zodConfig";
import { userRegister } from "../../api/userApi";

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

    const [pwdScore, setPwdScore] = useState(0);

    const onSubmit = async (data) => {
        try {

            const res = await userRegister(data);

            console.log(res)

            if (res.status === 200) console.log('Please login..');
        } catch (err) {
            console.log(err)
            console.log('err : ', err.response.data.message)
        };
    };

    const setColorBar = () => {
        if (pwdScore === 0) return 'white';
        if (pwdScore === 1) return 'bg-red-500';
        if (pwdScore === 2) return 'bg-yellow-500';
        if (pwdScore === 3) return 'bg-blue-500';
        if (pwdScore === 4) return 'bg-green-500';
    };

    const showPwdScoreBar = () => {
        return (
            Array(pwdScore).fill(null).map((el, index) => {
                return <div key={index} className={`w-1/4 h-1 ${setColorBar()}`}></div>
            })
        );
    };

    const setScorePwd = (pwd) => {
        setPwdScore(zxcvbn(pwd).score);
    };

    useEffect(() => {
        setScorePwd(watch().password);
    }, [watch().password]);

    const debug = () => {
        console.log('score -- ', pwdScore)
        console.log(errors)
    }

    return (
        <>
            <h1>Register Page</h1>
            {/* // email, password, confirm password */}
            <button onClick={debug}>debug</button>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input {...register("email")} placeholder='E-mail'></input>
                    {errors.email && (<p className="text-red-500 mb-2 text-xs">{errors.email.message}</p>)}
                </div>
                <div>
                    <input {...register('password')} placeholder='Password'></input>
                    {pwdScore > 0
                        ? <div className="flex w-full mt-1 mb-2">
                            {showPwdScoreBar()}
                        </div>
                        : <></>}
                    {errors.password && (<p className="text-red-500 mb-2 text-xs">{errors.password.message}</p>)}
                </div>
                <div>
                    <input {...register('confirmpassword')} placeholder="Confirm-Password"></input>
                    {errors.confirmpassword && (<p className="text-red-500 mb-2 text-xs">{errors.confirmpassword.message}</p>)}
                </div>
                <div>
                    <button type='submit'>Register</button>
                </div>
            </form>
        </>
    );
};