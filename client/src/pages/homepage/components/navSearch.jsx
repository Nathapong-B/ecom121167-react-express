import { useEffect, useRef, useState } from "react"
import { createSearchParams, useNavigate } from "react-router-dom";

export default function NavSearch() {
    const [inputHide, setInputHide] = useState(true);
    const [keyword, setKeyword] = useState();
    const inputRef = useRef();
    const boxSearchRef = useRef();
    const nav = useNavigate();

    const hdlOnClick = (e) => {
        inputRef.current.focus();
        setInputHide(false);

        const id = e?.target?.id;

        if (keyword && id) {
            console.log(id)
            hdlSubmit();
        }
    };

    const hdlOnblur = () => {
        if (keyword) return setInputHide(false);

        return setInputHide(true);
    };

    const hdlOutsideClick = (event) => {
        if (boxSearchRef.current && !boxSearchRef.current.contains(event.target)) {
            hdlOnblur();
        };
    };

    useEffect(() => {
        document.addEventListener('mousedown', hdlOutsideClick);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', hdlOutsideClick);
        };
    }, [keyword]);

    const hdlSubmit = (e) => {
        console.log('submit',e)
        e && e.preventDefault();

        keyword && nav({
            pathname: 'main/view-by-group',
            search: createSearchParams({ product_name: keyword }).toString()
        });
    };

    return (
        <div ref={boxSearchRef} onClick={() => hdlOnClick()} onMouseOver={() => hdlOnClick()}>
            <form onSubmit={hdlSubmit} className="relative flex items-center">
                <div className="flex h-7 w-max items-center rounded rounded-full bg-white box-shadow-normal overflow-hidden px-2 has-[:focus]:text-sky-500 has-[:focus]:ring-2" >
                    <label htmlFor="search" id="lbl_search" onClick={(e) => hdlOnClick(e)} className={`text-11px  px-1 rounded rounded-full ${inputHide ? '' : 'box-shadow-normal'} cursor-pointer select-none`}>ค้นหา</label>
                    <input ref={inputRef} id="search" onChange={(e) => setKeyword(e.target.value)} className={`${!inputHide ? 'ms-2 w-36' : 'w-0'} ring-none outline-none text-sm text-gray-500 transition-all duration-300`}></input>
                </div>
            </form>
        </div>
    )
};