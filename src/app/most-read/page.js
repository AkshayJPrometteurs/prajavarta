import { Suspense } from 'react'
import MostReadNews from "@/screens/MostReadNews";

export const metadata = {
    title: 'सर्वाधिक वाचलेल्या बातम्या | प्रजावार्ता',
    description: 'संपूर्ण महाराष्ट्रातील आणि विविध विभागांतील सर्वाधिक वाचल्या जाणाऱ्या ताज्या बातम्या.',
}

export default function MostReadPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <MostReadNews />
        </Suspense>
    )
}
