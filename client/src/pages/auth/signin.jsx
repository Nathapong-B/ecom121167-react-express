import { useState } from "react"
import { useAuthStore } from "../../ecomStore/authStore";
// import { useMultiState } from "../../ecomStore/useMultiState";
import { useShallow } from 'zustand/react/shallow'
import { Link, useNavigate } from "react-router-dom";
import { hdlClickInput, hdlInputOnBlur, cssSetting } from "../util/animateInputForm";
import { toast } from "react-toastify";

export default function Signin() {
    const [dataForm, setDataForm] = useState({ email: '', password: '' });
    const { actionSignin, token, user } = useAuthStore(
        useShallow((state) => ({
            token: state.token,
            user: state.user,
            actionSignin: state.actionSignin,
        })),
    );
    const navigate = useNavigate();
    const { cssTopNag } = cssSetting;

    const hdlInputForm = (el) => {
        const inputName = el.target.name;
        const inputValue = el.target.value;
        setDataForm({ ...dataForm, [inputName]: inputValue });
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await actionSignin(dataForm);

            if (res.success) {
                // console.log(res)
                if (res.decoded.role === 'user') return navigate(-1);

                return navigate('/redirect');
            };

            if (res.error) {
                toast.error(res.error.message);
                // console.log(res.error.message);
            };

        } catch (err) {
            console.log(err)
            if (err.response?.data?.message) {
                console.log(err.response.data.message);
            } else {
                console.log(err.name, ' : ', err.message);
            }
        };
    };

    return (
        <div className="relative m-auto min-w-max w-96 h-max p-10 rounded rounded-md bg-gray-300/80">
            <div className="w-full min-w-60">
                <Link to={'/'}>
                    <div className="absolute top-2 left-2 font-bold text-10px text-gray-400 bg-gray-200 px-2 py-1 rounded rounded-full text-center contents-center cursor-pointer hover:text-gray-200 hover:bg-sky-500">
                        HOME
                    </div>
                </Link>

                <div className="text-center font-bold text-4xl text-gray-500 pb-6">Sign-in</div>

                <form onSubmit={hdlSubmit} className="w-full">

                    <div className="relative flex items-center py-4">
                        <label name="email" id="label_email" htmlFor="email" className={dataForm?.email ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>E-mail</label>

                        <input className="frm-input w-full" type='email' id="email" name='email' placeholder='' required value={dataForm.email ?? ''} onChange={e => hdlInputForm(e)} onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                    </div>

                    <div className="relative flex items-center py-4">
                        <label name="password" id="label_password" htmlFor="password" className={dataForm?.password ? `label-input-animate ${cssTopNag}` : `label-input-animate`} onClick={(e) => hdlClickInput(e)}>Password</label>
                        <input className="frm-input w-full" type='password' id="password" name='password' placeholder='' required value={dataForm.password ?? ''} onChange={e => hdlInputForm(e)} onClick={(e) => hdlClickInput(e)} onBlur={e => hdlInputOnBlur(e)}></input>
                    </div>

                    <div>
                        <button type='submit' className="bo-btn-add bg-sky-500 hover:bg-sky-400 my-4 py-2 w-full">Sign in</button>
                    </div>

                </form>

                <div className="text-end">
                    <span className="me-1 text-xs italic">or</span>
                    <Link to={'/auth/register'}>
                        <button className="inline hover:text-sky-500">Register</button>
                    </Link>
                </div>

            </div>

        </div>
    )
}