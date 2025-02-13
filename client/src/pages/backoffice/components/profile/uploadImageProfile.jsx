import { useEffect, useRef, useState } from "react"

export default function UploadImageProfile(props) {
    const { data } = props;
    const elInput = useRef();
    const [dataImage, setDataImage] = useState(data ?? null);

    const hdlClickInputFile = () => {
        elInput.current.click();
    };

    const hdlSelectImages = (item) => {
        const file = item.target.files[0];
        elInput.current.value = '';
        setDataImage(file);
        props.returnData(file);
    };

    return (
        <div>
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

                <div className="absolute bottom-0 w-full">
                    <input type="file" ref={elInput} className="hidden" onChange={e => hdlSelectImages(e)}></input>
                    <button className="bg-gray-400/50 w-full text-gray-100 font-medium transition-all duration-500 hover:pb-4 hover:pt-2 hover:text-gray-50 hover:bg-gray-400/80" onClick={hdlClickInputFile}>UPLOAD</button>
                </div>

            </div>
        </div >
    )
};