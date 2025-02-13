import { useEffect, useState } from "react";


export const Time = () => {

    const [time, setTime] = useState<string>(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex items-center justify-center p-4 bg-blue-500 rounded mb-3 shadow-md">
            <div className="text-2xl text-white">
                <span>
                    {time}
                </span>
            </div>
        </div>
    )
}

export default Time;