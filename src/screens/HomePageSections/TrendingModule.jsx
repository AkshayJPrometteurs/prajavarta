"use client"

import CategoryUnderline from '@/components/ui/CategoryUnderline'
import { catColor } from '@/lib/catColors'

// Heat gradient: rank 1 = hottest red → rank 5 = coolest blue
const RANK_COLORS = ['#B71C1C', '#E64A19', '#F9A825', '#2E7D32', '#1565C0']

export default function TrendingModule({ items, label = 'ट्रेंडिंग', isBgColor }) {
	return (
		<section className={isBgColor ? 'bg-(--surface-secondary) p-6' : ''}>
			<CategoryUnderline name="Maharashtra" label={label} />
			<ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
				{items.map((item, i) => (
					<li
						key={i}
						style={{
							display: 'grid',
							gridTemplateColumns: '44px 1fr 76px',
							gap: 12,
							padding: '12px 0',
							borderBottom:
								i < items.length - 1
									? '1px solid var(--border-default)'
									: 'none',
							alignItems: 'center',
							cursor: 'pointer',
						}}
					>
						{/* Color-coded rank badge */}
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: 4,
								background: RANK_COLORS[i] ?? 'var(--brand-primary)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#fff',
								fontSize: 18,
								fontWeight: 900,
								fontFamily: 'var(--font-en)',
								flexShrink: 0,
								boxShadow: `${RANK_COLORS[i] ?? 'var(--brand-primary)'
									}55 0 2px 6px`,
							}}
						>
							{i + 1}
						</div>

						{/* Category + headline */}
						<div style={{ minWidth: 0 }}>
							<div
								className="mr"
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: catColor(item.c),
									textTransform: 'uppercase',
									letterSpacing: '0.05em',
									marginBottom: 3,
								}}
							>
								{item.c}
							</div>
							<p
								className="mr"
								style={{
									margin: 0,
									fontSize: 14,
									lineHeight: 1.4,
									fontWeight: 600,
									color: 'var(--text-primary)',
									overflow: 'hidden',
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
								}}
							>
								{item.h}
							</p>
						</div>

						{/* Thumbnail placeholder */}
						<div
							className="imgph"
							style={{
								width: 76,
								height: 54,
								borderRadius: 4,
								flexShrink: 0,
								fontSize: 9,
							}}
						/>
					</li>
				))}
			</ol>
		</section>
	)
}