import Logo from '@/components/Logo'

const DESKTOP_COLS = [
	{ t: 'विभाग', items: ['महाराष्ट्र', 'पुणे', 'मुंबई', 'राजकारण', 'गुन्हेगारी', 'क्रीडा', 'व्यवसाय', 'मनोरंजन'] },
	{ t: 'कंपनी', items: ['आमच्याबद्दल', 'संपर्क', 'संपादकीय धोरण', 'फॅक्ट चेक', 'दुरुस्ती धोरण', 'करिअर्स'] },
	{ t: 'धोरणे', items: ['गोपनीयता', 'अटी व शर्ती', 'कुकी धोरण', 'DPDP अनुपालन', 'जाहिरात द्या'] },
	{ t: 'Follow', items: ['Twitter', 'Facebook', 'WhatsApp Channel', 'YouTube', 'Instagram'] },
]

const MOBILE_COLS = [
	{ t: 'विभाग', items: ['महाराष्ट्र', 'पुणे', 'राजकारण', 'क्रीडा'] },
	{ t: 'कंपनी', items: ['आमच्याबद्दल', 'संपादकीय धोरण', 'फॅक्ट चेक'] },
]

export default function Footer() {
	return (
		<footer className="bg-[#0f1f2e] text-white mt-6">

			{/* Desktop footer */}
			<div className="hidden md:block max-w-7xl mx-auto px-8 py-12">
				<div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 mb-8">

					<div>
						<Logo big inverted />
						<p className="mr text-[13px] leading-[1.7] opacity-70 mt-3">
							मराठीतून विश्वासार्ह बातम्या · संपादकीय निष्ठा आणि वाचनीय अनुभव.
						</p>
					</div>

					{DESKTOP_COLS.map((col) => (
						<div key={col.t}>
							<div className="mr text-xs font-bold tracking-[0.08em] uppercase mb-3 opacity-85">
								{col.t}
							</div>

							<ul className="flex flex-col gap-2">
								{col.items.map((item) => (
									<li
										key={item}
										className="mr text-[13px] opacity-70 cursor-pointer"
									>
										{item}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="border-t border-white/10 pt-5 flex justify-between text-xs opacity-60">
					<span>© 2026 Prajavarta Media Pvt. Ltd. RNI: MAHMAR/2024/12345</span>
					<span>v1.0</span>
				</div>
			</div>

			{/* Mobile footer */}
			<div className="block md:hidden px-5 py-5">
				<Logo big inverted />

				<p className="mr text-xs leading-[1.7] opacity-70 mt-2">
					मराठीतून विश्वासार्ह बातम्या.
				</p>

				<div className="grid grid-cols-2 gap-4 mt-5">
					{MOBILE_COLS.map((col) => (
						<div key={col.t}>
							<div className="mr text-[11px] font-bold tracking-[0.08em] uppercase mb-2 opacity-85">
								{col.t}
							</div>

							<ul className="flex flex-col gap-2">
								{col.items.map((item) => (
									<li key={item} className="mr text-xs opacity-70">
										{item}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="border-t border-white/10 pt-3 mt-5 text-[10px] opacity-50">
					© 2026 Prajavarta · RNI: MAHMAR/2024/12345
				</div>
			</div>

		</footer>
	)
}