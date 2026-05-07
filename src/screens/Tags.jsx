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
import { useParams } from "next/navigation"
import CompactListItem from "@/components/ui/CompactListItem"
import Newsletter from "@/components/Newsletter"
import TagSidebar from "./Sidebars/TagSidebar"
import Link from "next/link"
import SectionLayout from "@/layout/SectionLayout"

const LATEST = [
    'मराठा आरक्षणावर सर्वोच्च न्यायालयाची सुनावणी पुढे ढकलली',
    'जरांगे पाटील यांचा उपोषण मागे घेण्याचा निर्णय',
    'मराठा आरक्षणासाठी विधेयक मांडण्याची शक्यता',
    'OBC नेत्यांचा मराठा आरक्षणाला विरोध कायम',
    'मराठा आरक्षण: सर्वपक्षीय बैठकीत तोडगा काढण्याचा प्रयत्न',
]

const MOST_READ = [
    'मराठा आरक्षणाचा इतिहास: १९९० ते आजपर्यंत',
    'मराठा समाजाची लोकसंख्या किती? आकडेवारी काय सांगते',
    'OBC आरक्षणाचा मराठा आरक्षणाशी काय संबंध',
    'जरांगे पाटील कोण आहेत? संपूर्ण ओळख',
    'सर्वोच्च न्यायालयाने मराठा आरक्षण रद्द का केले?',
]

const RECENTLY_UPDATED = [
    { t: '२ मि.', h: 'जरांगे पाटीलांचे आज सकाळचे निवेदन' },
    { t: '४५ मि.', h: 'छत्रपती संभाजीनगरात शांतता' },
    { t: '२ तास', h: 'सरकारची उद्या समिती बैठक' },
    { t: '५ तास', h: 'मराठा संघटनांची एकत्रित बैठक पुढे ढकलली' },
]

const RELATED_TAGS = ['जरांगे पाटील', 'OBC आरक्षण', 'सर्वोच्च न्यायालय', 'विधानसभा', 'मंत्रिमंडळ', 'महाराष्ट्र', 'समाजकारण']

const Tags = () => {
    const { screenWidth } = useScreenSize();
    const { slug = [] } = useParams();
    const [cat, tag] = slug;
    const CAT = cat ? decodeURIComponent(cat) : '';
    const TAG = tag ? decodeURIComponent(tag) : '';
    const TRENDING_TAG = [
        { c: CAT, h: 'मनोज जरांगे पाटील आज औरंगाबादेत उपोषणाला बसणार' },
        { c: CAT, h: 'सरकारने जरांगे पाटील यांच्याशी चर्चेसाठी समिती नेमली' },
        { c: CAT, h: 'मराठा आरक्षणावर मुख्यमंत्र्यांचे आज निवेदन' },
        { c: CAT, h: 'आरक्षण आंदोलनाचे पर्यटनावर परिणाम' },
        { c: CAT, h: 'OBC आयोगाच्या अहवालाला विरोध सुरूच' },
    ]
    return (
        <MainLayout isBannerAdvertisement>
            <div>
                {/* Tag header */}
                <div
                    className="pb-6 mb-8 border-b-4"
                    style={{ borderColor: catColor(CAT) }}
                >
                    <div className="mr text-[11px] font-bold tracking-[0.08em] uppercase mb-2">
                        TAG · विषय
                    </div>

                    <h1 className="mr mb-3 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                        #{TAG}
                    </h1>

                    <p className="mr m-0 text-[clamp(13px,1.2vw,16px)] leading-[1.6]">
                        #{TAG} विषयाशी संबंधित सर्व बातम्या, विश्लेषण आणि अद्यतने एकाच ठिकाणी. राज्यातील सामाजिक आणि राजकीय वर्तुळातील सर्वात चर्चित विषय.
                    </p>

                    <div className="flex gap-3 mt-3.5 text-[13px]">
                        <span className="mr">१४८ बातम्या</span>
                        <span>·</span>
                        <span className="mr">अद्यतनित: २९ एप्रिल</span>
                    </div>
                </div>

                <SectionLayout sidebar={<TagSidebar />}>
                    <HeroCard
                        category={CAT}
                        headline="मराठा आरक्षणावर सर्वोच्च न्यायालयाची सुनावणी पुढे ढकलली"
                        redirectUrl={`/article/${CAT}`}
                    />

                    {/* Latest */}
                    <div className="mt-5">
                        <CategoryUnderline name={CAT} label="ताज्या बातम्या" />
                        <div className="flex flex-col gap-4">
                            {LATEST.map((h, i) => (
                                <StandardCard key={i} category={CAT} headline={h} />
                            ))}
                        </div>
                    </div>

                    <Ad
                        id={screenWidth <= 768 ? "C1" : "DC3"}
                        name={screenWidth <= 768 ? "Mobile Tag Below Hero" : "Desktop Tag Between Modules"}
                        size={screenWidth <= 768 ? "300×250" : "728×90"}
                        width={screenWidth <= 768 ? 300 : 728}
                        height={screenWidth <= 768 ? 250 : 90}
                        fluid={screenWidth <= 768}
                        className={`mx-auto ${screenWidth <= 768 ? "inline-block" : ""}`}
                    />

                    {/* Trending */}
                    <div className="bg-(--surface-secondary) p-6">
                        <TrendingModule label={`${TAG}-मधील ट्रेंडिंग`} items={TRENDING_TAG} />
                    </div>

                    {/* Most read (mobile) */}
                    <div>
                        <CategoryUnderline name={CAT} label="सर्वाधिक वाचलेले" />
                        <ul className="list-none m-0 p-0">
                            {MOST_READ.map((h, i) => (
                                <li
                                    key={i}
                                    className="mr text-sm py-3.5 border-b border-(--border-default) font-medium"
                                >
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related tags */}
                    <div>
                        <div className="mr text-[13px] font-bold tracking-[0.06em] uppercase mb-3">
                            संबंधित विषय
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {RELATED_TAGS.map((t) => (
                                <Link
                                    key={t}
                                    href={`/tag/${CAT}/${t}`}
                                    className="mr px-3.5 py-2 bg-(--brand-primary-light) text-[13px] font-semibold rounded-full cursor-pointer"
                                >
                                    #{t}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile ad */}
                    {screenWidth <= 768 && (
                        <Ad id="C3" name="Mobile Tag Before Footer" size="Multiplex / Native" height={300} fluid />
                    )}
                </SectionLayout>
            </div>
        </MainLayout>
    )
}

export default memo(Tags)