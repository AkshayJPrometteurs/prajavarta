"use client"

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useReduxAuth } from '@/hooks/useReduxAuth'
import { useSelector } from 'react-redux'
import { Bell, LogOut, User, Settings } from 'lucide-react'

export default function AdminHeader() {
    const { logout } = useReduxAuth()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = async () => {
        await logout()
        window.location.href = '/admin/login'
    }

    const getInitials = (name) => {
        if (!name) return 'A'
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
    }

    const notifications = [
        { id: 1, message: 'New user registered', time: '5 minutes ago' },
        { id: 2, message: 'New comment on article', time: '1 hour ago' },
        { id: 3, message: 'System update completed', time: '2 hours ago' }
    ]

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Left - Logo */}
                <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-slate-900">Prajavarta</div>
                </div>

                {/* Right - Notifications & User Menu */}
                <div className="flex items-center gap-4">
                    {/* Notifications Dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                            <Bell size={20} />
                            <span className="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-600"></span>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-slate-200">
                                <div className="p-0">
                                    <div className="border-b border-slate-200 px-4 py-3">
                                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <Menu.Item key={notification.id}>
                                                    {({ active }) => (
                                                        <button
                                                            className={`w-full border-b border-slate-100 px-4 py-3 text-left transition-colors ${active ? 'bg-slate-50' : ''
                                                                } hover:bg-slate-50`}
                                                        >
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {notification.message}
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">{notification.time}</p>
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-slate-200 px-4 py-2">
                                        <button className="w-full py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>

                    {/* User Dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-2 rounded-full hover:bg-slate-100 px-2 py-1 transition-colors">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                                {getInitials(user?.name)}
                            </div>
                            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                                {user?.name || 'Admin'}
                            </span>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-slate-200">
                                <div className="p-0">
                                    {/* User Info */}
                                    <div className="border-b border-slate-200 px-4 py-3">
                                        <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</p>
                                        <p className="text-xs text-slate-500">{user?.email || 'admin@example.com'}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => { }}
                                                className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm transition-colors ${active ? 'bg-slate-50' : ''
                                                    } hover:bg-slate-50`}
                                            >
                                                <User size={16} className="text-slate-600" />
                                                <span className="text-slate-700">Profile</span>
                                            </button>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => { }}
                                                className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm transition-colors ${active ? 'bg-slate-50' : ''
                                                    } hover:bg-slate-50`}
                                            >
                                                <Settings size={16} className="text-slate-600" />
                                                <span className="text-slate-700">Settings</span>
                                            </button>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors ${active ? 'bg-red-50' : ''
                                                    } hover:bg-red-50`}
                                            >
                                                <LogOut size={16} className="text-red-600" />
                                                <span className="text-red-600 font-medium">Logout</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    )
}
