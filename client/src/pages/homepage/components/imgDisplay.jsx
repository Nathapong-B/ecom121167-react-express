import { useEffect, useRef, useState } from "react";
import { getImgPosition0 } from "../../util/utilProduct";

export default function ImagesDisplay(props) {
    const { data } = props;
    const [indexImgShow, setIndexImgShow] = useState(0);
    // const [loaded, setLoaded] = useState(false);
    const listRef = useRef();

    const hdlShowImage = (index) => {
        try {
            return data[index].url;
        } catch (err) {
            console.log(err)
            return location.reload(); // error อะไรไม่รู้ รีโหลดใหม่แม่ม
        };
    };

    const moveScroll = (index) => {
        const listEl_W = document.getElementById('imgListEl').clientWidth; // ความกว้างของ element ที่มองเห็น
        const imgListContainerEl = document.getElementById('imgListContainerEl');
        const imgsEl = document.querySelectorAll('#imgEl') // ใช้ดู property ของ element ได้
        const imgEl_W = imgsEl && imgsEl[0].clientWidth; // ความกว้างของ 1 element ที่เก็บรูปภาพ 1 รูปภาพ

        const midView = Math.floor((listEl_W / 2) - (imgEl_W / 2)); // กึ่งกลางของ element view
        const posImg = (imgEl_W * index); // ตำแหน่งของรูปภาพใน element container

        imgListContainerEl.scrollLeft = posImg - midView;
    };

    const hdlClickImg = (index) => {
        setIndexImgShow(index);
        moveScroll(index);
    };

    const hdlKeypress = (e) => {
        if (e.key === "ArrowRight") {
            if (indexImgShow < data.length - 1) {
                setIndexImgShow(prev => prev + 1);
                moveScroll(indexImgShow + 1);
            } else {
                setIndexImgShow(0);
                moveScroll(0);
            };
        };

        if (e.key === "ArrowLeft") {
            if (indexImgShow > 0) {
                setIndexImgShow(prev => prev - 1);
                moveScroll(indexImgShow - 1);
                moveScroll(indexImgShow - 1);
            } else {
                setIndexImgShow(data.length - 1);
                moveScroll(data.length - 1);
            };
        };
    };

    const hdlBtn = (btn) => {
        const key = btn.target.name;
        hdlKeypress({ key })
    };

    useEffect(() => {
        listRef.current.addEventListener('keydown', hdlKeypress)

        return () => {
            try {
                listRef.current.removeEventListener('keydown', hdlKeypress)
            } catch (err) {
                return true;
            }
        };

    }, [indexImgShow, data]);

    return (
        <div className="">

            {/* img main */}
            <div className="w-full h-96 m-auto bg-white rounded mb-2">
                {data &&
                    <img id='showImgEl' src={hdlShowImage(indexImgShow)} alt="product-img" className="w-full h-96 object-contain"></img>
                }
            </div>

            {/* list */}
            <button ref={listRef} id="imgListEl" className="relative w-full h-28 outline-gray-300 cursor-default">
                <div className="absolute top-0 left-0 h-full content-center">
                    <button name="ArrowLeft" onClick={(e) => hdlBtn(e)} className="btn-prev-next"> &lt; </button>
                </div>

                <div id="imgListContainerEl" className="h-full flex overflow-x-auto imgcontain pb-2">
                    {data &&
                        data.map((e, i) => (
                            <div key={i} id='imgEl' className="w-32 min-w-32 content-center">
                                <img src={e.url} alt="product-img" onClick={() => hdlClickImg(i)} className="w-24 h-full m-auto bg-white object-contain cursor-pointer"></img>
                            </div>
                        ))
                    }
                </div>

                <div className="absolute top-0 right-0 h-full content-center">
                    <button name="ArrowRight" onClick={(e) => hdlBtn(e)} className="btn-prev-next"> &gt; </button>
                </div>
            </button>

        </div>
    )
};