"use client"

import { Fragment, memo } from "react"

const Ad = ({
    id,
    name,
    size,
    width,
    height,
    sticky,
    fluid,
    style,
    className,
    url = ""
}) => {
    return (
        <Fragment>
            {url ? (
                <div className="adImageWrapper mx-auto" style={{ width: fluid ? '100%' : width, height: height || 'auto' }}>
                    <img src={url} alt={name || 'Advertisement'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ) : (
                <div
                    className={`adPlaceholder ${className || ''}`}
                    style={{
                        width: fluid ? '100%' : width ? width : '100%',
                        height: height || 'auto',
                        minHeight: height || 60,
                        ...style,
                    }}
                >
                    {sticky && <span className="stickyBadge">STICKY</span>}
                    <div className="label">जाहिरात · Advertisement</div>
                    <div className="adId">{id}</div>
                    <div className="adSize">{size}</div>
                    {name && <div className="adName">{name}</div>}
                </div>
            )}
        </Fragment>
    )
}

export default memo(Ad)