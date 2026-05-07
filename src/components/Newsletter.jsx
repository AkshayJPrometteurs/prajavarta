"use client"

import React, { memo } from "react";

const Newsletter = () => {
    return (
        <div className="bg-(--brand-primary-light) p-4 sm:p-5 border-l-[3px] border-(--brand-primary)">
            <div className="mr text-sm font-bold text-(--brand-primary) mb-1.5">
                दैनिक न्यूजलेटर
            </div>

            <p className="mr text-[13px] text-(--text-secondary) leading-normal mb-3">
                दिवसाच्या मुख्य बातम्या थेट आपल्या इनबॉक्समध्ये.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="email"
                    placeholder="email@example.com"
                    className=" flex-1 px-3 py-2 border border-(--border-default) rounded text-[13px] bg-white outline-none font-inherit w-full"
                />

                <button className="bg-(--brand-primary) text-white border-0 px-4 py-2 rounded text-[13px] font-semibold cursor-pointer whitespace-nowrap w-full sm:w-auto">
                    Subscribe
                </button>
            </div>
        </div>
    );
};

export default memo(Newsletter);