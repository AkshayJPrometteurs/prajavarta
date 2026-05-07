"use client"
import { memo, useEffect, useRef, useState } from "react"
import MainLayout from "@/layout/MainLayout"
import Link from "next/link"
import CategoryChip from "@/components/ui/CategoryChip"
import Ad from "@/components/Ad"
import { useScreenSize } from "@/hooks/useScreenSize"
import { WhatsAppIcon, FacebookIcon, XIcon, LinkIcon } from "@/components/ui/Icons"
import ImagePlaceholder from "@/components/ImagePlaceholder"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import StandardCard from "@/components/cards/StandardCard"
import TrendingModule from "./HomePageSections/TrendingModule"
import ArticleSidebar from "./Sidebars/ArticleSidebar"
import { useParams } from "next/navigation"
import SectionLayout from "@/layout/SectionLayout"

const TAGS = ['विधानसभा', 'सरकार', 'मंत्रिमंडळ', 'फडणवीस', 'शिंदे', 'राजकारण', 'महायुती']

const RELATED = [
    { c: 'राजकारण', h: 'शपथविधीसाठी वानखेडेची तयारी सुरू, ५०,००० निमंत्रितांची व्यवस्था' },
    { c: 'राजकारण', h: 'मुख्यमंत्रीपदावरून शिवसेना-भाजपमध्ये बंद दाराआड चर्चा' },
    { c: 'महाराष्ट्र', h: 'विधानसभा सत्ताबदलाचा अर्थव्यवस्थेवर काय परिणाम होईल?' },
    { c: 'राजकारण', h: 'विरोधी पक्षनेतेपदासाठी ठाकरे-काँग्रेसमधील रस्सीखेच कायम' },
    { c: 'पुणे', h: 'पुण्यातील आमदारांना मंत्रिमंडळात स्थान मिळणार का?' },
    { c: 'राजकारण', h: 'मंत्रिमंडळ विस्ताराचे संभाव्य चेहरे: संपूर्ण यादी' },
]

const TRENDING = [
    { c: 'क्रीडा', h: 'रोहित शर्मा कसोटी संघातून निवृत्त' },
    { c: 'व्यवसाय', h: 'रिलायन्सच्या तिमाही नफ्यात १८% वाढ' },
    { c: 'मनोरंजन', h: 'रितेश देशमुखचा \'राजा शिवछत्रपती\' दिवाळीला' },
    { c: 'महाराष्ट्र', h: 'मराठवाड्यात अवकाळी पावसाचा कहर' },
    { c: 'पुणे', h: 'पुणे मेट्रोच्या तिसऱ्या टप्प्याचे काम सुरू' },
]

const SHARE_BUTTONS = [
    { icon: <WhatsAppIcon size={14} />, color: '#25D366', label: 'WhatsApp' },
    { icon: <FacebookIcon size={14} />, color: '#1877F2', label: 'Facebook' },
    { icon: <XIcon size={14} />, color: '#000', label: 'X' },
    { icon: <LinkIcon size={14} />, color: '#6B6B6B', label: 'Copy' },
]

