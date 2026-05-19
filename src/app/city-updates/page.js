import { Suspense } from 'react'
import CityUpdatesNews from "@/screens/CityUpdatesNews";

export const metadata = {
    title: 'शहर अद्यतन | प्रजावार्ता',
    description: 'तुमच्या शहरातील आणि जिल्ह्यातील ताज्या घडामोडी आणि महत्त्वाच्या बातम्या.',
}

export default function CityUpdatesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CityUpdatesNews />
        </Suspense>
    )
}
