"use client"

import { memo } from "react"
import MainLayout from "@/layout/MainLayout"

const AD_FORMATS = [
    {
        name: 'Desktop Billboard',
        size: '970×250',
        placement: 'प्रत्येक पानाच्या वरती',
        cpm: '₹१२०–₹१८०',
        best: 'ब्रँड अवेअरनेस',
    },
    {
        name: 'Sidebar Rectangle',
        size: '300×250',
        placement: 'उजव्या बाजूचा sidebar',
        cpm: '₹८०–₹१२०',
        best: 'लीड जनरेशन',
    },
    {
        name: 'Half Page',
        size: '300×600',
        placement: 'sidebar मध्यभागी',
        cpm: '₹१५०–₹२००',
        best: 'उत्पादन प्रदर्शन',
    },
    {
        name: 'Leaderboard',
        size: '728×90',
        placement: 'सामग्रीमध्ये',
        cpm: '₹७०–₹१००',
        best: 'ट्रॅफिक आकर्षण',
    },
    {
        name: 'Mobile Banner',
        size: '320×50 / 300×250',
        placement: 'मोबाईल सामग्रीमध्ये',
        cpm: '₹५०–₹९०',
        best: 'मोबाईल वापरकर्ते',
    },
    {
        name: 'Native / Sponsored',
        size: 'लेखस्वरूप',
        placement: 'बातम्यांच्या फीडमध्ये',
        cpm: 'सानुकूल',
        best: 'उच्च एंगेजमेंट',
    },
]

const AUDIENCE = [
    { label: 'मासिक वाचक', value: '२.४ लाख+' },
    { label: 'दैनिक सक्रिय वापरकर्ते', value: '३८,०००+' },
    { label: 'मोबाईल वापर', value: '७२%' },
    { label: 'सरासरी सत्र वेळ', value: '४ मि. ३८ से.' },
    { label: 'पृष्ठ दृश्ये / महिना', value: '९.२ लाख+' },
    { label: 'न्यूजलेटर सदस्य', value: '१२,५००+' },
]

const AUDIENCE_DEMO = [
    { label: 'वय: २५–४४', pct: '५८%' },
    { label: 'पुरुष वाचक', pct: '५४%' },
    { label: 'महाराष्ट्र', pct: '८३%' },
    { label: 'शहरी वाचक', pct: '६७%' },
    { label: 'उच्चशिक्षित', pct: '७१%' },
    { label: 'उत्पन्न ₹५ लाख+', pct: '४९%' },
]

const PACKAGES = [
    {
        name: 'स्टार्टर',
        price: '₹१५,०००',
        period: 'प्रति महिना',
        color: '#1565C0',
        features: [
            'Sidebar 300×250 (२ fold)',
            '५०,००० इंप्रेशन',
            'मूलभूत analytics अहवाल',
            'एक विभाग लक्ष्य',
        ],
    },
    {
        name: 'ग्रोथ',
        price: '₹४५,०००',
        period: 'प्रति महिना',
        color: '#C62828',
        highlight: true,
        features: [
            'Billboard + Sidebar पूर्ण package',
            '२,००,००० इंप्रेशन',
            'साप्ताहिक analytics अहवाल',
            'सर्व विभाग लक्ष्य',
            '१ Sponsored article',
            'Dedicated account manager',
        ],
    },
    {
        name: 'एंटरप्राइझ',
        price: 'सानुकूल',
        period: '',
        color: '#2E7D32',
        features: [
            'सर्व ad formats',
            'अमर्यादित इंप्रेशन',
            'रिअल-टाइम dashboard',
            'Geo + demographic targeting',
            '४ Sponsored articles',
            'Homepage takeover उपलब्ध',
            'Dedicated creative support',
        ],
    },
]

