import { Suspense } from 'react'
import TrendingNews from "@/screens/TrendingNews";

export const metadata = {
    title: "ट्रेंडिंग बातम्या - " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "संपूर्ण महाराष्ट्रातील सध्याच्या सर्वात लोकप्रिय आणि चर्चिल्या जाणाऱ्या बातम्या.",
};

const TrendingPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <TrendingNews />
        </Suspense>
    )
}

export default TrendingPage;
