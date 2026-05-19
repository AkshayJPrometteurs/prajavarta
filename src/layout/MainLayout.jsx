"use client"

import { memo, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BreakingStripe from "@/components/BreakingStripe";
import { useScreenSize } from "@/hooks/useScreenSize";
import Ad from "@/components/Ad";
import axiosInstance from "@/lib/axios";

const MainLayout = ({ children, isBannerAdvertisement = false }) => {
	const { screenWidth } = useScreenSize();
	const [bannerImage, setBannerImage] = useState(null);

	const normalizeBannerUrl = (image) => {
		if (!image || typeof image !== 'string') return null
		if (image.startsWith('http')) return image
		return image.startsWith('/') ? image : `/${image}`
	}

	const getAdImage = async () => {
		try {
			const response = await axiosInstance.get(`/landing_page`);
			if (response?.data?.success) {
				setBannerImage(normalizeBannerUrl(response?.data?.data?.banner?.image || null));
			}
		} catch (error) {
			console.error("Error fetching ad image:", error);
			setBannerImage(null);
		}
	}

	useEffect(() => {
		getAdImage()
	}, [isBannerAdvertisement])

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
						url={bannerImage}
					/>
				</div>
			)}
			<main className="flex-1 w-full md:max-w-7xl mx-auto p-4 md:p-8 overflow-x-hidden">{children}</main>
			<Footer />
		</div>
	);
}

export default memo(MainLayout);
