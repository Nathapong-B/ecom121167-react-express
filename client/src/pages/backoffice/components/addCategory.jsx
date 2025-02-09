import { useState } from "react";
import { useAuthStore } from "../../../ecomStore/authStore";
import { useEcomStore } from "../../../ecomStore/useEcomStore";
import { toast } from "react-toastify";

export default function AddCategory() {
    const token = useAuthStore(s => s.token);
    const addCategory = useEcomStore(s => s.actionAddCategory);
    const [dataForm, setDataForm] = useState({ category_name: '' });

    const hdlOnchange = (e) => {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        setDataForm(prev => ({ ...prev, [inputName]: inputValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const res = await addCategory({ data: dataForm, token });
            const res = await addCategory({ data: dataForm, token });

            if (res.status === 200) {
                setDataForm({ category_name: '' });
                toast.success(`${res.data.message}`);
            } else if (res.error) {
                toast.error(`${res.error.message}`);
                console.log(res.error.message)
            };

        } catch (err) {
            console.log(err);
            if (err.response?.data?.message) {
                console.log(err.response.data.message);
            } else {
                console.log(err.name, ' : ', err.message);
            };
        };
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex p-5 border-2 border-gray-500 rounded relative">
                <div className="absolute -top-4 start-2 font-medium bg-gray-200 px-2">Add New Category</div>
                <div className="p-2 w-full text-center">
                    <input name="category_name" type="text" placeholder="Category name" className="frm-input w-1/2 me-2" onChange={e => hdlOnchange(e)} value={dataForm.category_name}></input>
                    <button className="bo-btn-add bg-sky-500 py-1">ADD</button>
                </div>
            </form>
        </>
    );
};