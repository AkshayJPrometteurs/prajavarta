"use client"

import MainLayout from "@/layout/MainLayout"
import { useScreenSize } from "@/hooks/useScreenSize"
import { useParams } from "next/navigation"
import Ad from "@/components/Ad"
import CategoryChip from "@/components/ui/CategoryChip"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import { LinkIcon, XIcon } from "@/components/ui/Icons"
import StandardCard from "@/components/cards/StandardCard"
import TrendingModule from "./HomePageSections/TrendingModule"
import { getShortName } from "@/lib/helper"
import AuthorSidebar from "./Sidebars/AuthorSidebar"
import SectionLayout from "@/layout/SectionLayout"

const CAT = 'राजकारण'

const AUTHOR_ARTICLES = [
    'विधानसभेत सत्तासंघर्ष: सरकार स्थापनेच्या हालचालींना वेग',
    'मंत्रिमंडळ विस्ताराचे संभाव्य चेहरे: संपूर्ण यादी',
    'उपमुख्यमंत्रीपदाची शर्यत: तीन नावांची चर्चा',
    'महायुतीच्या जागावाटपात अंतिम गठित कोणाला?',
    'विरोधी पक्षनेतेपदासाठी ठाकरे-काँग्रेसमधील रस्सीखेच',
    'लोकसभेत अध्यक्षपदासाठी इंडिया आघाडीची रणनीती',
    'एनसीपी प्रदेशाध्यक्षपदी सुनील तटकरे यांची नियुक्ती',
    'भाजप प्रदेशाध्यक्षपदी फडणवीसांची फेरनियुक्ती',
    'मनसेच्या अधिवेशनात राज ठाकरे यांचे आक्रमक भाषण',
    'पुण्यातील आमदारांना मंत्रिमंडळात स्थान मिळणार का?',
]

const MOST_READ_BY_AUTHOR = [
    { c: CAT, h: 'फडणवीस-शिंदे यांच्यातील समझोत्याचा आत-कथा' },
    { c: CAT, h: 'महाराष्ट्र विधानसभा निवडणूक: पूर्ण विश्लेषण' },
    { c: CAT, h: 'मराठा आरक्षणाचा राजकीय परिणाम' },
    { c: CAT, h: 'शिवसेनेची फूट: एक कालक्रम' },
    { c: CAT, h: 'पुण्यातील राजकीय समीकरणे २०२६' },
]

const AUTHOR_CATS = ['राजकारण', 'महाराष्ट्र', 'पुणे']

