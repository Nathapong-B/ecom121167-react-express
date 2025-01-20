import Card from "./card";

export default function BlockProducts(props) {
    const { products } = props;

    return (
        <div>
            <div className="block-grid-rows">
                {products
                    ? products.map((e, i) => (
                        <div key={i} className="min-w-max p-2">
                            <Card style={"hover:card-box-shadow"}>
                                <div className="max-w-full flex justify-center bg-white p-2 cursor-pointer">
                                    <img src={`${e.Image[0].url}`} className="w-32 h-32 object-contain" ></img>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="card-title w-max">{e.product_name}</div>
                                    <div className="cursor-pointer pe-1 text-green-500 font-bold text-sm">+ADD</div>
                                </div>
                                <div className="card-body pb-2 w-full">
                                    <div className="text-overflow h-6 text-sm">{e.description}</div>
                                </div>
                                <div className="card-footer py-1 flex justify-between text-sm bg-gray-300">
                                    <div>Price</div>
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