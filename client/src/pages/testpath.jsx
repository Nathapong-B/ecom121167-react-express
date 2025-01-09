import { useSearchParams } from "react-router-dom"

export default function TestPath() {
    const [param]=useSearchParams();
    const id = param.get('id')
    const name = param.get('name')

    console.log(id)
    return (
        <div>
            <div>Test Path</div>
        </div>
    )
};