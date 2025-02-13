import { createSearchParams, useNavigate } from "react-router-dom";

export default function BoxCategories(props) {
    const { categoriesList } = props;
    const nav = useNavigate();

    const hdlClick = (item) => {
        const {id} = item;
        console.log(item)

        nav({
            pathname: 'main/view-by-category',
            search: createSearchParams({ cateId: `${id}` }).toString()
        })
    };

    return (
        <div className="box-float">
            <ul>
                {categoriesList
                    ? categoriesList.map((e, i) => (
                        <li key={i} onClick={() => hdlClick(e)} className="p-2 hover:bg-gray-300 cursor-pointer">{e.category_name}</li>
                    ))
                    : <></>}
            </ul>
        </div>
    )
};