const Articles = () => {
    const { screenWidth } = useScreenSize();
    const [footerOffset, setFooterOffset] = useState(0);
    const anchorRef = useRef(null);
    const { slug = [] } = useParams();
    const [cat] = slug;
    const CAT = cat ? decodeURIComponent(cat) : '';
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (screenWidth > 768) return;
        const footer = document.querySelector('footer');
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const overlap = Math.max(0, window.innerHeight - entry.boundingClientRect.top);
                // Add a small gap so the bar sits just above the footer
                setFooterOffset(overlap > 0 ? overlap + 8 : 0);
            },
            {
                threshold: [0, 0.01, 1],
            }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, [screenWidth]);

    return (
        <MainLayout isBannerAdvertisement>
            <section>
                {/* Breadcrumb */}
                <div className="mr" style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>
                    <Link href="/">मुख्यपृष्ठ</Link>
                    {slug.length > 0 &&
                        slug.map((item, index) => {
                            const isLast = index === slug.length - 1;

                            return (
                                <span key={index}>
                                    <span style={{ margin: '0 6px' }}>›</span>

                                    {isLast ? (
                                        <span>{decodeURIComponent(item)}</span>
                                    ) : (
                                        <Link href={`/category/${item}`}>
                                            {decodeURIComponent(item)}
                                        </Link>
                                    )}
                                </span>
                            );
                        })}
                </div>

                <SectionLayout sidebar={<ArticleSidebar />}>
                    <CategoryChip name={CAT} />
                    <div>
                        <h1 className="mr my-3 leading-tight font-extrabold tracking-[-0.01em] text-(--text-primary) text-[clamp(26px,4vw,38px)]">
                            विधानसभेत सत्तासंघर्ष: सरकार स्थापनेच्या हालचालींना वेग, दिल्लीत रात्री बैठक
                        </h1>

                        <p className="mr mb-4 text-[clamp(16px,2vw,20px)] leading-[1.45] text-(--text-secondary) font-medium">
                            राज्यपाल भेट उद्या सकाळी; नवीन मंत्रिमंडळाची संभाव्य रचना समोर, फडणवीस आणि शिंदेंमध्ये सहमती जवळपास अंतिम
                        </p>

                        {/* Author byline */}
                        <div className="flex items-center gap-3 py-3 border-t border-b border-(--border-default)">
                            <div className="w-12 h-12 rounded-full bg-(--brand-primary-light) flex items-center justify-center font-bold text-(--brand-primary) text-base shrink-0">
                                SD
                            </div>

                            <div className="flex-1">
                                <div className="mr text-sm font-semibold">
                                    <Link href={`/author/सुनील देशमुख`}>
                                        सुनील देशमुख
                                    </Link>
                                    <span className="text-(--text-tertiary) font-normal">
                                        {" "}· राजकीय संपादक
                                    </span>
                                </div>

                                <div className="mr text-[11px] text-(--text-tertiary) mt-0.5">
                                    प्रकाशित: २९ एप्रिल २०२६, ०७:४५ · अद्यतनित: ०९:१५ · ६ मिनिटे वाचन
                                </div>
                            </div>

                            {/* Save button — desktop only */}
                            <button
                                className={`px-3.5 py-2 bg-white border border-(--border-strong) text-xs font-semibold rounded cursor-pointer`}
                            >
                                Save
                            </button>
                        </div>

                        {screenWidth < 768 && (
                            <div className="mt-4">
                                <div className="flex gap-2">
                                    {SHARE_BUTTONS.map((b, i) => (
                                        <button
                                            key={i}
                                            className="flex-1 flex items-center justify-center gap-1.25 px-1.5 py-2.25 bg-white border text-[10px] font-semibold rounded cursor-pointer"
                                            style={{ borderColor: b.color, color: b.color }}
                                        >
                                            {b.icon}
                                            <span>{b.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <ImagePlaceholder ratio="16/9" label="article hero · 1200×675" />

                        <p className="mr mt-2 text-xs leading-normal text-(--text-tertiary)">
                            फोटो: मंत्रालयाबाहेर पत्रकारांशी संवाद साधताना मुख्यमंत्री · PTI
                        </p>
                    </div>

                    {/* Mobile ad A1 */}
                    {screenWidth < 768 && (
                        <Ad
                            id="A1"
                            name="Mobile Article Below Hero Image"
                            size="300×250"
                            height={250}
                            fluid
                        />
                    )}

                    {/* ─ Article body ─ */}
                    <div className="max-w-170">
                        <p className="mr mt-0 text-(--text-primary)">
                            मुंबई: राज्यातील सत्तासंघर्षाला नवे वळण मिळाले असून, सरकार स्थापनेच्या हालचालींना वेग आला आहे. सोमवारी रात्री दिल्लीत झालेल्या उच्चस्तरीय बैठकीनंतर नवीन मंत्रिमंडळाची रचना जवळपास अंतिम झाल्याचे सांगण्यात येत आहे.
                        </p>

                        <p className="mr mt-4 text-(--text-primary)">
                            राज्यपाल भेटीची तारीख उद्या सकाळी निश्चित झाली असून, मुख्यमंत्रीपदाच्या उमेदवारीवरून शिवसेना आणि भाजपमध्ये काल रात्री उशिरापर्यंत चर्चा सुरू होती.
                        </p>

                        <Ad
                            id={screenWidth <= 768 ? "A2" : "DA3"}
                            name={screenWidth <= 768 ? "Mobile Article After P2" : "Desktop Article After P3"}
                            size={screenWidth <= 768 ? "300×250 / Native" : "300×250"}
                            height={250}
                            {...screenWidth <= 768 && { fluid: true }}
                            {...screenWidth > 768 && { width: 300 }}
                            className={screenWidth >= 786 ? 'inline-block mx-auto my-4 md:my-6' : 'my-4 md:my-6'}
                        />

                        {/* Key takeaways */}
                        <div className="border-l-[3px] border-(--brand-accent) p-4 bg-(--surface-secondary) my-2 mb-6">
                            <div className="mr text-[13px] font-bold text-(--brand-primary) mb-2.5 tracking-[0.02em]">
                                मुख्य मुद्दे
                            </div>

                            <ol className="mr pl-5 text-sm list-decimal" lang="mr">
                                <li>दिल्लीत रात्री ११ वाजेपर्यंत बैठक...</li>
                                <li>राज्यपाल भेट उद्या सकाळी १० वाजता...</li>
                                <li>उपमुख्यमंत्रीपदी दोन नावे...</li>
                            </ol>
                        </div>

                        <p className="mr">
                            सूत्रांच्या माहितीनुसार, बैठकीला केंद्रीय गृहमंत्री, पक्षाध्यक्ष आणि राज्यातील वरिष्ठ नेते उपस्थित होते. मंत्रालयांचे वाटप आणि उपमुख्यमंत्रीपदावरून बराच वेळ चर्चा रंगली.
                        </p>

                        <p className="mr mt-4">
                            महायुतीच्या प्रवक्त्यांनी दिलेल्या माहितीनुसार, शपथविधी सोहळा वानखेडे स्टेडियमवर होणार असून, पंतप्रधान आणि अनेक केंद्रीय मंत्र्यांच्या उपस्थितीची शक्यता आहे.
                        </p>

                        {/* Pull quote */}
                        <blockquote className="my-6 pl-6 border-l-4 border-(--brand-accent)">
                            <p className="mr m-0 text-[clamp(18px,2vw,24px)] leading-[1.4] font-semibold text-(--text-primary) not-italic">
                                “लोकशाही प्रक्रिया दिल्लीतून चालवली जात आहे — महाराष्ट्राचा निर्णय मुंबईत व्हायला हवा.”
                            </p>

                            <cite className="mr block mt-2 text-[13px] text-(--text-tertiary) not-italic">
                                — उद्धव ठाकरे, शिवसेना (UBT)
                            </cite>
                        </blockquote>

                        {/* Inline related */}
                        <div className="my-5 p-3 border border-(--border-default) border-l-[3px] border-l-(--brand-primary)">
                            <div className="text-[10px] font-bold text-(--brand-primary) tracking-[0.08em] uppercase mb-1.5">
                                संबंधित बातमी
                            </div>

                            <p className="mr m-0 text-[15px] font-semibold leading-[1.4] text-(--text-primary) cursor-pointer">
                                शपथविधीसाठी वानखेडेची तयारी सुरू, ५०,००० निमंत्रितांची व्यवस्था →
                            </p>
                        </div>

                        <p className="mr">
                            विरोधी पक्षांनी या निर्णयप्रक्रियेवर टीका केली असून, “लोकशाही प्रक्रिया दिल्लीतून चालवली जाते” असा आरोप शिवसेना (UBT) आणि काँग्रेसने केला आहे.
                        </p>

                        <p className="mr mt-4">
                            दरम्यान, विधानभवनाच्या सुरक्षा व्यवस्थेत वाढ करण्यात आली असून, मंत्रालय परिसरात पोलिस बंदोबस्त लावण्यात आला आहे.
                        </p>

                        <p className="mr mt-4">
                            राज्यपाल कार्यालयाने अद्याप अधिकृत निवेदन दिले नसले तरी, उद्या सकाळी १० वाजता भेटीसाठी वेळ मिळाल्याचे विश्वसनीय सूत्रांकडून समजते.
                        </p>

                        <Ad
                            id={screenWidth <= 768 ? "A3" : "DA4"}
                            name={screenWidth <= 768 ? "Mobile Article After P7-8" : "Desktop Article After P9"}
                            size={screenWidth <= 768 ? "300×250 / Native" : "300×250"}
                            height={250}
                            {...screenWidth <= 768 && { fluid: true }}
                            {...screenWidth > 768 && { width: 300 }}
                            className={screenWidth >= 786 ? 'inline-block mx-auto my-6 md:my-8' : 'my-6 md:my-8'}
                        />

                        <p className="mr">
                            आर्थिक आणि गृह खात्यांच्या वाटपावर सर्वाधिक चर्चा रंगली. महिला व बाल विकास, शिक्षण आणि कृषी ही खाती मित्रपक्षांकडे जाण्याची शक्यता आहे.
                        </p>

                        {/* Tags */}
                        <div className="my-8 mb-6 flex gap-2 flex-wrap">
                            {TAGS.map((t) => (
                                <Link
                                    key={t}
                                    href={`/tag/${CAT}/${t}`}
                                    className="mr px-3.5 py-1.5 border border-(--border-default) rounded-full text-[13px] text-(--text-secondary) cursor-pointer"
                                >
                                    #{t}
                                </Link>
                            ))}
                        </div>

                        {/* Author bio */}
                        <div className="p-6 bg-(--surface-secondary) flex gap-5 mb-8">
                            <div className="w-18 h-18 rounded-full bg-(--brand-primary-light) flex items-center justify-center font-bold text-(--brand-primary) text-[22px] shrink-0">
                                SD
                            </div>

                            <div>
                                <div className="mr text-[17px] font-bold">सुनील देशमुख</div>

                                <div className="mr text-[13px] text-(--text-tertiary) mb-2">
                                    राजकीय संपादक · १८ वर्षांचा अनुभव
                                </div>

                                <p className="mr mb-3 text-sm leading-[1.7] text-(--text-secondary)">
                                    महाराष्ट्राच्या राजकीय पटलावरील घडामोडींचे विश्लेषण. लोकमत, सकाळ आणि महाराष्ट्र टाइम्ससाठी काम केले आहे. राज्यशास्त्रात पुणे विद्यापीठातून पदव्युत्तर पदवी.
                                </p>

                                <div className="flex gap-3.5 text-[13px] text-(--brand-primary) font-semibold">
                                    <span className="cursor-pointer">Twitter</span>
                                    <span className="cursor-pointer">LinkedIn</span>
                                    <span className="cursor-pointer">Email</span>
                                    <span className="cursor-pointer">All articles →</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Ad
                        id={screenWidth <= 768 ? "A4" : "DA5"}
                        name={screenWidth <= 768 ? "Mobile Article Before Related" : "Desktop Article Before Recommendations"}
                        size={screenWidth <= 768 ? "Multiplex / Native" : "Responsive Native"}
                        height={screenWidth <= 768 ? 320 : 140}
                        fluid
                        className="my-4 md:my-6"
                    />

                    {/* Related stories */}
                    <div>
                        <CategoryUnderline name="Maharashtra" label="संबंधित बातम्या" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {RELATED.map((s, i) => (
                                <StandardCard key={i} category={s.c} headline={s.h} layout="col" />
                            ))}
                        </div>
                    </div>

                    <TrendingModule items={TRENDING} />
                </SectionLayout>

                {screenWidth <= 768 && (
                    <div
                        ref={anchorRef}
                        className={`${footerOffset ? '' : 'fixed'} inset-x-0 p-4 bg-white border-t border-(--border-default) shadow-[0_-2px_12px_rgba(0,0,0,0.1)] z-40 transition-all duration-150`}
                        style={{ bottom: footerOffset ? `${footerOffset}px` : '0px' }}
                    >
                        <Ad
                            id="A5"
                            name="Mobile Article Bottom Anchor"
                            size="320×50"
                            width={320}
                            height={50}
                            sticky
                            className="mx-auto"
                        />
                    </div>
                )}
            </section>
        </MainLayout>
    )
}

export default memo(Articles)