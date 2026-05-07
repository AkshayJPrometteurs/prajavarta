"use client"

import { memo } from "react"
import MainLayout from "@/layout/MainLayout"

const PRINCIPLES = [
    {
        num: '०१',
        title: 'अचूकता (Accuracy)',
        body: 'प्रत्येक बातमी किमान दोन स्वतंत्र स्रोतांकडून पडताळणी केल्यानंतरच प्रकाशित केली जाते. अनुमान आणि तथ्य यांच्यात स्पष्ट फरक केला जातो.',
    },
    {
        num: '०२',
        title: 'निष्पक्षता (Impartiality)',
        body: 'आम्ही कोणत्याही राजकीय पक्ष, धर्म, जात किंवा व्यावसायिक हितसंबंधांशी बांधील नाही. प्रत्येक विषयावरील सर्व बाजू मांडण्याचा प्रयत्न केला जातो.',
    },
    {
        num: '०३',
        title: 'स्वातंत्र्य (Independence)',
        body: 'संपादकीय निर्णय संपूर्णपणे स्वतंत्र आहेत. जाहिरातदार, गुंतवणूकदार किंवा सरकार यांचा संपादकीय सामग्रीवर कोणताही प्रभाव नाही.',
    },
    {
        num: '०४',
        title: 'पारदर्शकता (Transparency)',
        body: 'आमचे आर्थिक हितसंबंध, मालकी आणि जाहिरातदारांची माहिती सार्वजनिक केली जाते. स्पॉन्सर केलेली सामग्री स्पष्टपणे ओळखली जाते.',
    },
    {
        num: '०५',
        title: 'जबाबदारी (Accountability)',
        body: 'चुका झाल्यास आम्ही त्या मान्य करतो, त्वरित दुरुस्ती प्रकाशित करतो आणि वाचकांना सूचित करतो. आमच्याबद्दल तक्रारी करण्याची प्रक्रिया उपलब्ध आहे.',
    },
    {
        num: '०६',
        title: 'मानवी प्रतिष्ठा (Human Dignity)',
        body: 'कोणत्याही व्यक्तीच्या जाती, धर्म, लिंग, वय किंवा अपंगत्वाच्या आधारावर भेदभाव करणारी सामग्री प्रकाशित केली जात नाही.',
    },
]

const PROCESS = [
    { step: '०१', label: 'वार्तांकन', desc: 'पत्रकार स्रोतांशी थेट संपर्क साधतात आणि प्राथमिक माहिती गोळा करतात.' },
    { step: '०२', label: 'पडताळणी', desc: 'किमान दोन स्वतंत्र स्रोतांकडून तथ्यांची पुष्टी केली जाते.' },
    { step: '०३', label: 'संपादन', desc: 'उपसंपादक भाषा, तथ्य आणि संदर्भ तपासतात.' },
    { step: '०४', label: 'प्रकाशन', desc: 'वरिष्ठ संपादकाच्या मान्यतेनंतरच महत्त्वाच्या बातम्या प्रकाशित होतात.' },
    { step: '०५', label: 'देखरेख', desc: 'प्रकाशनानंतरही बातम्यांवर लक्ष ठेवले जाते; आवश्यक असल्यास अद्यतन केले जाते.' },
]

