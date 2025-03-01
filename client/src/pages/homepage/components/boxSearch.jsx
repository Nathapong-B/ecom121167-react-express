import { useEffect, useState } from "react";
import { useEcomStore } from "../../../ecomStore/useEcomStore"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function BoxSearch(props) {
    const { category_id, product_name, price_s, price_e } = props.data;
    const categories = useEcomStore(s => s.categories);

    const [inputData, setInputData] = useState({
        product_name: product_name ?? null,
        category_id: category_id ?? null,
    });
    const [priceRange, setPriceRange] = useState(price_s || price_e ? [price_s, price_e] : [2000, 5000]);
    const [returnData, setReturnData] = useState({});

    useEffect(() => {
        setInputData({
            product_name: product_name ?? null,
            category_id: category_id ?? null
        });
    }, [props.data]);

    const hdlOnChange = (item) => {
        const { name, value } = item.target;
        setInputData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const hdlPriceChange = (priceVal) => {
        const name = priceVal.target?.name;
        let value = priceVal.target?.value;

        if (value === '') value = 0;

        if (name === 'priceStart') return setPriceRange((prev) => [parseInt(value), prev[1]]);

        if (name === 'priceEnd') return setPriceRange((prev) => [prev[0], parseInt(value)]);

        return setPriceRange(priceVal)
    };

    const hdlChecked = (item) => {
        let { name, checked, type, value } = item.target;

        if (type !== 'checkbox') {
            const elCbx = document.getElementsByName(name);
            checked = elCbx[0].checked
        };

        if (checked) {
            setReturnData(prev => {
                if (type !== 'checkbox') {
                    return {
                        ...prev,
                        [name]: value
                    }
                };

                return {
                    ...prev,
                    [name]: inputData[name]
                }
            });
        } else {
            returnData?.[name] && delete returnData[name];
        };

        return true;
    };

    const hdlSearch = () => {
        const elCbxPrice = document.getElementById('cbx_price').checked;

        if (elCbxPrice) {
            priceRange.sort((a, b) => a - b);
            if (priceRange[0] === priceRange[1]) priceRange[1] += 100;

            return props.returnData({ ...returnData, price: priceRange });
        };

        return props.returnData(returnData);
    };

    return (
        <div className="w-full max-w-[280px] min-w-max p-4 rounded bg-gray-300/50 ">
            <div className="mb-4 font-bold border-b border-sky-500">SEARCH</div>

            <div>
                {/* product name */}
                <div className="flex flex-col">
                    <div className="flex mb-1">
                        <input type="checkbox" id="cbx_name" name="product_name" onChange={(e) => hdlChecked(e)}></input>
                        <label htmlFor="cbx_name" className="text-sm ms-1">Product name</label>
                    </div>
                    <input id="search_name" name="product_name" className="frm-input text-sm" value={inputData.product_name ?? ''} onChange={e => { hdlOnChange(e), hdlChecked(e) }} placeholder="Input product name"></input>
                </div>

                {/* categories */}
                <div className="flex flex-col mt-4">
                    <div className="flex mb-1">
                        <input type="checkbox" id="cbx_category" name="category_id" onChange={(e) => hdlChecked(e)}></input>
                        <label htmlFor="cbx_category" className="text-sm ms-1">Category</label>
                    </div>
                    <select id="search_category" name="category_id" value={inputData.category_id ?? ''} className="frm-input text-sm" onChange={e => { hdlOnChange(e), hdlChecked(e) }}>
                        <option value='' disabled>Search from category</option>
                        {categories
                            ?
                            categories.map((e, i) => (
                                <option key={i} value={e.id}>{e.category_name}</option>
                            ))
                            :
                            <option>no data</option>
                        }
                    </select>
                </div>

                {/* price */}
                <div className="mt-6">
                    <div className="flex mb-1">
                        <input type="checkbox" id="cbx_price" name="price"></input>
                        <label htmlFor="cbx_price" className="text-sm ms-1">Price</label>
                    </div>

                    <div className="px-2 py-4 pb-8 border border-gray-400/50 rounded">
                        <div className="flex justify-between">
                            <div className="mb-2">
                                <label className="me-1">&#3647;</label>
                                <input name="priceStart" value={priceRange[0]} onChange={(e) => hdlPriceChange(e)} className="w-12 py-1 text-center text-xs outline-0"></input>
                            </div>

                            <div>-</div>

                            <div>
                                <label className="me-1">&#3647;</label>
                                <input name="priceEnd" value={priceRange[1]} onChange={(e) => hdlPriceChange(e)} className="w-12 py-1 text-center text-xs outline-0"></input>
                            </div>
                        </div>

                        <Slider
                            range
                            min={0}
                            max={20000}
                            step={100}
                            onChange={hdlPriceChange}
                            defaultValue={priceRange}
                            marks={{ '5000': '5,000', '10000': { 'label': '10,000', 'style': { 'color': 'orange' } }, '20000': { 'label': '20,000', 'style': { 'color': 'red' } } }}
                        />
                    </div>

                </div>

                <div className="text-center mt-4">
                    <button className="bo-btn-add bg-sky-500" onClick={() => hdlSearch()}>Search</button>
                </div>

            </div>

        </div>
    )
};