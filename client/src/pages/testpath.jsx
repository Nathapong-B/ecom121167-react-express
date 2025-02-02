import { useSearchParams } from "react-router-dom"
import { useEcomStore } from "../ecomStore/useEcomStore";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function TestPath() {
    const [param] = useSearchParams();
    const id = param.get('id')
    const name = param.get('name')
    const { products, callListProducts } = useEcomStore(useShallow(s => ({
        callListProducts: s.actionCallListProduct,
        products: s.products,
    })));
    const [containerLeft, setContainerLeft] = useState(0);

    const elAttributed = () => {
        const view = document.getElementById('viewEl');
        const container = document.getElementById('containerEl');
        const viewClW = view.clientWidth;
        const containerClW = container.clientWidth;

        return { viewClW, containerClW }
    };

    const hdlResizeItems = () => {
        const { viewClW } = elAttributed();
        let itemsWidth;

        if (viewClW > 764) {
            itemsWidth = viewClW / 4;
        } else if (viewClW > 640) {
            itemsWidth = viewClW / 3;
        } else {
            itemsWidth = viewClW / 2;
        };

        root.style.setProperty('--iW', `${itemsWidth}px`);

        // reset container shift
        root.style.setProperty('--cLeft', `-${(0)}px`);
        setContainerLeft(0);
        return;
    };

    useEffect(() => {
        if (!products) {
            callListProducts(10);
        };

        hdlResizeItems();

        window.addEventListener('resize', hdlResizeItems);
    }, []);

    const pressNext = () => {
        const { containerClW, viewClW } = elAttributed();
        const cal = (containerClW - (containerLeft + viewClW));

        if (cal >= viewClW) {
            root.style.setProperty('--cLeft', `-${(containerLeft + viewClW)}px`);
            setContainerLeft((prev) => prev + viewClW);
            return;
        } else if (cal < viewClW && cal > 0) {
            root.style.setProperty('--cLeft', `-${(containerClW - viewClW)}px`);
            setContainerLeft(() => containerClW - viewClW);
            return;
        };
    };

    const pressPrev = () => {
        const { viewClW } = elAttributed();
        const cal = (containerLeft - viewClW);

        if (containerLeft !== 0) {
            if (cal >= viewClW) {
                root.style.setProperty('--cLeft', `-${(containerLeft - viewClW)}px`);
                setContainerLeft((prev) => prev - viewClW);
            } else if (cal < viewClW) {
                root.style.setProperty('--cLeft', `-${0}px`);
                setContainerLeft(0);
            };
        };
    };

    const hdlNextPrev = (item) => {
        const { name } = item.target;

        if (name === 'next') {
            pressNext();
        };

        if (name === 'prev') {
            pressPrev();
        };
    };

    console.log(products)

    const debug = () => {
        // console.log('devied : ', Math.floor(1555 / 300))
        // console.log('mod : ', 1555 % 300)
    }


    return (
        <div>
            <div>Test Path</div>
            <button className="bo-btn-add bg-green-500" onClick={debug} >debug</button>
            <button className="bo-btn-add bg-sky-500" popovertarget="testpopover">pop over</button>
            <div id="testpopover" popover='true' className="w-60 h-60 box-shadow">
                <div className="flex flex-col">
                    <div>pop over</div>
                    <button popovertarget="testpopover" popovertargetaction="hide" className="bo-btn-add bg-red-500">Close</button>
                </div>
            </div>

            <div id='viewEl' className="my-6 bg-green-500 w-screen overflow-hidden">
                <div className="flex justify-between">
                    <button name="prev" className="bo-btn-add" onClick={(e) => hdlNextPrev(e)}>--Prev</button>
                    <button name="next" className="bo-btn-add" onClick={(e) => hdlNextPrev(e)}>Next--</button>
                </div>

                <div id='containerEl' className="containerLeft bg-red-500 flex relative w-min transition-all duration-1000 ease-out">
                    {products
                        ? products.map((e, i) => (
                            <div name='datamap' key={i} className="items-Width border border-yellow-500 lg:border-sky-500">
                                <div className="max-w-60 max-h-60 m-auto">
                                    <img src={e.Image[0].url}></img>
                                </div>
                                <div>{e.product_name}</div>
                            </div>
                        ))
                        : <></>
                    }
                </div>

            </div>
        </div>
    )
};