const Advertise = () => {
    return (
        <MainLayout>
            {/* Page header */}
            <div className="border-b-4 border-(--brand-primary) pb-7 mb-12">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-3">
                    जाहिरात · ADVERTISING
                </div>

                <h1 className="mr m-0 mb-3.5 text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                    जाहिरात द्या — Advertise With Us
                </h1>

                <p className="mr m-0 text-[clamp(14px,1.3vw,17px)] leading-[1.7] text-(--text-secondary) max-w-195">
                    महाराष्ट्रातील २.४ लाख+ मराठी वाचकांपर्यंत पोहोचा. प्रजावार्तावर जाहिरात देऊन तुमचा ब्रँड, उत्पादन किंवा सेवा थेट लक्ष्य प्रेक्षकांपर्यंत पोहोचवा.
                </p>
            </div>

            {/* Audience stats */}
            <div className="mb-14">
                <h2 className="mr text-[22px] font-extrabold mb-6 text-(--brand-primary)">
                    आमचे वाचक
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-7">
                    {AUDIENCE.map((a) => (
                        <div key={a.label} className="px-4 py-5 border border-(--border-default) text-center border-t-[3px] border-t-(--brand-primary)">
                            <div className="mr text-[26px] font-black text-(--brand-primary) leading-none mb-2">
                                {a.value}
                            </div>

                            <div className="mr text-xs text-(--text-tertiary) font-semibold">
                                {a.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-(--surface-secondary)">
                    <div className="mr text-[13px] font-bold text-(--text-tertiary) tracking-[0.06em] uppercase mb-4">
                        वाचक प्रोफाइल
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {AUDIENCE_DEMO.map((d) => (
                            <div key={d.label} className="flex justify-between items-center px-3.5 py-2.5 bg-white border border-(--border-default)">
                                <span className="mr text-[13px] text-(--text-secondary)">
                                    {d.label}
                                </span>

                                <span className="mr text-[15px] font-extrabold text-(--brand-primary)">
                                    {d.pct}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ad formats */}
            <div className="mb-14">
                <h2 className="mr text-[22px] font-extrabold mb-6 text-(--brand-primary)">
                    जाहिरात स्वरूप
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-(--brand-primary) text-white">
                                {['स्वरूप', 'आकार', 'स्थान', 'CPM (अंदाजे)', 'सर्वोत्तम उद्देश'].map((h) => (
                                    <th key={h} className="mr px-4 py-3 text-left font-bold text-[13px] whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {AD_FORMATS.map((f, i) => (
                                <tr key={f.name} className={i % 2 === 0 ? 'bg-white' : 'bg-(--surface-secondary)'}>
                                    <td className="mr px-4 py-3 font-bold">
                                        {f.name}
                                    </td>

                                    <td className="px-4 py-3 font-mono text-[13px]">
                                        {f.size}
                                    </td>

                                    <td className="mr px-4 py-3 text-(--text-secondary)">
                                        {f.placement}
                                    </td>

                                    <td className="mr px-4 py-3 font-bold text-(--brand-primary)">
                                        {f.cpm}
                                    </td>

                                    <td className="mr px-4 py-3 text-(--text-secondary)">
                                        {f.best}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Packages */}
            <div className="mb-14">
                <h2 className="mr text-[22px] font-extrabold mb-6 text-(--brand-primary)">
                    जाहिरात पॅकेज
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {PACKAGES.map((p) => (
                        <div
                            key={p.name}
                            className={`${p.highlight ? 'bg-[#FFF8F7]' : 'bg-white'} relative p-7 border-t-4`}
                            style={{
                                border: `2px solid ${p.highlight ? p.color : 'var(--border-default)'}`,
                                borderTopColor: p.color,
                            }}
                        >
                            {p.highlight && (
                                <div
                                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold px-3.5 py-1 rounded-xl whitespace-nowrap"
                                    style={{ background: p.color }}
                                >
                                    सर्वात लोकप्रिय
                                </div>
                            )}

                            <div className="mr text-[20px] font-extrabold mb-1.5">
                                {p.name}
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-5">
                                <span className="mr text-[32px] font-black leading-none" style={{ color: p.color }}>
                                    {p.price}
                                </span>

                                {p.period && (
                                    <span className="mr text-[13px] text-(--text-tertiary)">
                                        {p.period}
                                    </span>
                                )}
                            </div>

                            <ul className="list-none m-0 mb-6 p-0 flex flex-col gap-2.5">
                                {p.features.map((f) => (
                                    <li key={f} className="flex gap-2.5 items-start">
                                        <span className="font-black text-base leading-[1.2] shrink-0" style={{ color: p.color }}>
                                            ✓
                                        </span>

                                        <span className="mr text-sm text-(--text-secondary) leading-normal">
                                            {f}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="w-full py-3 font-bold text-sm cursor-pointer rounded border-2"
                                style={{
                                    background: p.highlight ? p.color : '#fff',
                                    color: p.highlight ? '#fff' : p.color,
                                    borderColor: p.color,
                                }}
                            >
                                {p.price === 'सानुकूल' ? 'चर्चा करा →' : 'सुरुवात करा →'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
                <div className="p-8 bg-(--brand-primary) text-white">
                    <div className="mr text-[20px] font-extrabold mb-3">
                        जाहिरात चौकशी करा
                    </div>

                    <p className="mr m-0 mb-5 text-sm leading-[1.7] opacity-85">
                        आमचा sales team तुम्हाला सर्वोत्तम package निवडण्यास मदत करेल.
                    </p>

                    <div className="text-sm mb-2">
                        advertising@prajavarta.com
                    </div>

                    <div className="text-sm">
                        +91 20 2553 1234 (ext. 2)
                    </div>
                </div>

                <div className="p-8 border border-(--border-default)">
                    <div className="mr text-[20px] font-extrabold mb-5">
                        त्वरित संपर्क
                    </div>

                    <div className="flex flex-col gap-3">
                        {['नाव', 'ईमेल', 'कंपनी', 'बजेट (अंदाजे)'].map((f) => (
                            <input
                                key={f}
                                placeholder={f}
                                className="px-3 py-2.5 border border-(--border-default) text-sm font-(--font-mr) rounded outline-none"
                            />
                        ))}

                        <button className="py-3 bg-(--brand-primary) text-white border-0 font-bold text-sm cursor-pointer rounded">
                            पाठवा →
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default memo(Advertise)