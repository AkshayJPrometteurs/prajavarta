"use client"
import { memo } from "react"
import MainLayout from "@/layout/MainLayout"
import Ad from "@/components/Ad"
import { useScreenSize } from "@/hooks/useScreenSize"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import StandardCard from "@/components/cards/StandardCard"
import TrendingModule from "./HomePageSections/TrendingModule"
import HeroCard from "@/components/cards/HeroCard"
import { catColor } from "@/lib/catColors"
import CategoriesSidebar from "./Sidebars/CategoriesSidebar"
import { useParams } from "next/navigation"
import { slugToMarathi } from "@/lib/helper"
import Link from "next/link"
import SectionLayout from "@/layout/SectionLayout"

const LATEST = [
    'नागपूर हिवाळी अधिवेशनाची तारीख निश्चित, १६ डिसेंबरपासून सुरुवात',
    'औरंगाबाद नामांतर वाद पुन्हा चर्चेत, सुप्रीम कोर्टात सुनावणी',
    'नाशिकमध्ये द्राक्ष निर्यातीत २०% घट, युरोपीय निर्बंधांचा परिणाम',
    'विधान परिषदेच्या निवडणुकीचे वेळापत्रक जाहीर',
    'मराठवाड्यात अवकाळी पावसाचा कहर, १२ जिल्ह्यांत पीकहानी',
    'कोकणात पावसाने सरासरी ओलांडली, शेतकऱ्यांना दिलासा',
]

const MOST_READ = [
    'मराठा आरक्षणावर सर्वोच्च न्यायालयाची सुनावणी',
    'शिवसेनेच्या अधिवेशनात ठाकरेंचे आक्रमक भाषण',
    'महावितरणच्या वीजबिलात ८% वाढीचा प्रस्ताव',
    'MPSC परीक्षेचे नवीन वेळापत्रक जाहीर',
    'गणेशोत्सव परवानगी प्रक्रिया जलद',
]

const SUBCITIES = [
    { city: 'मुंबई', h: 'मेट्रो लाईन ३ चे काम अंतिम टप्प्यात' },
    { city: 'पुणे', h: 'हिंजवडीत आयटी विस्तार योजना मंजूर' },
    { city: 'नागपूर', h: 'हिवाळी अधिवेशनाची तयारी सुरू' },
]

const EVERGREEN = [
    'महाराष्ट्राच्या स्थापनेची पूर्ण कथा: १९६० ते आजपर्यंत',
    'संयुक्त महाराष्ट्र चळवळ — एका लढ्याची शोधयात्रा',
    'मराठी अस्मितेची नवी ओळख: संस्कृती, साहित्य, चित्रपट',
    'महाराष्ट्रातील १० ऐतिहासिक स्थळे जी प्रत्येकाने पाहावी',
]

const RELATED_TAGS = ['मराठा आरक्षण', 'जरांगे पाटील', 'विधानसभा', 'मंत्रिमंडळ', 'फडणवीस', 'शिंदे', 'शेतकरी', 'कांदा', 'पाऊस', 'मुंबई', 'पुणे', 'नागपूर', 'हिवाळी अधिवेशन', 'सुप्रीम कोर्ट']

