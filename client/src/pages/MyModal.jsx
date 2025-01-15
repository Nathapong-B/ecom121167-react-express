export default function MyModal(props) {
    const { title } = props;

    return (
        <div className="absolute top-0 left-0 p-6 bg-gray-500/50 h-full w-full text-sm">
            <div className="box-shadow p-4 bg-gray-200 h-full overflow-y-auto rounded flex flex-col">

                {props.children}

            </div>
        </div>
    )
};