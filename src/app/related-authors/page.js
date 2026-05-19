import { Suspense } from 'react'
import RelatedAuthors from '@/screens/RelatedAuthors'

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RelatedAuthors />
        </Suspense>
    )
}
