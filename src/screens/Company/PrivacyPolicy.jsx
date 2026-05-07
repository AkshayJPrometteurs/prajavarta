"use client"

import { memo } from "react"
import MainLayout from "@/layout/MainLayout"
import Link from "next/link"

const SECTIONS = [
    {
        title: '१. आम्ही कोणती माहिती गोळा करतो',
        content: `आम्ही खालील प्रकारची माहिती गोळा करतो:
            **वैयक्तिक माहिती:** जेव्हा तुम्ही न्यूजलेटरसाठी नोंदणी करता, टिप्पणी करता किंवा खाते तयार करता तेव्हा तुमचे नाव, ईमेल पत्ता आणि फोन नंबर.
            **वापर माहिती:** तुम्ही कोणते लेख वाचता, किती वेळ घालवता, कोणत्या डिव्हाइसवरून भेट देता याची माहिती.
            **तांत्रिक माहिती:** IP पत्ता, ब्राउझर प्रकार, कुकीज आणि लॉग फाइल्स.
        `,
    },
    {
        title: '२. माहितीचा वापर कसा केला जातो',
        content: `गोळा केलेल्या माहितीचा वापर खालील उद्देशांसाठी केला जातो:
            • तुम्हाला वैयक्तिकृत बातम्या आणि सामग्री प्रदान करणे
            • न्यूजलेटर आणि ब्रेकिंग न्यूज अलर्ट पाठवणे
            • वेबसाइटचे कार्यप्रदर्शन सुधारणे
            • जाहिरात लक्ष्यीकरण (केवळ एकत्रित स्तरावर)
            • कायदेशीर आणि नियामक आवश्यकतांचे पालन करणे
        `,
    },
    {
        title: '३. माहिती सामायिकरण',
        content: `आम्ही तुमची वैयक्तिक माहिती तृतीय पक्षांना विकत नाही. तथापि, खालील परिस्थितींमध्ये माहिती सामायिक केली जाऊ शकते:
            • **सेवा प्रदाते:** Google Analytics, Comscore सारख्या विश्वासार्ह तांत्रिक भागीदारांसह
            • **कायदेशीर आवश्यकता:** न्यायालयाच्या आदेशानुसार किंवा सरकारी विनंतीनुसार
            • **व्यवसाय हस्तांतरण:** कंपनी विलीनीकरण किंवा अधिग्रहणाच्या वेळी
        `,
    },
    {
        title: '४. कुकीज आणि ट्रॅकिंग',
        content: `आमची वेबसाइट कुकीज वापरते. तुम्ही ब्राउझर सेटिंग्जमधून कुकीज नियंत्रित करू शकता. अधिक माहितीसाठी आमचे कुकी धोरण पहा.
            Google AdSense जाहिराती दाखवण्यासाठी वापरकर्त्याच्या पूर्वीच्या भेटींवर आधारित कुकीज वापरू शकते.
        `,
    },
    {
        title: '५. डेटा सुरक्षा',
        content: `तुमच्या माहितीचे संरक्षण करण्यासाठी आम्ही SSL एन्क्रिप्शन, सुरक्षित सर्व्हर आणि नियमित सुरक्षा ऑडिट वापरतो. तथापि, इंटरनेटवर कोणतीही माहिती १००% सुरक्षित नसते हे कृपया लक्षात ठेवा.`,
    },
    {
        title: '६. तुमचे अधिकार (DPDP अधिनियम २०२३)',
        content: `डिजिटल वैयक्तिक डेटा संरक्षण अधिनियम २०२३ अंतर्गत तुम्हाला खालील अधिकार आहेत:
            • तुमची माहिती पाहण्याचा अधिकार
            • तुमची माहिती दुरुस्त करण्याचा अधिकार
            • तुमची माहिती हटवण्याचा अधिकार (विसरण्याचा अधिकार)
            • माहिती प्रक्रियेस नकार देण्याचा अधिकार
            या अधिकारांचा वापर करण्यासाठी privacy@prajavarta.com वर संपर्क करा.
        `,
    },
    {
        title: '७. धोरणातील बदल',
        content: `आम्ही हे धोरण वेळोवेळी अद्यतनित करू शकतो. महत्त्वपूर्ण बदलांबद्दल आम्ही ईमेलद्वारे किंवा वेबसाइटवर सूचना देऊ. या पानावरील "अखेरचे अद्यतन" तारीख तपासा.`,
    },
]

const PROCESS = [
    { step: '०१', label: 'वार्तांकन', desc: 'पत्रकार स्रोतांशी थेट संपर्क साधतात आणि प्राथमिक माहिती गोळा करतात.' },
    { step: '०२', label: 'पडताळणी', desc: 'किमान दोन स्वतंत्र स्रोतांकडून तथ्यांची पुष्टी केली जाते.' },
    { step: '०३', label: 'संपादन', desc: 'उपसंपादक भाषा, तथ्य आणि संदर्भ तपासतात.' },
    { step: '०४', label: 'प्रकाशन', desc: 'वरिष्ठ संपादकाच्या मान्यतेनंतरच महत्त्वाच्या बातम्या प्रकाशित होतात.' },
    { step: '०५', label: 'देखरेख', desc: 'प्रकाशनानंतरही बातम्यांवर लक्ष ठेवले जाते; आवश्यक असल्यास अद्यतन केले जाते.' },
]

const PrivacyPolicy = () => {
    return (
        <MainLayout>
            <div className="border-b-4 border-(--brand-primary) pb-6 mb-10">
                <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-3">
                    धोरण · POLICY
                </div>

                <h1 className="mr m-0 mb-3 text-[clamp(26px,3.5vw,40px)] font-extrabold leading-[1.1]">
                    गोपनीयता धोरण
                </h1>

                <div className="text-[13px] text-(--text-tertiary)">
                    <span className="mr">अखेरचे अद्यतन: १ एप्रिल २०२६</span>
                    <span className="mx-2">·</span>
                    <span className="mr">DPDP अधिनियम २०२३ अनुरूप</span>
                </div>
            </div>

            <p className="mr text-base leading-[1.8] text-(--text-secondary) mb-10 p-5 bg-(--surface-secondary) border-l-[3px] border-(--brand-primary)">
                प्रजावार्ता मीडिया प्रा. लि. (&ldquo;आम्ही&rdquo;, &ldquo;आमचे&rdquo;) तुमच्या गोपनीयतेला अत्यंत महत्त्व देते. हे धोरण स्पष्ट करते की आम्ही तुमची वैयक्तिक माहिती कशी गोळा करतो, वापरतो आणि संरक्षित करतो.
            </p>

            <div className="flex flex-col gap-9">
                {SECTIONS.map((s) => (
                    <div key={s.title}>
                        <h2 className="mr text-[18px] font-extrabold mb-3.5 text-(--text-primary)">
                            {s.title}
                        </h2>

                        <div className="mr text-[15px] leading-[1.9] text-(--text-secondary) whitespace-pre-line">
                            {s.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-5 border border-(--border-default) border-t-[3px] border-t-(--brand-primary)">
                <div className="mr text-[15px] font-bold mb-2">
                    प्रश्न आहेत?
                </div>

                <p className="mr m-0 text-sm text-(--text-secondary)">
                    गोपनीयता धोरणाबद्दल प्रश्नांसाठी: <Link href={`mailto:privacy@prajavarta.com`}><strong>privacy@prajavarta.com</strong></Link><br />
                    Prajavarta Media Pvt. Ltd., ४०२ प्रेस कॉम्प्लेक्स, FC रोड, पुणे ४११ ००५
                </p>
            </div>
        </MainLayout>
    )
}

export default memo(PrivacyPolicy)