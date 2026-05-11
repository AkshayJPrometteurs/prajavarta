"use client"
import { memo } from "react"
import Ad from "../components/Ad"
import SecondaryStories from "./HomePageSections/SecondaryStories"
import TrendingModule from "./HomePageSections/TrendingModule"
import RecommendedGrid from "./HomePageSections/RecommendedGrid"
import { useScreenSize } from "@/hooks/useScreenSize"
import CategorySection from "@/components/ui/CategorySection"
import MainLayout from "@/layout/MainLayout"
import MainPageSidebar from "./Sidebars/MainPageSidebar"
import SectionLayout from "@/layout/SectionLayout"
import HeroCard from "@/components/cards/HeroCard"

const TRENDING_ITEMS = [
    { c: 'राजकारण', h: 'अजित पवार गटाची आज महत्त्वाची बैठक, मंत्रिपदाच्या मुद्द्यावर चर्चा' },
    { c: 'क्रीडा', h: 'रोहित शर्मा कसोटी संघातून निवृत्त; मुंबईकरांचा भावूक निरोप' },
    { c: 'व्यवसाय', h: 'रिलायन्सच्या तिमाही नफ्यात १८% वाढ, शेअर बाजार उसळला' },
    { c: 'मनोरंजन', h: 'रितेश देशमुखचा \'राजा शिवछत्रपती\' चित्रपट दिवाळीला प्रदर्शित' },
    { c: 'महाराष्ट्र', h: 'मराठवाड्यात अवकाळी पावसाचा कहर, १२ जिल्ह्यांत पीकहानी' },
]

const CATEGORY_SECTIONS = [
    {
        cat: 'महाराष्ट्र',
        hero: 'राज्यात कांद्याच्या भावात मोठी घसरण, शेतकऱ्यांचे आंदोलन सुरू',
        stories: [
            'नागपूर हिवाळी अधिवेशनाची तारीख निश्चित, १६ डिसेंबरपासून सुरुवात',
            'औरंगाबाद नामांतराचा वाद पुन्हा चर्चेत, सुप्रीम कोर्टात सुनावणी',
            'नाशिकमध्ये द्राक्ष निर्यातीत २०% घट, युरोपीय निर्बंधांचा परिणाम',
        ],
    },
    {
        cat: 'पुणे',
        hero: 'पुण्यात मेट्रोच्या तिसऱ्या टप्प्याचे काम सुरू, २०२८ पर्यंत पूर्णत्वाचे लक्ष्य',
        stories: [
            'हिंजवडी आयटी हब विस्ताराला राज्य सरकारची मंजुरी',
            'पीएमपीच्या ३०० नवीन ई-बस ताफ्यात येणार, सप्टेंबरपर्यंत सेवा',
            'कोरेगाव पार्क परिसरात रस्ते दुरुस्तीचे काम पूर्ण',
        ],
    },
    {
        cat: 'राजकारण',
        hero: 'विरोधी पक्षनेतेपदावरून ठाकरे आणि काँग्रेसमध्ये रस्सीखेच, चर्चा गुप्त',
        stories: [
            'लोकसभेत अध्यक्षपदासाठी इंडिया आघाडीची रणनीती ठरली',
            'एनसीपी शरद पवार गटाच्या प्रदेशाध्यक्षपदी सुनील तटकरे',
            'भाजप प्रदेशाध्यक्षपदी फडणवीसांची फेरनियुक्ती निश्चित',
        ],
    },
    {
        cat: 'गुन्हेगारी',
        hero: 'कुख्यात तस्कर ललित पाटीलला मुंबई पोलिसांनी अटक केली',
        stories: [
            'ठाण्यात सायबर फसवणुकीची ४.२ कोटींची तक्रार दाखल',
            'नाशिकमध्ये अंमली पदार्थ तस्करीचा भांडाफोड, ५ अटक',
            'मुंबईत खंडणी प्रकरणी निवृत्त पोलीस अधिकाऱ्यावर गुन्हा',
        ],
    },
    {
        cat: 'क्रीडा',
        hero: 'मुंबई इंडियन्सच्या नव्या प्रशिक्षकपदी महेंद्रसिंग धोनीच्या नावाची चर्चा',
        stories: [
            'विश्वचषक हॉकी स्पर्धेसाठी भारतीय संघाची घोषणा',
            'पीव्ही सिंधू ऑस्ट्रेलियन ओपनच्या उपांत्य फेरीत दाखल',
            'रणजी ट्रॉफीत मुंबईचा सलग दुसरा विजय',
        ],
    },
    {
        cat: 'व्यवसाय',
        hero: 'सेन्सेक्सने ऐतिहासिक ८०,००० चा टप्पा ओलांडला, बाजारात तेजी',
        stories: [
            'रिलायन्सच्या तिमाही नफ्यात १८% वाढ',
            'GST संकलनात फेब्रुवारीत १२% वाढ',
            'Infosys ने ३,५०० नव्या भरतीची घोषणा केली',
        ],
    },
]

const MainPage = () => {
    const { screenWidth } = useScreenSize();
    return (
        <MainLayout isBannerAdvertisement>
            <section>
                <SectionLayout sidebar={<MainPageSidebar />}>
                    {/* Hero story */}
                    <HeroCard
                        category="महाराष्ट्र"
                        headline="विधानसभेत सत्तासंघर्ष: सरकार स्थापनेच्या हालचालींना वेग, दिल्लीत रात्री बैठक"
                        subtitle="राज्यपाल भेट उद्या सकाळी; नवीन मंत्रिमंडळाची संभाव्य रचना समोर"
                        redirectUrl="/article/maharashtra"
                    />
                    <SecondaryStories />

                    {screenWidth < 992 && (
                        <div className="flex justify-center">
                            <Ad
                                id="DH3"
                                name="Mobile Homepage Below-Header"
                                size="300×250"
                                width="100%"
                                height="250"
                                className="flex items-center flex-col"
                            />
                        </div>
                    )}

                    <TrendingModule items={TRENDING_ITEMS} isBgColor />

                    <div className="flex justify-center">
                        <Ad
                            id="DH3"
                            name={screenWidth >= 992 ? "Desktop Between Categories" : "Mobile Homepage Below-Header"}
                            size={screenWidth >= 992 ? "728×90" : "300×250"}
                            width={screenWidth >= 992 ? 728 : '100%'}
                            height={screenWidth >= 992 ? 90 : 250}
                            className="flex items-center flex-col"
                        />
                    </div>

                    {CATEGORY_SECTIONS.map((sec) => (
                        <CategorySection
                            key={sec.cat}
                            cat={sec.cat}
                            hero={sec.hero}
                            stories={sec.stories}
                        />
                    ))}

                    <RecommendedGrid />

                    {screenWidth < 992 && (
                        <Ad
                            id="H4"
                            name="Mobile Homepage Above Footer"
                            size="Multiplex / Native"
                            height={320}
                            fluid
                        />
                    )}
                </SectionLayout>

                {/* Before-footer ad */}
                <div className="mt-6">
                    <Ad id="DH4" name="Desktop Before Footer" size="Responsive Native" height={140} fluid />
                </div>
            </section>
        </MainLayout>
    )
}

export default memo(MainPage)