"use client"

import MainLayout from "@/layout/MainLayout"
import SectionLayout from "@/layout/SectionLayout"
import { memo } from "react"
import AllNewsSidebar from "./Sidebars/AllNewsSidebar"
import HeroCard from "@/components/cards/HeroCard"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import StandardCard from "@/components/cards/StandardCard"
import Ad from "@/components/Ad"
import { useScreenSize } from "@/hooks/useScreenSize"
import TrendingModule from "./HomePageSections/TrendingModule"
import Link from "next/link"
import { catColor } from "@/lib/catColors"

const CATEGORIES = [
    { name: 'महाराष्ट्र', count: '२,४८०', latest: 'कांदा भाव घसरण, शेतकऱ्यांचे आंदोलन' },
    { name: 'पुणे', count: '१,२४०', latest: 'मेट्रो टप्पा ३ चे काम सुरू' },
    { name: 'राजकारण', count: '१,९६०', latest: 'विधानसभेत सत्तासंघर्ष जोरात' },
    { name: 'गुन्हेगारी', count: '८४२', latest: 'ललित पाटीलला मुंबई पोलिसांनी अटक' },
    { name: 'क्रीडा', count: '७२०', latest: 'रोहित शर्मा कसोटीतून निवृत्त' },
    { name: 'व्यवसाय', count: '६१०', latest: 'सेन्सेक्सने ८०,००० टप्पा ओलांडला' },
    { name: 'मनोरंजन', count: '४९०', latest: 'रितेश देशमुखचा नवा चित्रपट जाहीर' },
    { name: 'देश', count: '९८०', latest: 'संसदेत मोसमी अधिवेशनाला सुरुवात' },
    { name: 'जग', count: '५५०', latest: 'युरोपमध्ये नवीन शांतता करारावर स्वाक्षऱ्या' },
]

const TRENDING = [
    { c: 'राजकारण', h: 'अजित पवार गटाची महत्त्वाची बैठक, मंत्रिपदाच्या मुद्द्यावर चर्चा' },
    { c: 'क्रीडा', h: 'रोहित शर्मा कसोटी संघातून निवृत्त; मुंबईकरांचा भावूक निरोप' },
    { c: 'व्यवसाय', h: 'रिलायन्सच्या तिमाही नफ्यात १८% वाढ, शेअर बाजार उसळला' },
    { c: 'महाराष्ट्र', h: 'मराठवाड्यात अवकाळी पावसाचा कहर, १२ जिल्ह्यांत पीकहानी' },
    { c: 'मनोरंजन', h: 'रितेश देशमुखचा राजा शिवछत्रपती चित्रपट दिवाळीला प्रदर्शित' },
]

const LATEST_ALL = [
    { c: 'महाराष्ट्र', h: 'राज्यात कांद्याच्या भावात मोठी घसरण, शेतकऱ्यांचे आंदोलन सुरू' },
    { c: 'राजकारण', h: 'विधानसभेत सत्तासंघर्ष: सरकार स्थापनेच्या हालचालींना वेग' },
    { c: 'पुणे', h: 'पुण्यात मेट्रोच्या तिसऱ्या टप्प्याचे काम सुरू, २०२८ लक्ष्य' },
    { c: 'क्रीडा', h: 'मुंबई इंडियन्सच्या नव्या प्रशिक्षकपदी धोनीच्या नावाची चर्चा' },
    { c: 'व्यवसाय', h: 'सेन्सेक्सने ऐतिहासिक ८०,००० चा टप्पा ओलांडला' },
    { c: 'गुन्हेगारी', h: 'ठाण्यात सायबर फसवणुकीची ४.२ कोटींची तक्रार दाखल' },
]

