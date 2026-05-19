"use client"
import { memo, useEffect, useRef, useState } from "react"
import MainLayout from "@/layout/MainLayout"
import Link from "next/link"
import CategoryChip from "@/components/ui/CategoryChip"
import Ad from "@/components/Ad"
import { useScreenSize } from "@/hooks/useScreenSize"
import { WhatsAppIcon, FacebookIcon, XIcon, LinkIcon } from "@/components/ui/Icons"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import StandardCard from "@/components/cards/StandardCard"
import ArticleSidebar from "./Sidebars/ArticleSidebar"
import { useParams } from "next/navigation"
import SectionLayout from "@/layout/SectionLayout"
import { toast } from 'react-toastify'
import axiosInstance from "@/lib/axios"
import { timeAgo } from "@/lib/helper"
import CustomImage from "@/components/ui/CustomImage"
import { useReduxAuth } from "@/hooks/useReduxAuth"

const SHARE_BUTTONS = [
    { icon: <WhatsAppIcon size={14} />, color: '#25D366', label: 'WhatsApp' },
    { icon: <FacebookIcon size={14} />, color: '#1877F2', label: 'Facebook' },
    { icon: <XIcon size={14} />, color: '#000', label: 'X' },
    { icon: <LinkIcon size={14} />, color: '#6B6B6B', label: 'Copy' },
]

