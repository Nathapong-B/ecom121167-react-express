import { useEffect, useState } from "react";
import Header from "./components/header";
import ProductsNewArrival from "./components/pNewarrival";
import ProductsBestSeller from "./components/pBestSeller";
import ProductRecommend from "./components/pRecommend";
import StickyBoxCart from "./components/stickyBoxCart";

export default function MainPage() {
    const [scrollTopEl, setScrollTop] = useState(0);
    const [clientHeightEl, setClientHeight] = useState(0);
    const scrollRestoration = history.scrollRestoration;

    let decimal = ((((clientHeightEl - scrollTopEl) * 100) / clientHeightEl) / 100).toFixed(2); // toFixed() จำนวนตำแหน่งทศนิยม


    useEffect(() => {
        // ไม่ต้องให้คืนค่า scroll อัตโนมัติ เมื่อมีการรีโหลดหน้าเพจ เพื่อให้จัดการ scrollTop ด้วยตนเอง
        if (scrollRestoration === "auto") {
            history.scrollRestoration = "manual";
        };

        document.documentElement.scrollTop = 0;

        root.style.setProperty('--hscreen', `${clientHeightEl}px`);

        window.addEventListener('scroll', () => {
            const {
                scrollTop,
                clientHeight,
            } = document.documentElement;

            setScrollTop(() => scrollTop);
            setClientHeight(() => clientHeight);
        });

    }, []);

    const headersDisplayNone = () => {
        if (decimal < 0.9) {
            root.style.setProperty('--hscreen', `-${clientHeightEl - 60}px`);
        } else if (decimal > 0.9) {
            root.style.setProperty('--hscreen', `0px`);
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
        <div className="flex flex-wrap justify-center">

            {/* <button className="bo-btn-add" onClick={debug}>debug</button> */}

            {/* main contents */}
            <div id='main_contents' className="relative t-hscreen pb-8 w-screen h-auto flex flex-wrap justify-center transition-all ease-[cubic-bezier(0,50,99,0)] duration-300 z-50">

                <div className="w-full bg-green-500 h-screen mb-[60px]">
                    <Header />
                </div>

                {/* main contents */}
                <div className="w-full pe-2 md:pe-0 md:w-9/12 h-max flex flex-col flex-wrap items-center md:items-end">
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
                        <div></div>
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
    )
};