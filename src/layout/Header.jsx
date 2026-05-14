"use client";

import { Button, Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import Logo from "@/components/Logo";
import { HamburgerIcon, SearchIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useReduxAuth } from "@/hooks/useReduxAuth";
import axiosInstance from "@/lib/axios";

const MEGA_NEWS = [
    { c: 'महाराष्ट्र', h: 'राज्यात कांद्याच्या भावात मोठी घसरण, शेतकऱ्यांचे आंदोलन', color: '#c0392b' },
    { c: 'राजकारण', h: 'विधानसभेत सत्तासंघर्ष: हालचालींना वेग', color: '#8B0000' },
    { c: 'क्रीडा', h: 'रोहित शर्मा कसोटी संघातून निवृत्त', color: '#1565C0' },
    { c: 'व्यवसाय', h: 'सेन्सेक्सने ८०,००० चा ऐतिहासिक टप्पा ओलांडला', color: '#1B5E20' },
    { c: 'पुणे', h: 'पुण्यात मेट्रोच्या तिसऱ्या टप्प्याचे काम सुरू', color: '#E65100' },
    { c: 'मनोरंजन', h: 'रितेश देशमुखचा नवा चित्रपट दिवाळीला प्रदर्शित', color: '#6A1B9A' },
];

const COMPANY_LINKS = [
    { label: 'आमच्याबद्दल', href: `${process.env.NEXT_PUBLIC_APP_URL}company/about-us` },
    { label: 'आमचे लेखक', href: `${process.env.NEXT_PUBLIC_APP_URL}author/सुनील देशमुख` },
    { label: 'संपर्क करा', href: `${process.env.NEXT_PUBLIC_APP_URL}company/contact-us` },
    { label: '—', href: '#', divider: true },
    { label: 'संपादकीय धोरण', href: `${process.env.NEXT_PUBLIC_APP_URL}company/editorial-policy` },
    { label: 'गोपनीयता धोरण', href: `${process.env.NEXT_PUBLIC_APP_URL}company/privacy-policy` },
    { label: 'अटी व शर्ती', href: `${process.env.NEXT_PUBLIC_APP_URL}company/terms-and-conditions` },
    { label: 'कुकी धोरण', href: `${process.env.NEXT_PUBLIC_APP_URL}company/cookie-policy` },
    { label: '—', href: '#', divider: true },
    { label: 'जाहिरात द्या', href: `${process.env.NEXT_PUBLIC_APP_URL}company/advertise` },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [navItems, setNavItems] = useState([]);
    const { user, logout } = useReduxAuth();

    const toggleMenu = () => setIsMenuOpen((v) => !v);
    const toggleSearch = () => setIsSearchOpen((v) => !v);

    const getNavItems = useCallback(async () => {
        try {
            const { data: { data } } = await axiosInstance.get('/categories')
            const formattedCategories = data.map((cat) => {
                const link = cat.slug === "home-page" ? "/" : `/category/${cat.slug}`
                return { name: cat.name, link: link }
            })
            setNavItems(formattedCategories)
        } catch (error) {
            console.error('Error fetching categories for header:', error)
        }
    }, [])

    useEffect(() => { getNavItems() }, [getNavItems])

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
                        <Popover className="relative">
                            <PopoverButton className="flex items-center justify-center w-9 h-9 bg-(--brand-accent) text-[#1a1a1a] rounded-full font-bold text-[13px] cursor-pointer hover:opacity-90 transition">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </PopoverButton>

                            <Transition
                                enter="transition duration-150 ease-out"
                                enterFrom="opacity-0 -translate-y-1.5"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition duration-100 ease-in"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 -translate-y-1.5"
                            >
                                <PopoverPanel className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white text-[#1a1a1a] shadow-lg z-200 rounded-lg py-2 focus:outline-none">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <Button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 transition hover:bg-red-600 cursor-pointer hover:text-white"
                                    >
                                        Sign out
                                    </Button>
                                </PopoverPanel>
                            </Transition>
                        </Popover>
                    ) : (
                        <Link href="/login">
                            <button className="bg-(--brand-accent) text-[#1a1a1a] px-3.5 py-2 rounded font-bold text-[13px] cursor-pointer">
                                Sign in
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Search bar (shared for mobile & desktop) */}
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
                            <Link
                                key={item.name}
                                href={item.link || '#'}
                                className="block mr text-sm font-semibold text-(--text-primary)"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="pt-3 border-t border-(--border-default)">
                            <div className="mr text-[11px] font-bold uppercase text-(--text-tertiary) mb-2">Company</div>
                            <div className="space-y-2">
                                {COMPANY_LINKS.filter((l) => !l.divider).map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        className="block mr text-sm text-(--text-secondary)"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
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
                            <Link
                                key={item.name}
                                href={item.link || '#'}
                                className="text-white whitespace-nowrap opacity-90 hover:opacity-100 transition font-semibold"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* All News mega dropdown */}
                        <Popover className="relative flex items-center">
                            <PopoverButton className="flex items-center gap-1 cursor-pointer text-sm opacity-90 hover:opacity-100 focus:outline-none font-semibold">
                                सर्व बातम्या
                                <span className="text-[9px] opacity-70 mt-px">▾</span>
                            </PopoverButton>

                            <Transition
                                enter="transition duration-150 ease-out"
                                enterFrom="opacity-0 -translate-y-1.5"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition duration-100 ease-in"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 -translate-y-1.5"
                            >
                                <PopoverPanel className="absolute top-[calc(100%+12px)] -left-24 w-125 bg-white text-[#1a1a1a] shadow-lg z-200 border-t-[3px] border-(--brand-primary) rounded-b pb-0.5 focus:outline-none">
                                    <div className="grid grid-cols-2 gap-2.5 mb-3.5 p-4 pb-0">
                                        {MEGA_NEWS.map((item, i) => (
                                            <Link key={i} href="/all-news" className="flex gap-2.5 items-start">
                                                <div className="w-16 h-12 shrink-0 rounded bg-gray-200" />
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase mb-1" style={{ color: item.color }}>
                                                        {item.c}
                                                    </div>
                                                    <p className="text-xs font-semibold leading-[1.4] line-clamp-2">
                                                        {item.h}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <Link
                                        href="/all-news"
                                        className="block text-center py-2.5 px-4 border-t text-[13px] font-bold text-(--brand-primary) hover:bg-orange-50"
                                    >
                                        सर्व बातम्या पहा →
                                    </Link>
                                </PopoverPanel>
                            </Transition>
                        </Popover>

                        {/* Company popover */}
                        <Popover className="relative flex items-center">
                            <PopoverButton className="flex items-center gap-1 cursor-pointer text-sm font-semibold opacity-90 hover:opacity-100 focus:outline-none">
                                Company
                                <span className="text-[9px] opacity-70 mt-px">▾</span>
                            </PopoverButton>

                            <Transition
                                enter="transition duration-150 ease-out"
                                enterFrom="opacity-0 -translate-y-1.5"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition duration-100 ease-in"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 -translate-y-1.5"
                            >
                                <PopoverPanel className="absolute top-[calc(100%+12px)] left-0 w-57.5 bg-white text-[#1a1a1a] shadow-lg z-200 border-t-[3px] border-(--brand-primary) rounded-b py-1.5 focus:outline-none">
                                    {COMPANY_LINKS.map((l, i) =>
                                        l.divider ? (
                                            <div key={i} className="h-px bg-gray-200 my-1.5" />
                                        ) : (
                                            <Link
                                                key={l.href}
                                                href={l.href}
                                                className="block px-4 py-2 text-[13px] font-medium whitespace-nowrap text-gray-800 hover:bg-orange-50 hover:text-(--brand-primary)"
                                            >
                                                {l.label}
                                            </Link>
                                        )
                                    )}
                                </PopoverPanel>
                            </Transition>
                        </Popover>
                    </nav>

                    <div className="flex items-center gap-4 text-[13px] whitespace-nowrap">
                        <button className="text-white flex items-center justify-center cursor-pointer" onClick={toggleSearch}>
                            <SearchIcon size={18} />
                        </button>

                        {user ? (
                            <Popover className="relative">
                                <PopoverButton className="flex items-center justify-center w-9 h-9 bg-(--brand-accent) text-[#1a1a1a] rounded-full font-bold text-[13px] cursor-pointer hover:opacity-90 transition">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </PopoverButton>

                                <Transition
                                    enter="transition duration-150 ease-out"
                                    enterFrom="opacity-0 -translate-y-1.5"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition duration-100 ease-in"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 -translate-y-1.5"
                                >
                                    <PopoverPanel className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white text-[#1a1a1a] shadow-lg z-200 rounded-lg py-2 focus:outline-none">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <Button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 transition hover:bg-red-600 cursor-pointer hover:text-white"
                                        >
                                            Sign out
                                        </Button>
                                    </PopoverPanel>
                                </Transition>
                            </Popover>
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