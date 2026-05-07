"use client"

import { memo } from "react"
import MainLayout from "@/layout/MainLayout"

const OFFICES = [
    {
        city: 'पुणे (मुख्यालय)',
        addr: '४०२, प्रेस कॉम्प्लेक्स, FC रोड, शिवाजीनगर, पुणे ४११ ००५',
        phone: '+91 20 2553 1234',
        email: 'pune@prajavarta.com',
    },
    {
        city: 'मुंबई',
        addr: '२०१, मीडिया हाऊस, लोअर परेल, मुंबई ४०० ०१३',
        phone: '+91 22 6600 5678',
        email: 'mumbai@prajavarta.com',
    },
    {
        city: 'नागपूर',
        addr: '१०१, प्रेस भवन, सीताबर्डी, नागपूर ४४० ०१२',
        phone: '+91 712 256 7890',
        email: 'nagpur@prajavarta.com',
    },
]

const CONTACTS = [
    { dept: 'बातम्या व संपादकीय', email: 'newsdesk@prajavarta.com', desc: 'बातम्यांच्या टिप्स, प्रेस रिलीज, संपादकीय प्रश्न' },
    { dept: 'जाहिरात', email: 'advertising@prajavarta.com', desc: 'जाहिरात दर, मीडिया किट, कस्टम कॅम्पेन' },
    { dept: 'तांत्रिक सहाय्य', email: 'support@prajavarta.com', desc: 'वेबसाइट समस्या, खाते व्यवस्थापन' },
    { dept: 'कायदेशीर', email: 'legal@prajavarta.com', desc: 'DMCA, गोपनीयता विनंत्या, कायदेशीर नोटिसा' },
    { dept: 'फॅक्ट चेक', email: 'factcheck@prajavarta.com', desc: 'चुकीची माहिती नोंदवा, दुरुस्तीच्या विनंत्या' },
    { dept: 'HR / करिअर', email: 'careers@prajavarta.com', desc: 'नोकरीच्या संधी, इंटर्नशिप' },
]

const formContents = [
    { label: 'पूर्ण नाव', type: 'text', placeholder: 'तुमचे नाव' },
    { label: 'ईमेल पत्ता', type: 'email', placeholder: 'email@example.com' },
    { label: 'फोन नंबर (ऐच्छिक)', type: 'tel', placeholder: '+91 98765 43210' },
]

const ContactUs = () => {
    return (
        <MainLayout>
            {/* Header */}
            <div className="border-b-4 border-(--brand-primary) pb-8 mb-12">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-3">
                    कंपनी · COMPANY
                </div>

                <h1 className="mr m-0 mb-3 text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                    संपर्क करा
                </h1>

                <p className="mr m-0 text-[clamp(14px,1.3vw,17px)] leading-[1.7] text-(--text-secondary)">
                    आमच्याशी बातम्या, जाहिरात, तांत्रिक समस्या किंवा कोणत्याही विषयावर संपर्क साधा. आम्ही २४ तासांत उत्तर देतो.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
                {/* Contact form */}
                <div>
                    <h2 className="mr text-[20px] font-extrabold mb-6 text-(--brand-primary)">
                        संदेश पाठवा
                    </h2>

                    <div className="flex flex-col gap-4">
                        {formContents.map((f) => (
                            <div key={f.label}>
                                <label className="mr block text-[13px] font-semibold mb-1.5 text-(--text-primary)">
                                    {f.label}
                                </label>

                                <input
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    className="w-full px-3 py-2.5 border border-(--border-default) text-sm font-inherit rounded outline-none box-border bg-white"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="mr block text-[13px] font-semibold mb-1.5 text-(--text-primary)">
                                विषय
                            </label>

                            <select className="w-full px-3 py-2.5 border border-(--border-default) text-sm font-inherit rounded outline-none bg-white">
                                <option className="mr">बातम्यांची टीप द्या</option>
                                <option className="mr">जाहिरातीबद्दल चौकशी</option>
                                <option className="mr">चुकीची माहिती नोंदवा</option>
                                <option className="mr">तांत्रिक समस्या</option>
                                <option className="mr">इतर</option>
                            </select>
                        </div>

                        <div>
                            <label className="mr block text-[13px] font-semibold mb-1.5 text-(--text-primary)">
                                संदेश
                            </label>

                            <textarea
                                placeholder="तुमचा संदेश येथे लिहा..."
                                rows={5}
                                className="w-full px-3 py-2.5 border border-(--border-default) text-sm font-inherit rounded outline-none resize-y box-border"
                            />
                        </div>

                        <button className="px-7 py-3 bg-(--brand-primary) text-white border-0 font-bold text-[15px] cursor-pointer rounded w-full sm:w-fit">
                            संदेश पाठवा →
                        </button>
                    </div>
                </div>

                {/* Department contacts */}
                <div>
                    <h2 className="mr text-[20px] font-extrabold mb-6 text-(--brand-primary)">
                        विभागानुसार संपर्क
                    </h2>

                    <div className="flex flex-col gap-4">
                        {CONTACTS.map((c) => (
                            <div
                                key={c.dept}
                                className="p-4 border border-(--border-default) border-l-[3px] border-l-(--brand-primary)"
                            >
                                <div className="mr text-sm font-bold mb-1">
                                    {c.dept}
                                </div>

                                <div className="text-[13px] text-(--brand-primary) mb-1">
                                    {c.email}
                                </div>

                                <div className="mr text-xs text-(--text-tertiary)">
                                    {c.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Offices */}
            <div className="mb-12">
                <h2 className="mr text-[20px] font-extrabold mb-6 text-(--brand-primary)">
                    आमची कार्यालये
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {OFFICES.map((o) => (
                        <div
                            key={o.city}
                            className="p-5 border border-(--border-default)"
                        >
                            <div className="mr text-[15px] font-extrabold text-(--brand-primary) mb-2.5">
                                {o.city}
                            </div>

                            <div className="mr text-[13px] leading-[1.6] text-(--text-secondary) mb-2">
                                {o.addr}
                            </div>

                            <div className="text-[13px] text-(--text-secondary) mb-1">
                                {o.phone}
                            </div>

                            <div className="text-[13px] text-(--brand-primary)">
                                {o.email}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}

export default memo(ContactUs)