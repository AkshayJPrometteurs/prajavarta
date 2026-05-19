import { Suspense } from 'react'
import AllNews from "@/screens/AllNews";

export const metadata = {
    title: 'सर्व बातम्या | प्रजावार्ता',
    description: 'महाराष्ट्रातील सर्वात ताज्या आणि महत्वाच्या बातम्या.',
}

export default function AllNewsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AllNews />
        </Suspense>
    )
}
