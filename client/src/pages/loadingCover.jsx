import { useEffect, useState } from "react";

export default function LoadingCover({ loading, title = 'loading.' }) {
    const [count, setCount] = useState(0);

    const runInterval = () => {
        const interval = setInterval(() => {
            setCount(prev => {
                if (prev >= 5) {
                    return 0;
                };
                return prev + 1;
            });

            if (!loading) return clearInterval(interval);
        }, 1000);
    };

    useEffect(() => {
        runInterval();
    }, []);

    const mapDot = () => {
        return (
            Array(count >= 3 ? count % 3 : count).fill(null).map(() => {
                return '.'
            })
        );
    };

    return (
        <div className="h-screen w-screen bg-gray-500/50 flex justify-center items-center">
            <div className="w-full flex bg-white py-2">
                <div className="flex-1 text-end font-bold">{title}</div>
                <div className="flex-1 font-bold">{mapDot()}</div>
            </div>
        </div>
    )
};