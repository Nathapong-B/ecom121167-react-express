export default function BoxCart(props) {
    const { cart } = props;

    return (
        <div className="box-float right-0">
            <div>สินค้าเพิ่มเข้ามาล่าสุด</div>
            <hr className="border-gray-300 my-2"></hr>
            {!cart
                ?
                <div>
                    <ul>
                        <li>สินคต้า 1</li>
                        <li>สินคต้า 1</li>
                        <li>สินคต้า 1</li>
                        <li>สินคต้า 1</li>
                        <li>สินคต้า 1</li>
                        <li>สินคต้า 1</li>
                        <li>สินคต้า 1</li>
                        <li>สินคต้า 1</li>
                    </ul>
                    <hr className="border-gray-300 my-2"></hr>
                    <div className="text-end cursor-pointer">เพิ่มเติม..-&#62;</div>
                </div>
                :
                <div>ยังไม่มีสินค้าในตะกร้า</div>
            }
        </div>
    )
};