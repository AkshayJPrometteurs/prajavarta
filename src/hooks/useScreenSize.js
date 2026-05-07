import { useEffect, useState } from "react";

const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
    "3xl": 1920,
    "4xl": 2560,
    "5xl": 3200,
    "6xl": 3840,
    "7xl": 4480,
};

const getScreenSize = (width) => {
    let current = "xs";

    for (const key in breakpoints) {
        if (width >= breakpoints[key]) {
            current = key;
        }
    }

    return current;
};

export const useScreenSize = () => {
    const getData = () => {
        if (typeof window === "undefined") {
            return null;
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        return {
            screenWidth,
            screenHeight,
            screenSize: getScreenSize(screenWidth),
        };
    };

    const [data, setData] = useState({ screenWidth: 0, screenHeight: 0, screenSize: "xs" });

    useEffect(() => {
        const handleResize = () => {
            const next = getData();
            if (next) setData(next);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return data;
};