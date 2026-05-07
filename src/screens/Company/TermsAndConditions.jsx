"use client"

import { memo } from "react"
import MainLayout from "@/layout/MainLayout"
import Link from "next/link"

const SECTIONS = [
    {
        title: '१. स्वीकृती',
        content: 'या वेबसाइटला भेट देऊन किंवा वापरून, तुम्ही या अटी आणि शर्तींना सहमत होता. जर तुम्ही या अटींशी सहमत नसाल, तर कृपया या वेबसाइटचा वापर करू नका.',
    },
    {
        title: '२. बौद्धिक संपदा',
        content: 'या वेबसाइटवरील सर्व सामग्री — लेख, फोटो, व्हिडिओ, लोगो, ग्राफिक्स — हे प्रजावार्ता मीडिया प्रा. लि. किंवा त्याच्या सामग्री प्रदात्यांच्या मालकीचे आहे आणि कॉपीराइट कायद्यांद्वारे संरक्षित आहे. पूर्व लेखी परवानगीशिवाय कोणतीही सामग्री पुनर्मुद्रित, वितरित किंवा व्यावसायिक उद्देशांसाठी वापरणे प्रतिबंधित आहे.',
    },
    {
        title: '३. परवानगीयोग्य वापर',
        content: `तुम्ही खालील गोष्टी करू शकता:
            • वैयक्तिक, गैर-व्यावसायिक उद्देशांसाठी लेख वाचणे
            • सोशल मीडियावर लेखांचे दुवे शेअर करणे
            • शैक्षणिक उद्देशांसाठी थोड्या भागाचा उद्धृत वापर (स्रोत नमूद करणे आवश्यक)

            तुम्ही खालील गोष्टी करू शकत नाही:
            • परवानगीशिवाय सामग्री कॉपी करणे किंवा पुनर्प्रकाशित करणे
            • बॉट्स किंवा स्क्रेपर्सद्वारे डेटा काढणे
            • या वेबसाइटच्या सुरक्षा प्रणालीमध्ये हस्तक्षेप करणे
        `,
    },
    {
        title: '४. वापरकर्ता सामग्री',
        content: 'जेव्हा तुम्ही टिप्पण्या, पत्रे किंवा इतर सामग्री सादर करता, तेव्हा तुम्ही प्रजावार्ताला ती सामग्री वापरण्याचा, सुधारण्याचा आणि प्रकाशित करण्याचा अधिकार देता. द्वेषपूर्ण, बदनामीकारक किंवा बेकायदेशीर सामग्री प्रतिबंधित आहे.',
    },
    {
        title: '५. जबाबदारी मर्यादा',
        content: 'प्रजावार्ता बातम्यांची अचूकता राखण्याचा प्रयत्न करते, परंतु कोणत्याही माहितीच्या अचूकतेसाठी, पूर्णतेसाठी किंवा उपयुक्ततेसाठी हमी देत नाही. वेबसाइटच्या वापरामुळे झालेल्या कोणत्याही नुकसानासाठी आम्ही जबाबदार नाही.',
    },
    {
        title: '६. तृतीय पक्ष दुवे',
        content: 'आमच्या वेबसाइटवर तृतीय पक्षाच्या वेबसाइट्सचे दुवे असू शकतात. या वेबसाइट्सच्या सामग्री किंवा गोपनीयता धोरणांसाठी आम्ही जबाबदार नाही.',
    },
    {
        title: '७. जाहिरात',
        content: 'या वेबसाइटवर Google AdSense आणि इतर जाहिरात नेटवर्कच्या जाहिराती दिसू शकतात. जाहिरातींच्या सामग्रीसाठी आम्ही जबाबदार नाही.',
    },
    {
        title: '८. लागू कायदा',
        content: 'या अटी आणि शर्ती भारतीय कायद्यानुसार शासित आहेत. कोणतेही विवाद पुणे न्यायालयाच्या अधिकारक्षेत्रात येतील.',
    },
    {
        title: '९. अटींमधील बदल',
        content: 'आम्ही या अटी कधीही बदलण्याचा अधिकार राखतो. बदलांबद्दल आम्ही या पानावर सूचना देऊ. वेबसाइटचा सतत वापर म्हणजे नवीन अटींची स्वीकृती मानली जाते.',
    },
]

const TermsAndConditions = () => {
    return (
        <MainLayout>
            <div className="border-b-4 border-(--brand-primary) pb-6 mb-10">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-3">
                    धोरण · POLICY
                </div>

                <h1 className="mr m-0 mb-3 text-[clamp(26px,3.5vw,40px)] font-extrabold leading-[1.1]">
                    अटी व शर्ती
                </h1>

                <div className="text-[13px] text-(--text-tertiary)">
                    <span className="mr">अखेरचे अद्यतन: १ एप्रिल २०२६</span>
                </div>
            </div>

            <p className="mr text-[15px] leading-[1.8] text-(--text-secondary) mb-10 px-5.5 py-4.5 bg-(--surface-secondary) border-l-[3px] border-(--brand-primary)">
                prajavarta.com ला भेट देण्यापूर्वी हे दस्तावेज काळजीपूर्वक वाचा. या सेवेचा वापर केल्याने तुम्ही खालील अटी स्वीकारता.
            </p>

            <div className="flex flex-col gap-8">
                {SECTIONS.map((s) => (
                    <div key={s.title} className="pb-8 border-b border-(--border-default)">
                        <h2 className="mr text-[18px] font-extrabold mb-3 text-(--text-primary)">
                            {s.title}
                        </h2>

                        <p className="mr m-0 text-[15px] leading-[1.9] text-(--text-secondary) whitespace-pre-line">
                            {s.content}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-10 mb-12 p-5 border border-(--border-default)">
                <p className="mr m-0 text-sm text-(--text-secondary)">
                    प्रश्नांसाठी: <Link href={`mailto:legal@prajavarta.com`}><strong>legal@prajavarta.com</strong></Link><br />
                    Prajavarta Media Pvt. Ltd. | CIN: U22212MH2021PTC345678
                </p>
            </div>
        </MainLayout>
    )
}

export default memo(TermsAndConditions)