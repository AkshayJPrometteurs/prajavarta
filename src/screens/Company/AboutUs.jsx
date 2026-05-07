"use client"

import { memo } from "react"
import MainLayout from "@/layout/MainLayout"

const TEAM = [
    { name: 'अनिल कुलकर्णी', role: 'मुख्य संपादक', since: '२०२१', abbr: 'अकु' },
    { name: 'सुनील देशमुख', role: 'राजकीय संपादक', since: '२०२१', abbr: 'सुदे' },
    { name: 'मीना पाटील', role: 'महाराष्ट्र संपादक', since: '२०२२', abbr: 'मीप' },
    { name: 'राहुल जोशी', role: 'पुणे रिपोर्टर', since: '२०२३', abbr: 'राजो' },
    { name: 'प्रिया कुलकर्णी', role: 'मंत्रालय बातमीदार', since: '२०२३', abbr: 'प्रकु' },
    { name: 'संतोष मोरे', role: 'क्रीडा संपादक', since: '२०२२', abbr: 'समो' },
]

const VALUES = [
    { title: 'सत्यता', desc: 'प्रत्येक बातमी प्रकाशित करण्यापूर्वी किमान दोन स्वतंत्र स्रोतांकडून पडताळणी केली जाते.' },
    { title: 'निष्पक्षता', desc: 'कोणत्याही राजकीय पक्ष, विचारधारा किंवा व्यावसायिक हितसंबंधांशी बांधील नाही.' },
    { title: 'पारदर्शकता', desc: 'चुका झाल्यास तातडीने दुरुस्ती केली जाते आणि वाचकांना सूचित केले जाते.' },
    { title: 'जबाबदारी', desc: 'प्रत्येक लेखाखाली लेखकाचे नाव आणि संपर्क माहिती दिली जाते.' },
]

const Stats = [
    { v: '२०२१', l: 'स्थापना वर्ष' },
    { v: '९,८७२+', l: 'लेख प्रकाशित' },
    { v: '२१८', l: 'संपादक / पत्रकार' },
    { v: '२.४ लाख', l: 'मासिक वाचक' },
    { v: '९', l: 'विभाग' },
    { v: '२४×७', l: 'अद्यतन' },
]

const AboutUs = () => {
    return (
        <MainLayout>
            {/* Hero */}
            <div className="border-b-4 border-(--brand-primary) pb-8 mb-12">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-3">
                    कंपनी · COMPANY
                </div>

                <h1 className="mr m-0 mb-4 text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                    आमच्याबद्दल
                </h1>

                <p className="mr m-0 text-[clamp(15px,1.5vw,18px)] leading-[1.8] text-(--text-secondary)">
                    प्रजावार्ता हे महाराष्ट्रातील विश्वासार्ह मराठी डिजिटल वृत्तपत्र आहे. आम्ही २०२१ पासून महाराष्ट्राच्या कानाकोपऱ्यातील बातम्या मराठी वाचकांपर्यंत पोहोचवत आहोत.
                </p>
            </div>

            {/* Mission */}
            <div className="mb-14">
                <h2 className="mr text-2xl font-extrabold mb-4 text-(--brand-primary)">
                    आमचे ध्येय
                </h2>

                <p className="mr text-base leading-[1.9] text-(--text-secondary) mb-4">
                    महाराष्ट्रातील प्रत्येक नागरिकाला त्यांच्या भाषेत — मराठीत — अचूक, वेगवान आणि सखोल बातम्या मिळाव्यात हे आमचे प्राथमिक उद्दिष्ट आहे. राजकारण, समाज, अर्थकारण, क्रीडा, मनोरंजन — सर्व विषयांवर आम्ही सर्वसामान्य मराठी माणसाच्या दृष्टीकोनातून वार्तांकन करतो.
                </p>

                <p className="mr text-base leading-[1.9] text-(--text-secondary)">
                    आम्ही विश्वास ठेवतो की जनतेला माहितीचा अधिकार आहे, आणि पत्रकारिता हे केवळ व्यवसाय नव्हे तर एक सामाजिक जबाबदारी आहे. प्रत्येक बातमीमागे असलेल्या माणसाच्या कथेला आम्ही न्याय देण्याचा प्रयत्न करतो.
                </p>
            </div>

            {/* Values */}
            <div className="mb-14">
                <h2 className="mr text-2xl font-extrabold mb-6 text-(--brand-primary)">
                    आमची मूल्ये
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {VALUES.map((v) => (
                        <div
                            key={v.title}
                            className="p-6 border border-(--border-default) border-t-[3px] border-t-(--brand-primary)"
                        >
                            <div className="mr text-[18px] font-extrabold mb-2.5 text-(--text-primary)">
                                {v.title}
                            </div>

                            <p className="mr m-0 text-sm leading-[1.7] text-(--text-secondary)">
                                {v.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div className="mb-14">
                <h2 className="mr text-2xl font-extrabold mb-6 text-(--brand-primary)">
                    संपादकीय संघ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {TEAM.map((m) => (
                        <div
                            key={m.name}
                            className="flex gap-4 items-center p-4 border border-(--border-default)"
                        >
                            <div className="w-13 h-13 rounded-full bg-(--brand-primary-light) flex items-center justify-center font-extrabold text-(--brand-primary) text-sm shrink-0">
                                {m.abbr}
                            </div>

                            <div>
                                <div className="mr text-[15px] font-bold">
                                    {m.name}
                                </div>

                                <div className="mr text-xs text-(--text-tertiary) mt-0.5">
                                    {m.role}
                                </div>

                                <div className="mr text-[11px] text-(--text-tertiary) mt-0.5">
                                    {m.since} पासून
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="bg-(--surface-secondary) p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-14">
                {Stats.map((s) => (
                    <div key={s.l} className="text-center">
                        <div className="mr text-[28px] font-black text-(--brand-primary) leading-none">
                            {s.v}
                        </div>

                        <div className="mr text-xs text-(--text-tertiary) mt-1.5 font-semibold">
                            {s.l}
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact CTA */}
            <div className="text-center pb-10">
                <p className="mr text-base text-(--text-secondary) mb-5">
                    आमच्याशी बोलायचे आहे? आम्ही नेहमी उपलब्ध आहोत.
                </p>

                <a
                    href="/contact"
                    className="inline-block px-8 py-3.5 bg-(--brand-primary) text-white font-bold text-[15px] no-underline rounded"
                >
                    <span className="mr">संपर्क करा →</span>
                </a>
            </div>
        </MainLayout>
    )
}

export default memo(AboutUs)