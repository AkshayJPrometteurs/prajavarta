"use client"

import { useEffect, useState, memo } from "react"
import MainLayout from "@/layout/MainLayout"
import { useScreenSize } from "@/hooks/useScreenSize"
import { useParams, useRouter } from "next/navigation"
import Ad from "@/components/Ad"
import CategoryChip from "@/components/ui/CategoryChip"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import { LinkIcon, XIcon, MailIcon, LinkedinIcon } from "@/components/ui/Icons"
import StandardCard from "@/components/cards/StandardCard"
import TrendingModule from "./HomePageSections/TrendingModule"
import { getShortName } from "@/lib/helper"
import AuthorSidebar from "./Sidebars/AuthorSidebar"
import SectionLayout from "@/layout/SectionLayout"
import axiosInstance from "@/lib/axios"
import Pagination from "@/components/ui/Pagination"
import { useReduxAuth } from "@/hooks/useReduxAuth"

const Author = () => {
    const { screenWidth } = useScreenSize();
    const { slug } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useReduxAuth();

    const [author, setAuthor] = useState(null);
    const [articles, setArticles] = useState([]);
    const [mostRead, setMostRead] = useState([]);
    const [stats, setStats] = useState(null);
    const [relatedEditors, setRelatedEditors] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);

    const fetchAuthorData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/news/author/${slug}`, {
                params: { page, limit: 9 }
            });
            if (response.data.success) {
                const { author, articles, mostRead, stats, relatedEditors, pagination, isFollowing } = response.data.data;
                setAuthor(author);
                setArticles(articles);
                setMostRead(mostRead);
                setStats(stats);
                setRelatedEditors(relatedEditors);
                setPagination(pagination);
                setIsFollowing(isFollowing);
            }
        } catch (error) {
            console.error("Error fetching author data:", error);
        } finally {
            setLoading(false);
            if (page > 1) window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    const handleFollow = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        try {
            setFollowingLoading(true);
            const response = await axiosInstance.post('/news/author/follow', {
                authorId: author.id
            });
            if (response.data.success) {
                setIsFollowing(response.data.following);
                // Update stats locally
                setStats(prev => ({
                    ...prev,
                    followers: response.data.following ? prev.followers + 1 : prev.followers - 1
                }));
            }
        } catch (error) {
            console.error("Error following/unfollowing author:", error);
        } finally {
            setFollowingLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchAuthorData(currentPage);
    }, [slug, currentPage]);

    if (loading && !author) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="flex items-center justify-center py-20 min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            </MainLayout>
        );
    }

    if (!author) return null;

    const socialLinks = [
        { icon: <XIcon size={14} />, label: author.twitter ? `@${author.twitter.split('/').pop()}` : null, url: author.twitter },
        { icon: <LinkedinIcon size={14} />, label: 'LinkedIn', url: author.linkedin },
        { icon: <MailIcon size={14} />, label: author.email, url: author.email ? `mailto:${author.email}` : null },
    ].filter(s => s.url || s.label);

    return (
        <MainLayout isBannerAdvertisement>
            <div>
                {/* Author profile block */}
                <div className="flex flex-col md:flex-row gap-8 pb-8 mb-8 border-b-[3px] border-(--brand-primary) items-start">

                    {/* Avatar */}
                    <div className="flex justify-center md:justify-start w-full md:w-auto">
                        <div className="w-40 h-40 rounded-full bg-(--brand-primary-light) flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                            {author.image ? (
                                <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="mr text-5xl font-bold text-(--brand-primary)">
                                    {getShortName(author.name)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Profile info */}
                    <div className="flex-1">
                        <div className="flex flex-col items-center md:items-start w-full">
                            <div className="mr text-[11px] font-bold tracking-widest text-(--text-tertiary) uppercase mb-2">
                                AUTHOR · संपादक
                            </div>

                            <h1 className="mr m-0 mb-1.5 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-center md:text-left">
                                {author.name}
                            </h1>

                            <div className="mr text-[clamp(14px,1.5vw,18px)] font-semibold text-(--brand-primary) mb-3.5 text-center md:text-left">
                                {author.role} {author.experience && `· ${author.experience} अनुभव`}
                            </div>
                        </div>

                        {author.bio && (
                            <p className="mr m-0 mb-4 leading-[1.7] text-(--text-secondary) max-w-3xl text-center md:text-left">
                                {author.bio}
                            </p>
                        )}

                        {/* Credentials grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4.5 pt-3.5 border-t border-(--border-default)">
                            {[
                                { l: 'एकूण लेख', v: stats?.totalArticles || 0 },
                                { l: 'अनुभव', v: author.experience || 'अनुभवी' },
                                { l: 'फॉलोअर्स', v: stats?.followers || 0 },
                                { l: 'शहर', v: 'पुणे · मुंबई' },
                            ].map((s) => (
                                <div key={s.l}>
                                    <div className="mr text-[11px] text-(--text-tertiary) font-semibold tracking-wider uppercase mb-1">
                                        {s.l}
                                    </div>

                                    <div className="mr text-base font-bold text-(--text-primary)">
                                        {s.v}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social links */}
                        <div className="flex flex-wrap gap-2.5 items-center justify-center md:justify-start">
                            {socialLinks.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-3.5 py-2 border border-(--border-default) text-(--text-secondary) text-[13px] font-medium cursor-pointer rounded hover:bg-gray-50 transition-colors"
                                >
                                    {s.icon} {s.label}
                                </a>
                            ))}

                            {isAuthenticated && (
                                <button
                                    onClick={handleFollow}
                                    disabled={followingLoading}
                                    className={`mr px-3.5 py-2 border-0 text-[13px] font-semibold cursor-pointer rounded transition-all flex items-center gap-2 ${isFollowing
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-(--brand-primary) text-white hover:opacity-90'
                                        }`}
                                >
                                    {followingLoading ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                                    ) : isFollowing ? '✓ Following' : '+ Follow author'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <SectionLayout
                    sidebar={
                        <AuthorSidebar
                            stats={stats}
                            related={relatedEditors}
                            isAuthenticated={isAuthenticated}
                        />
                    }>
                    {/* Latest articles */}
                    <div>
                        <CategoryUnderline
                            name={author.name}
                            label={`${author.name} यांच्या ताज्या बातम्या`}
                            viewAll={false}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {articles.map((item, i) => (
                                <StandardCard
                                    key={item.id}
                                    layout="col"
                                    category={item.category?.name}
                                    headline={item.title}
                                    imageUrl={item.featuredImage}
                                    data={item}
                                />
                            ))}
                        </div>

                        {pagination.pages > 1 && (
                            <div className="mt-10">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.pages}
                                    onPageChange={(p) => setCurrentPage(p)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Desktop leaderboard */}
                    <Ad
                        id="DC3"
                        name="Desktop Author Between Modules"
                        size={screenWidth >= 992 ? "728×90" : "Responsive"}
                        width={screenWidth >= 992 ? 728 : undefined}
                        height={screenWidth >= 992 ? 90 : 90}
                        fluid={screenWidth < 992}
                        className="inline-block mx-auto max-w-full"
                    />

                    {/* Most read by author */}
                    {mostRead.length > 0 && (
                        <div className="bg-(--surface-secondary) p-6 rounded-lg">
                            <TrendingModule
                                label="सर्वाधिक वाचलेले"
                                items={mostRead}
                            />
                        </div>
                    )}

                    {/* E-E-A-T panel */}
                    <div className="p-6 border border-(--border-default) grid grid-cols-[auto_1fr] gap-5 items-start rounded-lg">
                        <div className="w-12 h-12 rounded-lg bg-(--brand-primary-light) flex items-center justify-center text-2xl shrink-0 text-(--brand-primary)">
                            ✓
                        </div>

                        <div>
                            <div className="mr text-base font-bold mb-1.5">
                                संपादकीय निष्ठा आणि विश्वासार्हता
                            </div>

                            <p className="mr m-0 mb-3 text-sm leading-[1.7] text-(--text-secondary)">
                                {author.name} प्रजावार्ताच्या संपादकीय धोरणांचे काटेकोर पालन करतात. त्यांचे सर्व लेख तथ्य पडताळणी प्रक्रियेतून जातात आणि संपादकीय मंडळाच्या मान्यतेनंतरच प्रकाशित होतात.
                            </p>

                            <div className="flex flex-wrap gap-3.5 text-[13px] font-semibold text-(--brand-primary)">
                                <span className="cursor-pointer hover:underline">संपादकीय धोरण →</span>
                                <span className="cursor-pointer hover:underline">तथ्य पडताळणी प्रक्रिया →</span>
                                <span className="cursor-pointer hover:underline">दुरुस्ती धोरण →</span>
                            </div>
                        </div>
                    </div>
                </SectionLayout>
            </div>
        </MainLayout>
    )
}

export default memo(Author)