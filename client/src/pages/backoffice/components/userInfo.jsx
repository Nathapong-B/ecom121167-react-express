import { useEffect, useRef, useState } from "react"
import MyModal from "../../MyModal"
import dayjs from "dayjs";

export default function UserInfo(props) {
    const [data, setData] = useState(props.data ?? null);
    const [dataImage, setDataImage] = useState(data.ProfileImage ?? null);

    const hdlClose = () => {
        props.close();
    };

    const addressNewLine = (item) => {
        if (!typeof (item) === 'string' || !item) return null;

        const arrStr = item.split("\n")

        return arrStr.map((e, i) => (<p key={i}>{e}</p>))
    };

    return (
        <MyModal>
            <div className="bo-title text-center">User Info</div>

            <div className="flex-1">

                <div className="relative bg-gray-100 w-24 h-24 m-auto rounded rounded-full overflow-hidden">
                    {!dataImage
                        ?
                        <div className="w-full h-full flex flex-col items-center justify-end">
                            <div className="bg-gray-300 w-2/5 h-2/5 rounded rounded-full"></div>
                            <div className="bg-gray-300 w-4/5 h-1/2 rounded-t-full"></div>
                        </div>
                        :
                        <div className="w-full h-full flex items-center justify-center">
                            <img src={dataImage.url ? dataImage.url : URL.createObjectURL(dataImage)}></img>
                        </div>
                    }
                </div>

                <div className="flex flex-col items-center m-auto w-2/3 pt-4">
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">Status :</label>
                        <div className={data.status==='active'?"flex-1 font-bold text-green-500 ps-2":"flex-1 font-bold text-gray-500 ps-2"}>{data.status ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">Role :</label>
                        <div className="flex-1 font-bold ps-2">{data.role ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">E-mail :</label>
                        <div className="flex-1 font-bold ps-2">{data.email ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">First Name :</label>
                        <div className="flex-1 font-bold ps-2">{data.first_name ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">Last Name :</label>
                        <div className="flex-1 font-bold ps-2">{data.last_name ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">Phone :</label>
                        <div className="flex-1 font-bold ps-2">{data.phone ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">Address :</label>
                        <div className="flex-1 font-bold ps-2">{addressNewLine(data.address) ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">Register Date :</label>
                        <div className="flex-1 font-bold ps-2">{dayjs(data.create_date).format("DD/MM/YYYY เวลา HH:mm:ss") ?? '-'}</div>
                    </div>
                    <div className="flex py-1 w-full">
                        <label className="flex-1 text-end">Last update :</label>
                        <div className="flex-1 font-bold ps-2">{dayjs(data.last_update).format("DD/MM/YYYY เวลา HH:mm:ss") ?? '-'}</div>
                    </div>

                </div>
            </div>

            <div className="text-center">
                <button className="bo-btn-add" onClick={hdlClose}>OK,</button>
            </div>
        </MyModal >
    )
};