export default function Card(props) {
    return (
        <div className={`card ${props.style}`}>
            {props.children}
        </div>
    )
};