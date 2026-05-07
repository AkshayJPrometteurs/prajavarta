"use client"

import { memo } from "react";
import Ad from "@/components/Ad";
import Header from "./Header";
import Footer from "./Footer";
import BreakingStripe from "@/components/BreakingStripe";
import { useScreenSize } from "@/hooks/useScreenSize";

const MainLayout = ({ children, isBannerAdvertisement = false }) => {
	const { screenWidth } = useScreenSize();
	return (
		<div className="min-h-screen flex flex-col bg-white text-slate-900 overflow-x-hidden">
			<Header />
			<BreakingStripe />
			{isBannerAdvertisement && (
				<div className="bg-(--surface-secondary) w-full overflow-hidden p-4 md:py-6">
					<Ad
						id="DH1"
						name="Desktop Homepage Top Billboard"
						size="970×250"
						width={970}
						height={250}
						className="mx-auto"
						fluid={screenWidth <= 992}
					/>
				</div>
			)}
			<main className="flex-1 w-full md:max-w-7xl mx-auto p-4 md:p-8 overflow-x-hidden">{children}</main>
			<Footer />
		</div>
	);
}

export default memo(MainLayout);
