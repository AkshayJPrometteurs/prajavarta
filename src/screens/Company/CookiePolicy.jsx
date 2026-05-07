"use client"

import { memo } from "react"
import MainLayout from "@/layout/MainLayout"

const COOKIE_TYPES = [
    {
        type: 'आवश्यक कुकीज',
        always: true,
        desc: 'वेबसाइट योग्यरित्या कार्य करण्यासाठी आवश्यक. या अक्षम करता येत नाहीत.',
        examples: ['session_id', 'csrf_token', 'cookieconsent'],
        purpose: 'लॉगिन स्थिती, सुरक्षा, फॉर्म सबमिशन',
        duration: 'सत्र संपेपर्यंत',
    },
    {
        type: 'विश्लेषण कुकीज',
        always: false,
        desc: 'वाचक वेबसाइट कसे वापरतात हे समजून घेण्यासाठी — आम्ही सामग्री सुधारण्यासाठी वापरतो.',
        examples: ['_ga', '_gid', '_gat'],
        purpose: 'पृष्ठ दृश्ये, वाचन वेळ, लोकप्रिय लेख',
        duration: '२ वर्षे',
    },
    {
        type: 'जाहिरात कुकीज',
        always: false,
        desc: 'तुमच्या आवडीनुसार संबंधित जाहिराती दाखवण्यासाठी वापरल्या जातात.',
        examples: ['_gcl_au', 'IDE', 'test_cookie'],
        purpose: 'जाहिरात लक्ष्यीकरण, फ्रिक्वेन्सी कॅपिंग',
        duration: '१३ महिने',
    },
    {
        type: 'कार्यात्मक कुकीज',
        always: false,
        desc: 'भाषा प्राधान्य, डार्क मोड, शेवटच्या वाचलेल्या बातम्या यासारख्या सेटिंग्ज लक्षात ठेवतात.',
        examples: ['lang_pref', 'theme', 'read_history'],
        purpose: 'वापरकर्ता प्राधान्ये आणि सेटिंग्ज',
        duration: '१ वर्ष',
    },
]

const CookiePolicy = () => {
    return (
        <MainLayout>
            <div className="border-b-4 border-(--brand-primary) pb-6 mb-10">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-3">
                    धोरण · POLICY
                </div>

                <h1 className="mr m-0 mb-3 text-[clamp(26px,3.5vw,40px)] font-extrabold leading-[1.1]">
                    कुकी धोरण
                </h1>

                <div className="text-[13px] text-(--text-tertiary)">
                    <span className="mr">अखेरचे अद्यतन: १ एप्रिल २०२६</span>
                </div>
            </div>

            <p className="mr text-[15px] leading-[1.8] text-(--text-secondary) mb-10 px-5.5 py-4.5 bg-(--surface-secondary) border-l-[3px] border-(--brand-primary)">
                कुकीज म्हणजे तुमच्या डिव्हाइसवर साठवल्या जाणाऱ्या लहान मजकूर फाइल्स. या वेबसाइट सुरळीत चालवण्यास, तुमचे अनुभव सुधारण्यास आणि संबंधित जाहिराती दाखवण्यास मदत करतात.
            </p>

            {/* Cookie types */}
            <div className="mb-12">
                <h2 className="mr text-[22px] font-extrabold mb-6 text-(--brand-primary)">
                    आम्ही कोणत्या कुकीज वापरतो
                </h2>

                <div className="flex flex-col gap-5">
                    {COOKIE_TYPES.map((c) => (
                        <div key={c.type} className="border border-(--border-default) overflow-hidden">
                            <div className="flex justify-between items-center px-5 py-3.5 bg-(--surface-secondary) border-b border-(--border-default) gap-3">
                                <div className="mr text-[15px] font-extrabold">
                                    {c.type}
                                </div>

                                <span className={`text-[11px] font-bold px-2.5 py-0.75 rounded-xl ${c.always ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
                                    {c.always ? 'नेहमी सक्रिय' : 'नियंत्रणयोग्य'}
                                </span>
                            </div>

                            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <div className="mr text-[11px] font-bold text-(--text-tertiary) uppercase mb-1.5">
                                        उद्देश
                                    </div>

                                    <p className="mr m-0 text-[13px] leading-[1.6] text-(--text-secondary)">
                                        {c.purpose}
                                    </p>
                                </div>

                                <div>
                                    <div className="mr text-[11px] font-bold text-(--text-tertiary) uppercase mb-1.5">
                                        कालावधी
                                    </div>

                                    <p className="mr m-0 text-[13px] text-(--text-secondary)">
                                        {c.duration}
                                    </p>
                                </div>

                                <div>
                                    <div className="mr text-[11px] font-bold text-(--text-tertiary) uppercase mb-1.5">
                                        उदाहरणे
                                    </div>

                                    <p className="m-0 text-xs font-mono text-(--text-secondary)">
                                        {c.examples.join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Browser control */}
            <div className="mb-12">
                <h2 className="mr text-[20px] font-extrabold mb-4 text-(--brand-primary)">
                    कुकीज कशा नियंत्रित कराव्यात
                </h2>

                <p className="mr text-[15px] leading-[1.8] text-(--text-secondary) mb-4">
                    बहुतेक ब्राउझर तुम्हाला कुकीज अवरोधित किंवा हटवण्याची परवानगी देतात:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Chrome', 'Firefox', 'Safari', 'Edge'].map((b) => (
                        <div key={b} className="p-3.5 border border-(--border-default) flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-(--brand-primary-light) rounded-full flex items-center justify-center text-base">
                                {b === 'Chrome' ? '●' : b === 'Firefox' ? '◐' : b === 'Safari' ? '◎' : '▣'}
                            </div>

                            <div>
                                <div className="text-[13px] font-bold">
                                    {b}
                                </div>

                                <div className="mr text-[11px] text-(--brand-primary) cursor-pointer">
                                    सेटिंग्ज पहा →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mr mt-4 text-[13px] text-(--text-tertiary) leading-[1.7]">
                    नोंद: कुकीज अक्षम केल्यास काही वेबसाइट वैशिष्ट्ये योग्यरित्या कार्य करणार नाहीत.
                </p>
            </div>

            <div className="p-5 border border-(--border-default) mb-12">
                <p className="mr m-0 text-sm text-(--text-secondary)">
                    प्रश्नांसाठी: <strong>privacy@prajavarta.com</strong>
                </p>
            </div>
        </MainLayout>
    )
}

export default memo(CookiePolicy)