import { useEffect, useRef, useState } from "react";
import Header from "./components/header";
import NavBar from "./navbar";
import Card from "./components/card";
import { useEcomStore } from "../../ecomStore/useEcomStore";
import { useShallow } from "zustand/react/shallow";
import Footer from "./components/footer";
import BlockProducts from "./components/blockProducts";
import ProductsNewArrival from "./components/pNewarrival";
import ProductsBestSeller from "./components/pBestSeller";

export default function MainPage() {
    const { products, callListProduct } = useEcomStore(useShallow(s => ({
        products: s.products,
        callListProduct: s.actionCallListProduct,
    })));
    const [scrollTopEl, setScrollTop] = useState();
    const [clientHeightEl, setClientHeight] = useState(1000);
    const headerRf = useRef();

    let decimal = ((((clientHeightEl - scrollTopEl) * 100) / clientHeightEl) / 100).toFixed(2);

    const callProducts = async () => {
        const res = await callListProduct(6);
        res.error ? alert(`${res.error.message}`) : '';
    };

    useEffect(() => {
        if (!products) {
            callProducts();
        };

        root.style.setProperty('--hscreen', `${clientHeightEl * 2}px`);

        window.addEventListener('scroll', () => {
            const {
                scrollTop,
                // scrollHeight,
                clientHeight
            } = document.documentElement;

            setScrollTop(scrollTop)
            // setScrollHeight(scrollHeight)
            setClientHeight(clientHeight)
        });

    }, []);

    const headersDisplayNone = () => {
        const hidden = headerRf.current?.classList.contains('hidden');

        if (decimal < 0.5 && !hidden) {
            root.style.setProperty('--hscreen', `${scrollTopEl * 1.5}px`);
            headerRf.current.classList.add('hidden');
        } else if (headerRf.current && decimal > 0.5 && hidden) {
            headerRf.current.classList.remove('hidden');
            root.style.setProperty('--hscreen', `${clientHeightEl * 2}px`);
        }
        return;
    };

    const stickyTop = () => {
        const pt = (scrollTopEl - clientHeightEl) + 150;
        if (pt > 0) {
            return pt;
        }
        return 0;
    };

    root.style.setProperty('--percentVh', `${decimal}`);
    root.style.setProperty('--stickyTop', `${(stickyTop())}px`);
    headersDisplayNone();


    const debug = () => {
        //
    };

    const arr = Array(25).fill(null);

    // console.log(products)

    return (
        <div className="flex flex-wrap justify-center">

            <div className="sticky top-0 w-screen z-50">
                <NavBar />
            </div>

            <div ref={headerRf} className={`bg-green-500 opacity-header w-full fixed top-0 z-40`}>
                <Header />
            </div>


            {/* main contents */}
            <div id='main_contents' className="pt-hscreen pb-8 w-full h-auto flex flex-wrap justify-center transition-all ease-out duration-500">

                {/* contents */}
                <div className="w-full md:w-9/12 h-max flex flex-col flex-wrap items-center md:items-end">

                    <div className="block-display">
                        <div className="block-title">สินค้าแนะนำ</div>
                        <BlockProducts products={products} />
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


                {/* right bar */}
                <div className="z-30 hidden md:block md:w-3/12 mt-2">
                    <div className="sticky-top m-auto w-3/4 transition-all ease-out duration-1000">
                        <Card style={"bg-gray-100"}>
                            <div className="card-title pt-2">สินค้าในตะกร้า</div>
                            <hr className="w-10/12 m-auto my-2 border-gray-400"></hr>
                            <div className="p-2">
                                5555555555555
                                sdfsdfsdfsdfs
                                sdfsdfsdfsdfsdfs
                            </div>
                        </Card>
                    </div>
                </div>

            </div>

            {/* footer */}
            <div className="w-full h-20 bg-gray-300">
                <Footer />
            </div>

        </div>
    )
};