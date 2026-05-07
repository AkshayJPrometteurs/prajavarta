import { catColor } from "@/lib/catColors"

export default function CategoryChip({ name, size = 'md' }) {
    const padding = size === 'sm' ? '3px 8px' : '5px 10px'
    const fontSize = size === 'sm' ? 10 : 11

    return (
        <span
            className="mr"
            style={{
                display: 'inline-block',
                padding,
                fontSize,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#fff',
                background: catColor(name),
                borderRadius: 2,
                textTransform: 'uppercase',
            }}
        >
            {name}
        </span>
    )
}