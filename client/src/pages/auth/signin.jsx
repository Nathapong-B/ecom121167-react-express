import { useState } from "react"
import { useAuthStore } from "../../ecomStore/authStore";
// import { useMultiState } from "../../ecomStore/useMultiState";
import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from "react-router-dom";

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

    const hdlInputForm = (el) => {
        const inputName = el.target.name;
        const inputValue = el.target.value;
        setDataForm({ ...dataForm, [inputName]: inputValue });
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await actionSignin(dataForm);
            console.log(res)

            navigate('/redirect');

        } catch (err) {
            console.log(err)
            if (err.response?.data?.message) {
                console.log(err.response.data.message);
            } else {
                console.log(err.name, ' : ', err.message);
            }
        };
    };

    const debug = () => {
        console.log(token)
        console.log(user.user)
        console.log(typeof (user.role))
    }

    return (
        <>
            <h1>Sign in Page</h1>
            <button onClick={debug}>debug</button>

            <form onSubmit={hdlSubmit}>
                <div>
                    <input type='email' name='email' placeholder='E-mail' required onChange={e => hdlInputForm(e)}></input>
                </div>
                <div>
                    <input type='password' name='password' placeholder='password' required onChange={e => hdlInputForm(e)}></input>
                </div>
                <div>
                    <button type='submit'>Sign in</button>
                </div>
            </form>
        </>
    )
}