const BY_CATEGORY = [
    {
        cat: 'महाराष्ट्र',
        stories: [
            'नागपूर हिवाळी अधिवेशनाची तारीख निश्चित, १६ डिसेंबरपासून सुरुवात',
            'औरंगाबाद नामांतर वाद पुन्हा चर्चेत, सुप्रीम कोर्टात सुनावणी',
            'नाशिकमध्ये द्राक्ष निर्यातीत २०% घट, युरोपीय निर्बंधांचा परिणाम',
            'मराठवाड्यात अवकाळी पावसाचा कहर, १२ जिल्ह्यांत पीकहानी',
        ],
    },
    {
        cat: 'राजकारण',
        stories: [
            'विरोधी पक्षनेतेपदावरून ठाकरे आणि काँग्रेसमध्ये रस्सीखेच',
            'लोकसभेत अध्यक्षपदासाठी इंडिया आघाडीची रणनीती ठरली',
            'एनसीपी शरद पवार गटाच्या प्रदेशाध्यक्षपदी सुनील तटकरे',
            'भाजप प्रदेशाध्यक्षपदी फडणवीसांची फेरनियुक्ती निश्चित',
        ],
    },
    {
        cat: 'पुणे',
        stories: [
            'हिंजवडी आयटी हब विस्ताराला राज्य सरकारची मंजुरी',
            'पीएमपीच्या ३०० नवीन ई-बस ताफ्यात येणार, सप्टेंबरपर्यंत सेवा',
            'कोरेगाव पार्क परिसरात रस्ते दुरुस्तीचे काम पूर्ण',
            'पुणे विमानतळावर तीन नवीन आंतरराष्ट्रीय उड्डाणे सुरू',
        ],
    },
    {
        cat: 'क्रीडा',
        stories: [
            'विश्वचषक हॉकी स्पर्धेसाठी भारतीय संघाची घोषणा',
            'पीव्ही सिंधू ऑस्ट्रेलियन ओपनच्या उपांत्य फेरीत दाखल',
            'रणजी ट्रॉफीत मुंबईचा सलग दुसरा विजय',
            'महाराष्ट्र केसरी कुस्ती स्पर्धेला कोल्हापुरात सुरुवात',
        ],
    },
    {
        cat: 'व्यवसाय',
        stories: [
            'रिलायन्सच्या तिमाही नफ्यात १८% वाढ',
            'GST संकलनात फेब्रुवारीत १२% वाढ',
            'Infosys ने ३,५०० नव्या भरतीची घोषणा केली',
            'टाटा मोटर्सच्या इलेक्ट्रिक एसयूव्हीचे अनावरण',
        ],
    },
]

const ALL_TAGS = [
    '#मराठा आरक्षण', '#जरांगे पाटील', '#विधानसभा', '#मंत्रिमंडळ', '#फडणवीस', '#शिंदे',
    '#शेतकरी', '#कांदा', '#पाऊस', '#मुंबई', '#पुणे', '#नागपूर', '#हिवाळी अधिवेशन',
    '#सुप्रीम कोर्ट', '#OBC आरक्षण', '#IPL', '#शेअर बाजार', '#मेट्रो', '#MPSC', '#सायबर गुन्हे',
]

