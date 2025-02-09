import { useEffect, useState } from "react";
import "./cssLoading.css"

export default function LoadingCover({ isLoading, title = 'loading.' }) {
    // const [count, setCount] = useState(0);

    // const runInterval = () => {
    //     const interval = setInterval(() => {
    //         setCount(prev => {
    //             if (prev >= 5) {
    //                 return 0;
    //             };
    //             return prev + 1;
    //         });

    //         if (!isLoading) return clearInterval(interval);
    //     }, 1000);
    // };

    // useEffect(() => {
    //     runInterval();
    // }, []);

    // const mapDot = () => {
    //     return (
    //         Array(count >= 3 ? count % 3 : count).fill(null).map(() => {
    //             return '.'
    //         })
    //     );
    // };

    // return
    if (isLoading) {
        return (
            <div className="absolute top-0 left-0 z-50">
                <div className="h-screen w-screen bg-gray-500/50 flex justify-center items-center">
                    <div className="w-full flex bg-white py-2">
                        <div className="flex-1 text-end font-bold">{title}</div>
                        {/* <div className="flex-1 font-bold">{mapDot()}</div> */}
                        <div className="flex-1 content-center relative">
                            <div className="dot1"></div>
                            <div className="dot2"></div>
                            <div className="dot3"></div>

                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return <></>;
    }
};