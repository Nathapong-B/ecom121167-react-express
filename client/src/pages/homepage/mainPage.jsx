import { useEffect, useRef, useState } from "react";
import Header from "./components/header";
import Card from "./components/card";
import ProductsNewArrival from "./components/pNewarrival";
import ProductsBestSeller from "./components/pBestSeller";
import ProductRecommend from "./components/pRecommend";
import StickyBoxCart from "./components/stickyBoxCart";

export default function MainPage() {
    const [scrollTopEl, setScrollTop] = useState(0);
    const [clientHeightEl, setClientHeight] = useState(1000);
    const headerRf = useRef();
    const scrollRestoration = history.scrollRestoration;

    let decimal = ((((clientHeightEl - scrollTopEl) * 100) / clientHeightEl) / 100).toFixed(2); // toFixed() จำนวนตำแหน่งทศนิยม

    
    useEffect(() => {
        // ไม่ต้องให้คืนค่า scroll อัตโนมัติ เมื่อมีการรีโหลดหน้าเพจ เพื่อให้จัดการ scrollTop ด้วยตนเอง
        if (scrollRestoration === "auto") {
            history.scrollRestoration="manual";
        };

        document.documentElement.scrollTop = 0;

        root.style.setProperty('--hscreen', `${clientHeightEl * 2}px`);

        window.addEventListener('scroll', () => {
            const {
                scrollTop,
                clientHeight
            } = document.documentElement;

            setScrollTop(() => scrollTop);
            setClientHeight(() => clientHeight);
        });

    }, []);

    const headersDisplayNone = () => {
        const hidden = headerRf.current?.classList.contains('hidden');

        if (decimal < 0.7 && !hidden) {
            root.style.setProperty('--hscreen', `${scrollTopEl * 1.5}px`);
            headerRf.current.classList.add('hidden');
        } else if (headerRf.current && decimal > 0.7 && hidden) {
            headerRf.current.classList.remove('hidden');
            root.style.setProperty('--hscreen', `${clientHeightEl * 2}px`);
        }
        return;
    };

    const stickyTop = () => {
        const pt = (scrollTopEl - clientHeightEl) + 360;
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

            <div ref={headerRf} className={`bg-green-500 opacity-header w-full fixed top-0 z-10`}>
                <Header />
            </div>

            {/* main contents */}
            <div id='main_contents' className="pt-hscreen pb-8 w-screen h-auto flex flex-wrap justify-center transition-all ease-out duration-500 z-50">

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
                       
                       <StickyBoxCart/>
                        {/* <Card style={"bg-gray-100"}>
                            <div className="card-title pt-2">สินค้าในตะกร้า</div>
                            <hr className="w-10/12 m-auto my-2 border-gray-400"></hr>
                            <div className="p-2">
                                5555555555555
                                sdfsdfsdfsdfs
                                sdfsdfsdfsdfsdfs
                            </div>
                        </Card> */}

                    </div>
                </div>

            </div>

        </div>
    )
};