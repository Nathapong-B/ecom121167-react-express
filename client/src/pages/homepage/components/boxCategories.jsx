export default function BoxCategories(props) {
    const { categoriesList } = props;

    return (
        <div className="box-float">
            <ul>
                {categoriesList
                    ? categoriesList.map((e, i) => (
                        <li key={i} className="p-2 hover:bg-gray-300 cursor-pointer">{e.category_name}</li>
                    ))
                    : <></>}
            </ul>
        </div>
    )
};