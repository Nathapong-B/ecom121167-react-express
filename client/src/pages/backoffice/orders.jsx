import ListOrdersAdmin from "./components/listOrdersAdmin";

export default function Orders(){
    return(
        <div>
            <div className="bo-title">Orders Management</div>

            <div>
                <ListOrdersAdmin />
            </div>
        </div>
    );
};