import Card from "./card";

export default function BlockProducts(props) {
    const { products } = props;

    const addToCart = (item) => {
        props.returnData(item);
    };

    return (
        <div>
            <div className="block-grid-rows">
                {products
                    ? products.map((e, i) => (
                        <div key={i} className="min-w-max p-2">
                            <Card style={"hover:card-box-shadow"}>
                                <div className="max-w-full flex justify-center bg-white p-2 cursor-pointer">
                                    <img src={e?.Image?.length > 0 ? `${e.Image[0].url}` : ''} className="w-32 h-32 object-contain" ></img>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="card-title w-max">{e.product_name.toUpperCase()}</div>
                                    <div className="cursor-pointer pe-2 text-green-500 font-bold" onClick={() => addToCart(e)}>+ADD</div>
                                </div>
                                <div className="card-body pb-2 w-full">
                                    <div className="text-overflow h-6 text-sm">{e.description}</div>
                                </div>
                                {/* <div className="card-footer py-1 flex justify-between text-sm bg-gray-300"> */}
                                <div className="card-footer pt-2 pb-4 text-red-500 text-center text-xl font-bold">
                                    {/* <div>Price</div> */}
                                    <div>{e.price.toLocaleString('th-TH')} .-</div>
                                </div>
                            </Card>
                        </div>
                    ))
                    : <></>
                }
            </div>
        </div>
    )
};