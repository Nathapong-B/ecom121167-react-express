import { createSearchParams, Link } from "react-router-dom"
import { tokenExpire, tokenValidateRole } from "../auth/components/jwtValidate"
import { useAuthStore } from "../../ecomStore/authStore"


export default function Homepage() {
    // const token = useAuthStore(s => s.token);
    // const debug = () => {
    //     const res = tokenExpire(token);
    //     console.log(res)
    //     console.log(typeof (tokenValidateRole(token)))
    // };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div>
                {/* <button onClick={debug}>debug</button> */}
                {/* <Link to={{
                    pathname:'/testpath',
                    search:`?${createSearchParams({id:'123',name:'jon'})}`,
                }}>go test path</Link> */}

                <h1 className="text-4xl text-gray-500 font-bold">Welcome to My Home Page</h1>
                <div className="text-center text-gray-500 font-bold">
                    <Link to={'/auth/signin'}>Sign in</Link>
                    <span> / </span>
                    <Link to={'/auth/register'}>Register</Link>
                </div>
            </div>
        </div>
    )
}