import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ImgSort({ data, dragging }) {
    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition, } = useSortable({
            id: data.id,
            animateLayoutChanges: () => false, // เพิ่มบันทัดนี้ เมื่อมีการใช้ strategy={rectSwappingStrategy} เนื่องจากวัตถุมีการเคลื่อนที่บางอย่างที่ไม่พึงประสงค์
        });

    const cssImg = "h-20 w-20 bg-white/50 object-contain rounded active:opacity-50 ";

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}>
            <img src={data.url ? data.url : URL.createObjectURL(data)} className={dragging ? cssImg + " cursor-grabbing" : cssImg + " cursor-grab "}
            ></img>
        </div>
    )
};