const AllNews = () => {
    const { screenWidth } = useScreenSize()
    return (
        <MainLayout isBannerAdvertisement>
            {/* Page header */}
            <div className="border-b-4 border-(--brand-primary) pb-6 mb-8">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-2">
                    सर्व विभाग · ALL CATEGORIES
                </div>

                <h1 className="mr m-0 mb-2.5 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                    सर्व बातम्या
                </h1>

                <p className="mr m-0 text-[clamp(13px,1.2vw,16px)] leading-[1.6] text-(--text-secondary)">
                    महाराष्ट्रातील सर्व विभागांच्या ताज्या बातम्या एकाच ठिकाणी. राजकारण, क्रीडा, व्यवसाय, मनोरंजन आणि बरेच काही.
                </p>

                <div className="flex flex-wrap gap-4 mt-3 text-[13px] text-(--text-tertiary)">
                    <span className="mr">९ विभाग</span>
                    <span>·</span>
                    <span className="mr">९,८७२+ बातम्या</span>
                    <span>·</span>
                    <span className="mr">अद्यतनित: ३० एप्रिल २०२६</span>
                </div>
            </div>

            {/* Category tiles — full width above main grid */}
            <div className="mb-10">
                <div className="mr text-[13px] font-bold text-(--text-tertiary) tracking-[0.06em] uppercase mb-4">
                    विभागानुसार ब्राउझ करा
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.name}
                            href={`/category/${cat.name}`}
                            className="block px-3.5 py-4 bg-white no-underline transition-shadow duration-150 hover:shadow-md"
                            style={{
                                border: `2px solid ${catColor(cat.name)}`,
                                borderTop: `4px solid ${catColor(cat.name)}`,
                            }}
                        >
                            <div className="mr text-base font-extrabold mb-1" style={{ color: catColor(cat.name) }}>
                                {cat.name}
                            </div>

                            <div className="mr text-[11px] text-(--text-tertiary) mb-2">
                                {cat.count} बातम्या
                            </div>

                            <p
                                className="mr m-0 text-[11px] leading-[1.4] text-(--text-secondary) overflow-hidden"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {cat.latest}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            <SectionLayout sidebar={<AllNewsSidebar />}>
                {/* Hero */}
                <HeroCard
                    category="महाराष्ट्र"
                    headline="राज्यात कांद्याच्या भावात मोठी घसरण, शेतकऱ्यांचे आंदोलन सुरू"
                    subtitle="नाशिक, पुणे आणि सोलापूर जिल्ह्यांतील हजारो शेतकरी रस्त्यावर; सरकारकडे हस्तक्षेपाची मागणी"
                    redirectUrl={`/article/महाराष्ट्र`}
                />

                {/* Latest across all */}
                <div>
                    <CategoryUnderline name="Maharashtra" label="ताज्या बातम्या — सर्व विभाग" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LATEST_ALL.map((s, i) => (
                            <StandardCard key={i} category={s.c} headline={s.h} layout="col" />
                        ))}
                    </div>
                </div>

                <Ad
                    id={screenWidth <= 768 ? "AN-M1" : "AN-D3"}
                    name={screenWidth <= 768 ? "Mobile All News After Latest" : "Desktop All News Between Modules"}
                    size={screenWidth <= 768 ? "300×250" : "728×90"}
                    width={screenWidth <= 768 ? 300 : 728}
                    height={screenWidth <= 768 ? 250 : 90}
                    fluid={screenWidth <= 768}
                    className={`mx-auto ${screenWidth <= 768 ? "" : "inline-block"}`}
                />

                {/* Trending */}
                <div className="bg-(--surface-secondary) p-6">
                    <TrendingModule label="आत्ता ट्रेंडिंग" items={TRENDING} />
                </div>

                {/* By Category sections */}
                {BY_CATEGORY.map((sec) => (
                    <div key={sec.cat}>
                        <CategoryUnderline name={sec.cat} label={`${sec.cat} — ताज्या बातम्या`} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sec.stories.map((h, i) => (
                                <StandardCard key={i} layout="col" category={sec.cat} headline={h} />
                            ))}
                        </div>

                        <Link
                            href={`/category/${sec.cat}`}
                            className="inline-block mt-4 text-[13px] font-bold no-underline"
                            style={{ color: catColor(sec.cat) }}
                        >
                            {sec.cat} च्या सर्व बातम्या →
                        </Link>
                    </div>
                ))}

                {/* Mobile ad */}
                {screenWidth <= 768 && (
                    <Ad
                        id="AN-M2"
                        name="Mobile All News After Categories"
                        size="300×250 / Native"
                        height={300}
                        fluid
                    />
                )}

                {/* Tags cloud */}
                <div>
                    <div className="mr text-[13px] font-bold text-(--text-tertiary) tracking-[0.06em] uppercase mb-3.5">
                        लोकप्रिय विषय · TRENDING TOPICS
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {ALL_TAGS.map((t) => (
                            <a
                                key={t}
                                href={`/tag/${t.replace('#', '')}`}
                                className="px-3.5 py-2 bg-(--brand-primary-light) text-(--brand-primary) text-[13px] font-semibold rounded-3xl no-underline inline-block"
                            >
                                <span className="mr">{t}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </SectionLayout>
        </MainLayout>
    )
}

export default memo(AllNews)