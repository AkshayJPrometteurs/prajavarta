export default function Ad({
    id,
    name,
    size,
    width,
    height,
    sticky,
    fluid,
    style,
    className,
}) {
    return (
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
    )
}