const Categories = () => {
    const { screenWidth } = useScreenSize();
    const { slug } = useParams();
    const CAT = decodeURIComponent(slug);
    const TRENDING_CAT = [
        { c: CAT, h: 'मनोज जरांगे पाटील आज औरंगाबादेत उपोषणाला बसणार' },
        { c: CAT, h: 'मुंबईत मेट्रो लाईन ३ चे काम पूर्णत्वाच्या मार्गावर' },
        { c: CAT, h: 'कोकण किनारपट्टीवर पर्यटनाला उत्तेजन देण्यासाठी नवी योजना' },
        { c: CAT, h: 'विदर्भातील शेतकऱ्यांसाठी १,२०० कोटींचे पॅकेज जाहीर' },
        { c: CAT, h: 'मराठी भाषा विद्यापीठाच्या स्थापनेला राज्य मंत्रिमंडळाची मान्यता' },
    ]
    return (
        <MainLayout isBannerAdvertisement>
            {/* Category header — full width */}
            <div style={{ borderBottom: `4px solid ${catColor(CAT)}`, paddingBottom: 24, marginBottom: 32 }}>
                <h1 className="mr mb-3 text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                    {CAT}
                </h1>

                <p className="mr m-0 text-[clamp(14px,1.2vw,17px)] leading-[1.6]">
                    महाराष्ट्रातून थेट: राजकारण, समाज, अर्थकारण, संस्कृती आणि शहर-ग्रामीण घडामोडी. राज्याच्या प्रत्येक कोपऱ्यातील विश्वासार्ह बातम्या.
                </p>

                <div className="flex gap-3.5 mt-3.5 text-[13px] text-(--text-tertiary)">
                    <span className="mr">२,४८० बातम्या</span>
                    <span>·</span>
                    <span className="mr">अद्यतनित: २९ एप्रिल २०२६</span>
                    {screenWidth >= 768 && (
                        <>
                            <span>·</span>
                            <span className="mr">२१८ संपादक</span>
                        </>
                    )}
                </div>
            </div>

            <SectionLayout sidebar={<CategoriesSidebar />}>
                <HeroCard
                    category={CAT}
                    headline="राज्यात कांद्याच्या भावात मोठी घसरण, शेतकऱ्यांचे आंदोलन सुरू"
                    redirectUrl={`/article/${CAT}`}
                />

                {/* Latest feed */}
                <div className="mt-5">
                    <CategoryUnderline name={CAT} label="ताज्या बातम्या" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {LATEST.map((h, i) => (
                            <StandardCard key={i} category={CAT} headline={h} layout="col" />
                        ))}
                    </div>
                </div>

                <Ad
                    id={screenWidth <= 768 ? "C1" : "DC3"}
                    name={screenWidth <= 768 ? "Mobile Category Below Hero" : "Desktop Category Between Modules"}
                    size={screenWidth <= 768 ? "300×250" : "728×90"}
                    width={screenWidth <= 768 ? 300 : 728}
                    height={screenWidth <= 768 ? 250 : 90}
                    {...screenWidth <= 768 && { fluid: true }}
                    className={`mx-auto ${screenWidth <= 768 ? "my-4 md:my-6" : "inline-block my-4 md:my-6"}`}
                />

                {/* Trending */}
                <div className="mt-5">
                    <TrendingModule label={`${CAT}-मधील ट्रेंडिंग`} items={TRENDING_CAT} />
                </div>

                {/* Mobile most-read */}
                {screenWidth <= 768 && (
                    <div className="mt-5">
                        <CategoryUnderline name={CAT} label="सर्वाधिक वाचलेले" />
                        <ul className="list-none m-0 p-0">
                            {MOST_READ.map((h, i) => (
                                <li key={i} className="mr text-sm py-3.5 border-b border-(--border-default) font-medium">
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Mobile ad */}
                {screenWidth <= 768 && (
                    <Ad
                        id="C2"
                        name="Mobile Category Between Grids"
                        size="300×250 / Native"
                        height={250}
                        fluid
                        className="my-5"
                    />
                )}

                {/* Desktop subcategories */}
                {screenWidth >= 768 && (
                    <div className="mt-5">
                        <CategoryUnderline name={CAT} label="शहरांनुसार बातम्या" />
                        <div className="grid grid-cols-3 gap-6">
                            {SUBCITIES.map((s) => (
                                <div key={s.city}>
                                    <div
                                        className="mr text-[13px] font-bold mb-2.5 tracking-[0.04em]"
                                        style={{ color: catColor(CAT) }}
                                    >
                                        {s.city}
                                    </div>
                                    <StandardCard layout="col" category={CAT} headline={s.h} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mobile subcategories */}
                {screenWidth <= 768 && (
                    <div className="mt-5">
                        <CategoryUnderline name={CAT} label="उप-विभाग" />
                        <div className="grid grid-cols-3 gap-3">
                            {['मुंबई', 'पुणे', 'नागपूर', 'औरंगाबाद', 'कोल्हापूर', 'नाशिक'].map((city) => (
                                <a
                                    key={city}
                                    className="mr block px-3 py-3.5 border border-(--border-default) text-[13px] font-semibold cursor-pointer"
                                >
                                    {city} →
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Evergreen */}
                <div className="mt-5">
                    <CategoryUnderline name={CAT} label="विशेष वाचा" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {EVERGREEN.map((h, i) => (
                            <StandardCard key={i} layout="col" category={CAT} headline={h} />
                        ))}
                    </div>
                </div>

                {/* Related tags */}
                <div className="mt-5">
                    <div className="mr text-[13px] font-bold tracking-[0.06em] uppercase mb-3.5">
                        संबंधित विषय · TOPIC CLUSTER
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        {RELATED_TAGS.map((t) => (
                            <Link
                                key={t}
                                href={`/tag/${CAT}/${t}`}
                                className="mr px-3.5 py-2 bg-(--brand-primary-light) text-sm font-semibold rounded-full cursor-pointer"
                            >
                                #{t}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mobile ad */}
                {screenWidth <= 768 && (
                    <Ad
                        id="C3"
                        name="Mobile Category Before Footer"
                        size="Multiplex / Native"
                        height={300}
                        fluid
                        className="mt-5"
                    />
                )}
            </SectionLayout>
        </MainLayout>
    )
}

export default memo(Categories)