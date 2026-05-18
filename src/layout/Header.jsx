"use client";

import { memo, useState, useEffect } from "react";
import Link from "next/link";

import Logo from "@/components/Logo";
import { HamburgerIcon, SearchIcon } from "@/components/ui/Icons";
import { useReduxAuth } from "@/hooks/useReduxAuth";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { COMPANY_LINKS } from "@/contants/HeaderContants";
import CustomImage from "@/components/ui/CustomImage";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [megaNews, setMegaNews] = useState([]);
    const [loadingMega, setLoadingMega] = useState(true);
    const { user, logout } = useReduxAuth();
    const { categories } = useAuth();
    const navItems = categories;

    useEffect(() => {
        const fetchMegaNews = async () => {
            try {
                const response = await axiosInstance.get('/news/mega');
                if (response.data.success) {
                    setMegaNews(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching mega news:", error);
            } finally {
                setLoadingMega(false);
            }
        };

        fetchMegaNews();
    }, []);

    const toggleMenu = () => setIsMenuOpen((v) => !v);
    const toggleSearch = () => setIsSearchOpen((v) => !v);

    return (
        <>
            {/* Mobile header */}
            <header className="h-14 bg-(--brand-primary) text-white flex items-center justify-between px-4 sticky top-0 z-100 lg:hidden">
                <div className="flex items-center gap-3">
                    <button className="text-white flex items-center justify-center cursor-pointer" aria-label="Menu" onClick={toggleMenu}>
                        <HamburgerIcon size={20} />
                    </button>
                    <Logo inverted />
                </div>

                <div className="flex items-center gap-3.5">
                    <button className="text-white flex items-center justify-center cursor-pointer" aria-label="Search" onClick={toggleSearch}>
                        <SearchIcon size={20} />
                    </button>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="flex items-center justify-center w-9 h-9 bg-(--brand-accent) text-[#1a1a1a] rounded-full font-bold text-[13px] cursor-pointer hover:opacity-90 transition">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu z-200 w-56 bg-base-100 text-base-content rounded-lg shadow-lg py-2 mt-2">
                                <li className="px-4 py-2 border-b border-base-200">
                                    <p className="text-sm font-semibold pointer-events-none">{user.name}</p>
                                    <p className="text-xs text-base-content/60 pointer-events-none">{user.email}</p>
                                </li>
                                <li>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm transition hover:bg-error hover:text-white">
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className="bg-(--brand-accent) text-[#1a1a1a] px-3.5 py-2 rounded font-bold text-[13px] cursor-pointer">
                                Sign in
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Search bar */}
            {isSearchOpen && (
                <div className="absolute w-full top-14 z-90 bg-white border-b border-(--border-default) px-4 py-3 shadow-sm flex justify-center">
                    <input
                        type="search"
                        placeholder="शोधा..."
                        className="w-full px-3 py-2 rounded border border-(--border-default) text-sm text-(--text-primary) focus:outline-none max-w-7xl mx-auto"
                        autoFocus
                    />
                </div>
            )}

            {/* Mobile side drawer */}
            <div
                className={`lg:hidden fixed inset-0 z-120 transition duration-200 ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            >
                <div className={`absolute inset-0 bg-black/40 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
                <nav
                    className={`absolute left-0 z-130 top-0 h-full w-72 max-w-[80vw] bg-white text-(--text-primary) shadow-xl transition-transform duration-200 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-default)">
                        <Logo />
                        <button className="text-(--text-secondary) text-sm" onClick={() => setIsMenuOpen(false)}>
                            बंद
                        </button>
                    </div>

                    <div className="p-4 space-y-3">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.link || '#'} className="block mr text-sm font-semibold text-(--text-primary)" onClick={() => setIsMenuOpen(false)}>
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-(--border-default)">
                            <div className="mr text-[11px] font-bold uppercase text-(--text-tertiary) mb-2">Company</div>
                            <div className="space-y-2">
                                {COMPANY_LINKS.filter((l) => !l.divider).map((l) => (
                                    <Link key={l.href} href={l.href} className="block mr text-sm text-(--text-secondary)" onClick={() => setIsMenuOpen(false)}>
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Desktop header */}
            <header className="hidden lg:block bg-(--brand-primary) text-white sticky top-0 z-100">
                <div className="h-14 flex items-center px-8 md:max-w-7xl mx-auto gap-8">
                    <Link href="/">
                        <Logo big inverted />
                    </Link>

                    <nav className="mr flex gap-4 text-sm font-medium flex-1 overflow-visible">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.link || '#'} className="text-white whitespace-nowrap opacity-90 hover:opacity-100 transition font-semibold">
                                {item.name}
                            </Link>
                        ))}

                        {/* All News mega dropdown */}
                        <div className="dropdown dropdown-bottom h-full flex items-center">
                            <div tabIndex={0} role="button" className="flex items-center gap-1 cursor-pointer text-sm opacity-90 hover:opacity-100 focus:outline-none font-semibold">
                                सर्व बातम्या
                                <span className="text-[9px] opacity-70 mt-px">▾</span>
                            </div>
                            <div tabIndex={0} className="dropdown-content z-200 mt-1 w-125 bg-white text-[#1a1a1a] shadow-lg border-t-[3px] border-(--brand-primary) rounded-b pb-0.5 focus:outline-none">
                                <div className="grid grid-cols-2 gap-2.5 mb-3.5 p-4 pb-0">
                                    {!loadingMega && megaNews?.length > 0 ? (
                                        megaNews?.map((item, i) => {
                                            if(!item.news) return null; // skip if no news for the category
                                            return (
                                                <Link key={i} href={item.news ? `/article/${item.news.slug}` : `/category/${item?.category.slug}`} className="flex gap-2.5 items-start">
                                                    {item?.news?.featuredImage && (
                                                        <div className="w-16 h-12 shrink-0 rounded bg-gray-200 overflow-hidden">
                                                            <CustomImage
                                                                src={item.news.featuredImage}
                                                                alt={item.category.name}
                                                                className="w-full object-cover"
                                                                style={{ height: "100%" }}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase mb-1 text-orange-600">{item?.category?.name}</div>
                                                        <p className="text-xs font-semibold leading-[1.4] line-clamp-2">{item?.news?.title || 'No news'}</p>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    ) : (
                                        <div className="col-span-2 text-center py-4 text-gray-500">लोड होत आहे...</div>
                                    )}
                                </div>
                                <Link href="/all-news" className="block text-center py-2.5 px-4 border-t text-[13px] font-bold text-(--brand-primary) hover:bg-orange-50">
                                    सर्व बातम्या पहा →
                                </Link>
                            </div>
                        </div>

                        {/* Company dropdown */}
                        <div className="dropdown dropdown-bottom h-full flex items-center">
                            <div tabIndex={0} role="button" className="flex items-center gap-1 cursor-pointer text-sm font-semibold opacity-90 hover:opacity-100 focus:outline-none">
                                Company
                                <span className="text-[9px] opacity-70 mt-px">▾</span>
                            </div>
                            <div tabIndex={0} className="dropdown-content z-200 w-57 bg-white text-[#1a1a1a] shadow-lg border-t-[3px] border-(--brand-primary) rounded-b py-1.5 focus:outline-none">
                                {COMPANY_LINKS.map((l, i) =>
                                    l.divider ? (
                                        <div key={i} className="h-px bg-gray-200 my-1.5" />
                                    ) : (
                                        <Link key={l.href} href={l.href} className="block px-4 py-2 text-[13px] font-medium whitespace-nowrap text-gray-800 hover:bg-orange-50 hover:text-(--brand-primary)">
                                            {l.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </nav>

                    <div className="flex items-center gap-4 text-[13px] whitespace-nowrap">
                        <button className="text-white flex items-center justify-center cursor-pointer" onClick={toggleSearch}>
                            <SearchIcon size={18} />
                        </button>

                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="flex items-center justify-center w-9 h-9 bg-(--brand-accent) text-[#1a1a1a] rounded-full font-bold text-[13px] cursor-pointer hover:opacity-90 transition">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu z-200 w-56 bg-base-100 text-base-content rounded-lg shadow-lg py-2 mt-2">
                                    <li className="px-4 py-2 border-b border-base-200">
                                        <p className="text-sm font-semibold pointer-events-none">{user.name}</p>
                                        <p className="text-xs text-base-content/60 pointer-events-none">{user.email}</p>
                                    </li>
                                    <li>
                                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm transition hover:bg-error hover:text-white">
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className="bg-(--brand-accent) text-[#1a1a1a] px-3.5 py-2 rounded font-bold text-[13px] cursor-pointer">
                                    Sign in
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}

export default memo(Header);