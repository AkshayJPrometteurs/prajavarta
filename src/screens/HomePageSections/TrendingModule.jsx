"use client"

import { memo } from "react"
import CategoryUnderline from '@/components/ui/CategoryUnderline'
import { catColor } from '@/lib/catColors'
import { getCategoryNames, getCategoryNamesEnglish } from "@/lib/helper"
import useImageExists from "@/hooks/useImageExists"
import Image from "next/image"
import Link from "next/link"

// Heat gradient: rank 1 = hottest red → rank 5 = coolest blue
const RANK_COLORS = ['#B71C1C', '#E64A19', '#F9A825', '#2E7D32', '#1565C0']

const TrendingModule = ({ items, label = 'ट्रेंडिंग', isBgColor }) => {
	return (
		<section className={isBgColor ? 'bg-gray-100 p-4 sm:p-6' : ''}>
			<CategoryUnderline
				name="Maharashtra"
				label={label}
				url="/all-news"
			/>

			<ol className="list-none m-0 p-0">
				{items?.map((item, i) => {
					const { exists } = useImageExists(item.featuredImage)
					return (
						<li
							key={i}
							className={`grid grid-cols-[40px_1fr_64px] sm:grid-cols-[44px_1fr_76px] gap-3 py-3 items-center cursor-pointer ${i < items?.length - 1
								? 'border-b border-gray-300'
								: ''
								}`}
						>
							{/* Color-coded rank badge */}
							<div
								className="w-10 h-10 rounded flex items-center justify-center text-white text-lg sm:text-xl font-black shrink-0"
								style={{
									background: RANK_COLORS[i] ?? 'var(--brand-primary)',
									boxShadow: `${RANK_COLORS[i] ?? 'var(--brand-primary)'}55 0 2px 6px`,
								}}
							>
								{i + 1}
							</div>

							{/* Category + headline */}
							<div className="min-w-0">
								<Link
									href={`/news/${getCategoryNamesEnglish(item.categoryIds)}`}
									className="mr text-xs font-bold uppercase tracking-wider mb-1"
									style={{ color: catColor(getCategoryNames(item.categoryIds)) }}
								>
									{getCategoryNames(item.categoryIds)}
								</Link>

								<Link
									href={`/article/${item.slug}`}
									className="mr m-0 text-xs sm:text-sm font-semibold overflow-hidden line-clamp-2"
								>
									{item.title}
								</Link>
							</div>

							{/* Thumbnail placeholder */}
							{exists ? (
								<Link href={`/article/${item.slug}`}>
									<Image
										src={item.featuredImage}
										alt={item.title}
										width={64}
										height={64}
										className="w-16 sm:w-20 h-12 sm:h-14 shrink-0"
									/>
								</Link>
							) : (
								<div className="imgph w-16 sm:w-20 h-12 sm:h-14 rounded text-[9px] shrink-0" />
							)}
						</li>
					)
				})}
			</ol>
		</section>
	)
}

export default memo(TrendingModule)