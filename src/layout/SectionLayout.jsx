"use client"

import React, { memo } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";

const SectionLayout = ({ children, sidebar }) => {
    const { screenWidth } = useScreenSize();
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="space-y-4 col-span-3 md:col-span-2">
                {children}
            </div>

            {screenWidth >= 768 && sidebar}
        </div>
    );
};

export default memo(SectionLayout);