const Author = () => {
    const { screenWidth } = useScreenSize();
    const { slug } = useParams();
    const AUTHOR = decodeURIComponent(slug);
    return (
        <MainLayout isBannerAdvertisement>
            <div>
                {/* Author profile block */}
                <div className="flex flex-col md:flex-row gap-8 pb-8 mb-8 border-b-[3px] border-(--brand-primary) items-start">

                    {/* Avatar */}
                    <div className="flex justify-center md:justify-start w-full md:w-auto">
                        <div className="imgph w-[160px!important] h-[160px!important] rounded-full">
                            <span className="mr text-5xl font-bold">
                                {getShortName(AUTHOR)}
                            </span>
                        </div>
                    </div>

                    {/* Profile info */}
                    <div>
                        <div className="flex flex-col items-center md:items-start w-full md:w-auto">
                            <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-2">
                                AUTHOR · संपादक
                            </div>

                            <h1 className="mr m-0 mb-1.5 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                                {AUTHOR}
                            </h1>

                            <div className="mr text-[clamp(14px,1.5vw,18px)] font-semibold text-(--brand-primary) mb-3.5">
                                राजकीय संपादक · पुणे राजकारण विशेष
                            </div>
                        </div>

                        <p className="mr m-0 mb-4 leading-[1.7] text-(--text-secondary) max-w-3xl">
                            १८ वर्षांचा राजकीय पत्रकारिता अनुभव. महाराष्ट्राच्या राजकीय पटलावरील घडामोडींचे विश्लेषण आणि सखोल अहवाल. यापूर्वी लोकमत, सकाळ आणि महाराष्ट्र टाइम्ससाठी काम केले आहे. राज्यशास्त्रात पुणे विद्यापीठातून पदव्युत्तर पदवी आणि TISS मुंबईतून पत्रकारितेचा डिप्लोमा.
                        </p>

                        {/* Credentials grid */}
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,auto))] gap-y-4 gap-x-8 mb-4.5 pt-3.5 border-t border-(--border-default)">
                            {[
                                { l: 'अनुभव', v: '१८ वर्षे' },
                                { l: 'लेख प्रकाशित', v: '२,४६८' },
                                { l: 'मुख्य विषय', v: 'राजकारण, धोरण' },
                                { l: 'शहर', v: 'पुणे · मुंबई' },
                            ].map((s) => (
                                <div key={s.l}>
                                    <div className="mr text-[11px] text-(--text-tertiary) font-semibold tracking-wider uppercase mb-1">
                                        {s.l}
                                    </div>

                                    <div className="mr text-base font-bold text-(--text-primary)">
                                        {s.v}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social links */}
                        <div className="flex flex-wrap gap-2.5 items-center">
                            {[
                                { icon: <XIcon size={14} />, label: '@sunildeshmukh' },
                                { icon: <LinkIcon size={14} />, label: 'LinkedIn' },
                                { icon: '@', label: 'sunil@prajavarta.com' },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    className="flex items-center gap-2 px-3.5 py-2 border border-(--border-default) text-(--text-secondary) text-[13px] font-medium cursor-pointer rounded"
                                >
                                    {s.icon} {s.label}
                                </a>
                            ))}

                            <button className="mr px-3.5 py-2 bg-(--brand-primary) text-white border-0 text-[13px] font-semibold cursor-pointer rounded">
                                + Follow author
                            </button>
                        </div>

                        {/* Covered categories */}
                        <div className="mt-4.5 flex flex-wrap gap-2 items-center">
                            <div className="mr text-xs font-semibold text-(--text-tertiary) mr-1">
                                विशेष विषय:
                            </div>

                            {AUTHOR_CATS.map((c) => (
                                <CategoryChip key={c} name={c} size="sm" />
                            ))}
                        </div>
                    </div>
                </div>

                <SectionLayout sidebar={<AuthorSidebar />}>
                    {/* Latest articles */}
                    <div>
                        <CategoryUnderline name={CAT} label="सुनील देशमुख यांच्या ताज्या बातम्या" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {AUTHOR_ARTICLES.map((h, i) => (
                                <StandardCard key={i} layout="col" category={CAT} headline={h} />
                            ))}
                        </div>

                        <button className="mr mt-6 px-7 py-3 bg-white border border-(--brand-primary) text-(--brand-primary) font-semibold text-sm cursor-pointer rounded">
                            आणखी लेख दाखवा →
                        </button>
                    </div>

                    {/* Desktop leaderboard */}
                    <Ad
                        id="DC3"
                        name="Desktop Author Between Modules"
                        size={screenWidth >= 992 ? "728×90" : "Responsive"}
                        width={screenWidth >= 992 ? 728 : undefined}
                        height={screenWidth >= 992 ? 90 : 90}
                        fluid={screenWidth < 992}
                        className="inline-block mx-auto max-w-full"
                    />

                    {/* Most read by author */}
                    <div className="bg-(--surface-secondary) p-6">
                        <TrendingModule label="सर्वाधिक वाचलेले" items={MOST_READ_BY_AUTHOR} />
                    </div>

                    {/* E-E-A-T panel */}
                    <div className="p-6 border border-(--border-default) grid grid-cols-[auto_1fr] gap-5 items-start">
                        <div className="w-12 h-12 rounded-lg bg-(--brand-primary-light) flex items-center justify-center text-2xl shrink-0">
                            ✓
                        </div>

                        <div>
                            <div className="mr text-base font-bold mb-1.5">
                                संपादकीय निष्ठा आणि विश्वासार्हता
                            </div>

                            <p className="mr m-0 mb-3 text-sm leading-[1.7] text-(--text-secondary)">
                                सुनील देशमुख प्रजावार्ताच्या संपादकीय धोरणांचे काटेकोर पालन करतात. त्यांचे सर्व लेख तथ्य पडताळणी प्रक्रियेतून जातात आणि संपादकीय मंडळाच्या मान्यतेनंतरच प्रकाशित होतात.
                            </p>

                            <div className="flex flex-wrap gap-3.5 text-[13px] font-semibold text-(--brand-primary)">
                                <span className="cursor-pointer">संपादकीय धोरण →</span>
                                <span className="cursor-pointer">तथ्य पडताळणी प्रक्रिया →</span>
                                <span className="cursor-pointer">दुरुस्ती धोरण →</span>
                            </div>
                        </div>
                    </div>
                </SectionLayout>
            </div>
        </MainLayout>
    )
}

export default Author