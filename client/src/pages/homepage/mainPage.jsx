import { useEffect, useRef, useState } from "react";
import Header from "./components/header";
import ProductsNewArrival from "./components/pNewarrival";
import ProductsBestSeller from "./components/pBestSeller";
import ProductRecommend from "./components/pRecommend";
import StickyBoxCart from "./components/stickyBoxCart";

export default function MainPage() {
    const [scrollTopEl, setScrollTop] = useState(0);
    const [clientHeightEl, setClientHeight] = useState(document.documentElement.clientHeight);
    const scrollRestoration = history.scrollRestoration;
    const mainRef = useRef();

    document.title = 'Home';

    let decimal = ((((clientHeightEl - scrollTopEl) * 100) / clientHeightEl) / 100).toFixed(2); // toFixed() จำนวนตำแหน่งทศนิยม

    const hdlMaincontentsHeight = () => {
        const elH = mainRef.current.clientHeight - clientHeightEl + 80;
        root.style.setProperty('--containersHeight', `${elH}px`);
        mainRef.current.classList.add(`containers-height`);
    };

    useEffect(() => {
        // ไม่ต้องให้คืนค่า scroll อัตโนมัติ เมื่อมีการรีโหลดหน้าเพจ เพื่อให้จัดการ scrollTop ด้วยตนเอง
        if (scrollRestoration === "auto") {
            history.scrollRestoration = "manual";
        };

        document.documentElement.scrollTop = 0;

        root.style.setProperty('--hscreen', `0px`);

        window.addEventListener('scroll', () => {
            const {
                scrollTop,
                clientHeight,
            } = document.documentElement;

            setScrollTop(() => scrollTop);
            setClientHeight(() => clientHeight);
        });

        hdlMaincontentsHeight();
    }, []);

    const headersDisplayNone = () => {
        if (decimal < 0.9) {
            root.style.setProperty('--hscreen', `-${clientHeightEl - 80}px`);
        } else if (decimal > 0.9) {
            root.style.setProperty('--hscreen', `0px`);
            // document.documentElement.scrollTop = 0;
        }
        return;
    };

    const stickyTop = () => {
        const pt = scrollTopEl - 100;
        if (pt > 0) {
            return pt;
        }
        return 0;
    };

    root.style.setProperty('--percentVh', `${decimal}`);
    root.style.setProperty('--stickyTop', `${(stickyTop())}px`);
    headersDisplayNone();

    const debug = () => {
        // console.log(cart)
        // if(!user) calluser()
    };

    return (
        <div className="flex flex-wrap justify-center relative h-max">

            {/* main contents */}
            <div ref={mainRef} id='main_contents' className="relative t-hscreen pb-8 w-full h-max flex flex-wrap justify-center transition-all ease-[cubic-bezier(0,50,99,0)] duration-300 z-50">

                <div className="w-full h-screen mb-[60px]">
                    <Header />
                </div>

                <div className="w-full max-w-6xl flex flex-wrap justify-center">

                    {/* main contents */}
                    <div className="w-full md:pe-0 md:w-9/12 h-max flex flex-col flex-wrap items-center">
                        <div className="block-display">
                            <ProductRecommend />
                        </div>

                        <div className="block-display">
                            <hr className="my-6 border-2 border-red-500"></hr>
                        </div>

                        <div className="block-display">
                            <ProductsNewArrival />
                        </div>

                        <div className="block-display">
                            <hr className="my-6 border-2 border-red-500"></hr>
                        </div>

                        <div className="block-display">
                            <ProductsBestSeller />
                        </div>

                        <div className="block-display">
                            <hr className="my-6 border-2 border-red-500"></hr>
                        </div>

                        <div className="block-display">
                            <div className="block-title w-max">ช้อปตามหมวดหมู่</div>
                            <div className="w-96 h-96 bg-red-500/50">
                                <input type="text" list="data_program" placeholder="input your languages" className="frm-input"></input>
                                <datalist id="data_program">
                                    <option>java</option>
                                    <option>c</option>
                                    <option>c++</option>
                                    <option>c#</option>
                                    <option>python</option>
                                    <option>javascript</option>
                                    <option>php</option>
                                </datalist>
                            </div>
                        </div>

                    </div>

                    {/* rigth box */}
                    <div className="z-30 hidden md:block md:w-3/12 mt-2">
                        <div className="sticky-top m-auto w-3/4 transition-all ease-out duration-1000">
                            <StickyBoxCart />
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
};