const Articles = () => {
    const { screenWidth } = useScreenSize();
    const [footerOffset, setFooterOffset] = useState(0);
    const anchorRef = useRef(null);
    const { slug = [] } = useParams();
    const { isAuthenticated } = useReduxAuth();

    // The last part of the slug is usually the article slug
    const articleSlug = slug[slug.length - 1];

    const [categories, setCategories] = useState([]);
    const [article, setArticle] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [trendingNews, setTrendingNews] = useState([]);
    const [mostReadNews, setMostReadNews] = useState([]);
    const [saved, setSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArticle = async () => {
        if (!articleSlug) return;
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/news/${articleSlug}`);
            if (response.data.success) {
                setCategories(response.data.data.categoryList || []);
                setArticle(response.data.data.article);
                setRelatedNews(response.data.data.relatedNews);
                setTrendingNews(response.data.data.trendingNews);
                setMostReadNews(response.data.data.mostReadNews || []);
                setSaved(response.data.data.saved ?? false);
            }
        } catch (err) {
            console.error("Error fetching article:", err);
            setError("बातमी लोड करण्यात अडचण आली आहे.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
        window.scrollTo(0, 0);
    }, [articleSlug]);

    const handleSaveClick = async () => {
        if (!article) return;
        setSaveLoading(true);

        try {
            const response = await axiosInstance.post('/news/save', {
                newsId: article.id
            });

            if (response.data.success) {
                setSaved(response.data.saved);

                const message =
                    response.data.message ||
                    (response.data.saved
                        ? 'Article saved successfully.'
                        : 'Article removed from saved items.');

                toast.success(message);
            } else {
                const errorMessage =
                    response.data.error ||
                    'बातमी जतन केली जाऊ शकली नाही. कृपया पुन्हा प्रयत्न करा.';

                toast.error(errorMessage);
            }
        } catch (err) {
            console.error('Error saving article:', err);

            const serverMessage =
                err.response?.data?.error ||
                'बातमी जतन करण्यात अडचण आली. कृपया लॉगिन करा.';

            toast.error(serverMessage);
        } finally {
            setSaveLoading(false);
        }
    };

    useEffect(() => {
        if (screenWidth > 768) return;
        const footer = document.querySelector('footer');
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const overlap = Math.max(0, window.innerHeight - entry.boundingClientRect.top);
                setFooterOffset(overlap > 0 ? overlap + 8 : 0);
            },
            { threshold: [0, 0.01, 1] }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, [screenWidth]);

    if (loading) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="flex items-center justify-center py-20 min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            </MainLayout>
        );
    }

    if (error || !article) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="text-center py-20 min-h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "बातमी सापडली नाही."}</h2>
                    <Link href="/" className="text-orange-600 font-semibold hover:underline">
                        मुख्यपृष्ठावर परत जा
                    </Link>
                </div>
            </MainLayout>
        );
    }

    const tags = article.tags ? article.tags.split(',').map(t => t.trim()) : [];
    const categorySlug = article.category?.slug || article.category?.nameEnglish?.toLowerCase();

    return (
        <MainLayout isBannerAdvertisement>
            <section>
                {/* Breadcrumb */}
                <div className="mr flex items-center flex-wrap gap-y-1" style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>
                    <Link href="/" className="hover:text-(--brand-primary) transition-colors">मुख्यपृष्ठ</Link>

                    {article.category && (
                        <>
                            <span style={{ margin: '0 8px' }} className="opacity-50">›</span>
                            <Link
                                href={`/category/${article.category.slug || article.category.nameEnglish?.toLowerCase()}`}
                                className="hover:text-(--brand-primary) transition-colors"
                            >
                                {article.category.name}
                            </Link>
                        </>
                    )}

                    <span style={{ margin: '0 8px' }} className="opacity-50">›</span>
                    <span className="text-(--text-primary) font-medium truncate max-w-50 md:max-w-md">
                        {article.title}
                    </span>
                </div>

                <SectionLayout
                    sidebar={
                        <ArticleSidebar
                            trending={trendingNews}
                            mostRead={mostReadNews}
                        />
                    }
                >
                    {categories.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categories.map((category) => (
                                <CategoryChip
                                    key={category.id}
                                    name={category.name}
                                    url={`/category/${category.nameEnglish?.toLowerCase()}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <CategoryChip name={article.category?.name || "बातमी"} />
                    )}

                    <div>
                        <h1 className="mr my-3 leading-tight font-extrabold tracking-[-0.01em] text-(--text-primary) text-[clamp(26px,4vw,38px)]">
                            {article.title}
                        </h1>

                        {article.summary && (
                            <div dangerouslySetInnerHTML={{ __html: article.summary }} />
                        )}

                        {/* Author byline */}
                        <div className="flex items-center gap-3 py-3 border-t border-b border-(--border-default) my-4">
                            <div className="w-12 h-12 rounded-full bg-(--brand-primary-light) flex items-center justify-center font-bold text-(--brand-primary) text-base shrink-0 overflow-hidden">
                                {article.author?.image ? (
                                    <CustomImage
                                        src={article.author.image}
                                        alt={article.author.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                        style={{ height : 48 }}
                                    />
                                ) : (
                                    article.author?.name ? article.author.name.substring(0, 2).toUpperCase() : "PA"
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="mr text-sm font-semibold">
                                    <Link href={`/author-details/${article.author?.nameEnglish || article.author?.name}`}>
                                        {article.author?.name || "प्रजावार्ता प्रतिनिधी"}
                                    </Link>
                                    {article.author?.role && (
                                        <span className="text-(--text-tertiary) font-normal">
                                            {" "}· {article.author.role}
                                        </span>
                                    )}
                                </div>

                                <div className="mr text-[11px] text-(--text-tertiary) mt-0.5">
                                    प्रकाशित: {new Date(article.publishedDate || article.createdAt).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {timeAgo(article.publishedDate || article.createdAt)}
                                </div>
                            </div>
                            {isAuthenticated && (
                                <button
                                    onClick={handleSaveClick}
                                    disabled={saveLoading}
                                    className={`px-3.5 py-2 text-xs font-semibold rounded cursor-pointer ${saved ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border border-(--border-strong) text-(--text-primary)'}`}
                                >
                                    {saveLoading ? 'Saving...' : saved ? 'Saved' : 'Save'}
                                </button>
                            )}

                        </div>

                        {screenWidth < 768 && (
                            <div className="mt-4">
                                <div className="flex gap-2">
                                    {SHARE_BUTTONS.map((b, i) => (
                                        <button
                                            key={i}
                                            className="flex-1 flex items-center justify-center gap-1.25 px-1.5 py-2.25 bg-white border text-[10px] font-semibold rounded cursor-pointer"
                                            style={{ borderColor: b.color, color: b.color }}
                                        >
                                            {b.icon}
                                            <span>{b.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <CustomImage
                            src={article.featuredImage}
                            alt={article.title}
                            width={1200}
                            height={675}
                            className="w-full h-auto rounded"
                            console={true}
                        />
                        {article.imageCaption && (
                            <p className="mr mt-2 text-xs leading-normal text-(--text-tertiary)">
                                {article.imageCaption}
                            </p>
                        )}
                    </div>

                    {screenWidth < 768 && (
                        <Ad id="A1" name="Mobile Article Below Hero Image" size="300×250" height={250} fluid />
                    )}

                    {/* Article body */}
                    <div className="max-w-170">
                        <div
                            className="mr article-content text-(--text-primary) leading-[1.8]"
                            dangerouslySetInnerHTML={{ __html: article.description }}
                        />

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="my-8 mb-6 flex gap-2 flex-wrap">
                                {tags.map((t) => (
                                    <Link
                                        key={t}
                                        href={categorySlug ? `/tag/${categorySlug}/${t}` : `/tag/${t}`}
                                        className="mr px-3.5 py-1.5 border border-(--border-default) rounded-full text-[13px] text-(--text-secondary) cursor-pointer"
                                    >
                                        #{t}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Author bio */}
                        {article.author && (
                            <div className="p-6 bg-(--surface-secondary) flex gap-5 mb-8 rounded-lg my-4">
                                <div className="w-18 h-18 rounded-full bg-(--brand-primary-light) flex items-center justify-center font-bold text-(--brand-primary) text-[22px] shrink-0 overflow-hidden">
                                    {article.author.image ? (
                                        <img src={article.author.image} alt={article.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        article.author.name.substring(0, 2).toUpperCase()
                                    )}
                                </div>

                                <div>
                                    <div className="mr text-[17px] font-bold">{article.author.name}</div>
                                    <div className="mr text-[13px] text-(--text-tertiary) mb-2">
                                        {article.author.role} {article.author.experience && `· ${article.author.experience}`}
                                    </div>

                                    {article.author.bio && (
                                        <p className="mr mb-3 text-sm leading-[1.7] text-(--text-secondary)">
                                            {article.author.bio}
                                        </p>
                                    )}

                                    <div className="flex gap-3.5 text-[13px] text-(--brand-primary) font-semibold">
                                        {article.author.twitter && <a href={article.author.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                                        {article.author.linkedin && <a href={article.author.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                                        {article.author.email && <a href={`mailto:${article.author.email}`}>Email</a>}
                                        <Link href={`/author-details/${article.author.nameEnglish || article.author.name}`}>All articles →</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Ad
                        id={screenWidth <= 768 ? "A4" : "DA5"}
                        name={screenWidth <= 768 ? "Mobile Article Before Related" : "Desktop Article Before Recommendations"}
                        size={screenWidth <= 768 ? "Multiplex / Native" : "Responsive Native"}
                        height={screenWidth <= 768 ? 320 : 140}
                        fluid
                        className="my-4 md:my-6"
                    />

                    {/* Related stories */}
                    {relatedNews.length > 0 && (
                        <div>
                            <CategoryUnderline
                                name={article.category?.name || "News"}
                                label="संबंधित बातम्या"
                                url={`/related-news/${article.slug}`}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedNews.map((s, i) => (
                                    <StandardCard
                                        key={i}
                                        data={s}
                                        headline={s.title}
                                        layout="col"
                                        imageUrl={s.featuredImage}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </SectionLayout>

                {screenWidth <= 768 && (
                    <div
                        ref={anchorRef}
                        className={`${footerOffset ? '' : 'fixed'} inset-x-0 p-4 bg-white border-t border-(--border-default) shadow-[0_-2px_12px_rgba(0,0,0,0.1)] z-40 transition-all duration-150`}
                        style={{ bottom: footerOffset ? `${footerOffset}px` : '0px' }}
                    >
                        <Ad id="A5" name="Mobile Article Bottom Anchor" size="320×50" width={320} height={50} sticky className="mx-auto" />
                    </div>
                )}
            </section>
        </MainLayout>
    )
}

export default memo(Articles)