const EditorialPolicy = () => {
    return (
        <MainLayout>
            <div className="border-b-4 border-(--brand-primary) pb-6 mb-10">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-3">
                    धोरण · POLICY
                </div>

                <h1 className="mr m-0 mb-3 text-[clamp(26px,3.5vw,40px)] font-extrabold leading-[1.1]">
                    संपादकीय धोरण
                </h1>

                <div className="text-[13px] text-(--text-tertiary)">
                    <span className="mr">
                        अखेरचे अद्यतन: १ जानेवारी २०२६
                    </span>
                </div>
            </div>

            <p className="mr text-base leading-[1.8] text-(--text-secondary) mb-12 px-6 py-5 bg-(--surface-secondary) border-l-[3px] border-(--brand-primary)">
                प्रजावार्ता उच्च दर्जाच्या पत्रकारितेसाठी वचनबद्ध आहे. आमचे संपादकीय धोरण आम्हाला वाचकांचा विश्वास टिकवून ठेवण्यास आणि मराठी पत्रकारितेची गुणवत्ता उंचावण्यास मदत करते.
            </p>

            {/* Principles */}
            <div className="mb-14">
                <h2 className="mr text-[22px] font-extrabold mb-7 text-(--brand-primary)">
                    मूलभूत तत्त्वे
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {PRINCIPLES.map((p) => (
                        <div
                            key={p.num}
                            className="p-6 border border-(--border-default)"
                        >
                            <div className="text-[28px] font-black text-(--brand-primary) opacity-25 leading-none mb-2">
                                {p.num}
                            </div>

                            <div className="mr text-base font-extrabold mb-2.5">
                                {p.title}
                            </div>

                            <p className="mr m-0 text-sm leading-[1.7] text-(--text-secondary)">
                                {p.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Process */}
            <div className="mb-14">
                <h2 className="mr text-[22px] font-extrabold mb-7 text-(--brand-primary)">
                    संपादकीय प्रक्रिया
                </h2>

                <div className="flex flex-col gap-0">
                    {PROCESS.map((p, i) => (
                        <div
                            key={p.step}
                            className={`grid grid-cols-[60px_1fr] gap-5 py-5 items-start
                                ${i < PROCESS.length - 1 ? 'border-b border-(--border-default)' : ''}
                            `}
                        >
                            <div className="w-12 h-12 bg-(--brand-primary) text-white rounded-full flex items-center justify-center font-black text-[13px] shrink-0">
                                {p.step}
                            </div>

                            <div>
                                <div className="mr text-base font-bold mb-1.5">
                                    {p.label}
                                </div>

                                <p className="mr m-0 text-sm leading-[1.7] text-(--text-secondary)">
                                    {p.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Corrections policy */}
            <div className="p-7 bg-(--surface-secondary) mb-12">
                <h2 className="mr text-[20px] font-extrabold mb-4 text-(--brand-primary)">
                    दुरुस्ती धोरण
                </h2>

                <p className="mr m-0 mb-3 text-[15px] leading-[1.8] text-(--text-secondary)">
                    चुका मानवी स्वभाव आहेत. आम्ही जेव्हा चूक करतो तेव्हा आम्ही ते स्पष्टपणे मान्य करतो. दुरुस्ती केल्यावर मूळ लेखात &ldquo;दुरुस्ती&rdquo; टॅग लावला जातो आणि बदलाचा तपशील नमूद केला जातो.
                </p>

                <p className="mr m-0 text-[15px] leading-[1.8] text-(--text-secondary)">
                    चुकीची माहिती आढळल्यास <strong>factcheck@prajavarta.com</strong> वर कळवा. आम्ही २४ तासांत उत्तर देऊ.
                </p>
            </div>

            {/* AI Policy */}
            <div className="p-6 border border-(--border-default) border-t-[3px] border-t-[#6A1B9A] mb-12">
                <div className="mr text-xs font-bold tracking-[0.06em] uppercase text-[#6A1B9A] mb-2.5">
                    AI धोरण
                </div>

                <h3 className="mr text-[18px] font-extrabold mb-3">
                    कृत्रिम बुद्धिमत्तेचा वापर
                </h3>

                <p className="mr m-0 text-sm leading-[1.8] text-(--text-secondary)">
                    प्रजावार्ता AI साधनांचा वापर केवळ सहाय्यक म्हणून करते — जसे की व्याकरण तपासणी, लेआउट सूचना आणि डेटा विश्लेषण. AI द्वारे तयार केलेली कोणतीही बातमी मानवी संपादकाने पुनरावलोकन केल्याशिवाय प्रकाशित होत नाही. AI-अवलंबित सामग्री स्पष्टपणे ओळखली जाते.
                </p>
            </div>
        </MainLayout>
    )
}

export default memo(EditorialPolicy)