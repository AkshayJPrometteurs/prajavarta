// hooks/useImageExists.js

"use client"

import { useEffect, useState } from "react"

export default function useImageExists(imageUrl) {
    const [exists, setExists] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!imageUrl) {
            setExists(false)
            setLoading(false)
            return
        }

        const img = new Image()

        img.onload = () => {
            setExists(true)
            setLoading(false)
        }

        img.onerror = () => {
            setExists(false)
            setLoading(false)
        }

        img.src = imageUrl
    }, [imageUrl])

    return { exists, loading }
}