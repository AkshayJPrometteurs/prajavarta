import { Suspense } from 'react'
import RecentlyUpdatedNews from "@/screens/RecentlyUpdatedNews";

export const metadata = {
    title: 'नुकतेच अद्यतनित बातम्या | प्रजावार्ता',
    description: 'संपूर्ण महाराष्ट्रातील आणि विविध विभागांतील ताज्या आणि नुकत्याच अद्यतनित करण्यात आलेल्या बातम्या.',
}

export default function RecentlyUpdatedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RecentlyUpdatedNews />
        </Suspense>
    )
}
