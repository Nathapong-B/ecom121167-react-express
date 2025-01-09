import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ImgSort from "./imgSort";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable";
import Swal from "sweetalert2";

// props:{
// dataImg (โหมด update product) ข้อมูลรูปภาพที่รับมาแสดงผล ในโหมด add product จะไม่มีข้อมูลชุดนี้
// updateImg ข้อมูลรูปภาพที่ส่งกลับ
// }
export default function UploadImages(props) {
    const elInputImg = useRef();
    const [imgSelect, setImgSelect] = useState(() => (props.dataImg ? [...props.dataImg] : []));
    const [countId, setCountId] = useState(imgSelect.length);
    const [isDragging, setIsDragging] = useState();
    const [removeImages, setRemoveImages] = useState([]);

    // code
    const hdlClickInputFile = () => {
        elInputImg.current.click();
    };

    const hdlSelectImages = (item) => {
        const files = [...item.target.files];
        elInputImg.current.value = ''; // เคลียร์ค่า input เพื่อให้สามารถเลือกไฟล์ซ้ำได้จาก onChenge

        if ((imgSelect.length + files.length) > 8) {
            // alert imgselect max 8 item
            toast.warning('Select images max 8');
            return false;
        };

        for (let i of files) {
            const index = imgSelect.findIndex(e => e.name === i.name)

            if (index !== -1) return toast.warning('Image has already or duplicate image names');
        }

        files.map((el, i) => el.id = (i + countId).toString()); // เพิ่มคีย์ id เพื่อนำไปใช้กับ dnd sortable

        setImgSelect(prev => ([...prev, ...files]));
        setCountId(prev => (prev + files.length));

    };

    const hdlSetPositionImages = (images) => {
        images.map((e, i) => e.position = i); // เพิ่มคีย์ position เพื่อใช้ในการจัดตำแหน่งของรูปภาพ
        return images;
    };


    const hdlDragStart = (e) => {
        const index = imgSelect.findIndex(el => el.id === e.active.id);
        setIsDragging(() => { return imgSelect[index] });
    };

    const hdlDragEnd = (e) => {
        setIsDragging();
        const { active, over } = e;

        if (!over) return true;
        if (active.id === over.id) return true;

        setImgSelect(imgSelect => {
            const oldPos = imgSelect.findIndex(el => el.id === active.id);
            const newPos = imgSelect.findIndex(el => el.id === over.id);

            return arrayMove(imgSelect, oldPos, newPos);
        });
    };

    const hdlRemoveImg = async (e) => {
        const eventClick = await Swal.fire({
            title: 'Remove image ?',
            icon: 'question',
            showCancelButton: true,
        });

        if (eventClick.isConfirmed) {
            setImgSelect(() => {
                const filterImg = imgSelect.filter(el => el.id !== e.id);
                return [...filterImg];
            });

            settingRemoveImages(e);
            toast.success('Remove image done');
            return true;
        } else {
            return console.log('cancel')
        }
    };

    const elBtnRemoveImg = (e) => {
        return (
            <button className="absolute -top-2 end-0 bg-red-500 z-20 rounded-full px-2 text-gray-200 font-medium hover:text-gray-50 hover:bg-red-600" onClick={() => hdlRemoveImg(e)}>X</button>
        )
    };

    const settingRemoveImages = (img) => {
        if (!img.url) return false;

        setRemoveImages((prev) => ([...prev, img]));
        return true;
    };

    const settingAddNUpdateImages = (imgs) => {
        const updateImages = imgs.filter((e) => e.url);
        const addImages = imgs.filter((e) => !e.url);

        return { updateImages, addImages: addImages.map(e => ({ image_name: e.name, position: e.position })) }
    };

    const settingFileImages = (imgs) => {
        return { fileImages: imgs.filter(e => !e.url) }
    };

    const settingDataImgs = (imgs) => {
        return {
            removeImages: removeImages,
            addImages: settingAddNUpdateImages(hdlSetPositionImages(imgs)).addImages,
            updateImages: settingAddNUpdateImages(hdlSetPositionImages(imgs)).updateImages,
            images: settingFileImages(hdlSetPositionImages(imgs)).fileImages
        };
        // removeImages: [{ id, public_id }] //ลบข้อมูลรูปภาพใน db และ cloudinary (ลบข้อมูลใน db prisma คืนค่าข้อมูลที่ลบสำเร็จ นำข้อมูล public_id ไปลบใน cloudinary)
        // addImages: [{ image_name, position }] //ข้อมูลรูปภาพที่ต้องการเพิ่มเข้ามาใหม่ ใช้สำหรับเปรียบเทียบกับข้อมูลที่รีเทิร์นกลับมาจาก cloud
        // updateImages: [{ id, position }] //แก้ไขตำแหน่งของรูปภาพ
        // fileImg // เก็บไฟล์ไบนารี่รูปภาพ
    };

    // console.log('output : ',settingDataImgs(imgSelect))
    useEffect(() => {
        props.returnImg(settingDataImgs(imgSelect));
    }, [imgSelect]);

    return (
        <div>
            <input type="file" multiple ref={elInputImg} className="hidden" onChange={(e) => hdlSelectImages(e)}></input>
            {imgSelect.length >= 8
                ?
                <></>
                :
                <button className="bo-btn-add bg-sky-500" onClick={() => hdlClickInputFile()}>Upload Images</button>
            }

            <div className="w-full h-20 flex gap-2 mt-4">
                {imgSelect.length > 0
                    ?
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragStart={hdlDragStart}
                        onDragEnd={hdlDragEnd}>
                        <SortableContext items={imgSelect} strategy={horizontalListSortingStrategy}>
                            {imgSelect.map((e, i) => (
                                <div key={i} className="flex relative">
                                    {!isDragging ? elBtnRemoveImg(e) : null}
                                    <ImgSort data={e} dragging={isDragging?.id === e.id ? true : false} />
                                </div>
                            ))}
                        </SortableContext>

                        <DragOverlay>
                            {isDragging ? <ImgSort data={isDragging} dragging={isDragging ? true : false} /> : null}
                        </DragOverlay>

                    </DndContext>

                    : <></>
                }

            </div>

        </div>
    )
};