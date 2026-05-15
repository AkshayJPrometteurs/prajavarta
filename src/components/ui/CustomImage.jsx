"use client"

import Image from "next/image"
import { memo } from "react"
import useImageExists from "@/hooks/useImageExists"

/**
 * A reusable Image component that handles fallback to a 'no-image.jpg' 
 * if the provided source doesn't exist or is empty.
 */
const CustomImage = ({
    src,
    alt = "Prajavarta News",
    width = 600,
    height = 400,
    className = "",
    style = {},
    priority = false,
    ...props
}) => {
    const { exists, loading } = useImageExists(src);

    // Default fallback image path
    const fallbackSrc = "/no-image.jpg";

    // Determine which source to use
    // If src is missing or doesn't exist, use fallback
    const finalSrc = (src && exists) ? src : fallbackSrc;

    return (
        <Image
            src={finalSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={{
                objectFit: "cover",
                width: style.width,
                height: style.height || 'auto',
                ...style
            }}
            priority={priority}
            {...props}
        />
    )
}

export default memo(CustomImage)
