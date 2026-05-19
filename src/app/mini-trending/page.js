import { Suspense } from 'react'
import MiniTrendingNews from "@/screens/MiniTrendingNews";

export const metadata = {
    title: 'मिनी ट्रेंडिंग बातम्या | प्रजावार्ता',
    description: 'राज्यातील आणि देशातील महत्त्वाच्या घडामोडींच्या संक्षिप्त पण वेगाने पसरणाऱ्या बातम्या.',
}

export default function MiniTrendingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <MiniTrendingNews />
        </Suspense>
    )
}
