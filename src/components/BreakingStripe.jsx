"use client"

import { memo, useEffect, useRef, useState } from "react"
import axiosInstance from "@/lib/axios"
import Link from "next/link"

const FALLBACK = [
    "विधानसभा निवडणूक निकाल जाहीर",
    "सरकार स्थापनेच्या हालचालींना वेग",
    "मुंबईत जोरदार पाऊस"
]

const BreakingStrip = () => {
    const [items, setItems] = useState([])
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        let mounted = true
        const fetchBreaking = async () => {
            try {
                const res = await axiosInstance.get('/news/breaking', { params: { limit: 15 } })
                if (mounted && res.data?.success) {
                    setItems(res.data.data || [])
                }
            } catch (err) {
                console.error('Failed to load breaking news:', err)
                if (mounted) setItems(FALLBACK.map((t, i) => ({ id: `f-${i}`, title: t })))
            }
        }
        fetchBreaking()
        return () => { mounted = false }
    }, [])

    const handleMouseEnter = () => {
        // Pause sliding when hovered
        setPaused(true)
    }

    const handleMouseLeave = () => {
        // Resume sliding
        setPaused(false)
    }

    const renderItems = () => {
        if (!items || !items.length) return FALLBACK.map((t, i) => (
            <span key={`fb-${i}`} className="breaking-item">{t}</span>
        ))

        // Render each item as a clickable/hoverable element
        return items.map((it, idx) => (
            <Link key={it.id} href={`/article/${it.slug}`}>
                <span
                    key={it.id || idx}
                    className="breaking-item"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    title={it.title}
                >
                    {it.title}
                </span>
            </Link>
        ))
    }

    return (
        <div className="h-10 bg-(--color-breaking) text-white flex items-center px-4 overflow-hidden gap-3">
            <span className="text-[11px] font-extrabold tracking-[0.08em] px-2 py-0.75 bg-white/20 rounded-[3px] shrink-0">
                BREAKING
            </span>

            <div className="breaking-marquee-wrapper" onMouseLeave={handleMouseLeave}>
                <div className="breaking-marquee" aria-hidden={false}>
                    {/* duplicate items to create continuous loop */}
                    <div className={`breaking-track ${paused ? 'paused' : ''}`}>
                        {renderItems()}
                    </div>
                    <div className={`breaking-track ${paused ? 'paused' : ''}`} aria-hidden>
                        {renderItems()}
                    </div>
                </div>
            </div>

            <style>{`
                .breaking-marquee-wrapper{flex:1; overflow:hidden}
                .breaking-marquee{display:flex; align-items:center}
                .breaking-track{display:inline-flex; gap:24px; white-space:nowrap; align-items:center; padding-left:8px}
                .breaking-item{font-size:13px; display:inline-block; cursor:pointer}
                @keyframes breaking-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
                .breaking-track{animation: breaking-scroll 50s linear infinite}
                .breaking-track.paused{animation-play-state:paused}
            `}</style>
        </div>
    )
}

export default memo(BreakingStrip)