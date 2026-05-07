import { ClockIcon } from './Icons'

export default function Meta({ author, minutes = 3, compact }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: compact ? 6 : 10,
                fontSize: 11,
                color: 'var(--text-tertiary)',
            }}
        >
            {author && <span className="mr">{author}</span>}
            {author && <span>·</span>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ClockIcon />
                {minutes} मिनिटे
            </span>
            <span>·</span>
            <span className="mr">२९ एप्रिल</span>
        </div>
    )
}