'use client'
import { SportType } from "@/types/sportType"
import Image from "next/image"
import Link from "next/link"

export default function Header({ game, availableGames }: { game: SportType, availableGames: SportType[] }) {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-md px-4 py-4 sm:px-10 sm:py-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div className="sm:border-r sm:pr-10 sm:mr-10 flex justify-center sm:justify-start w-full sm:w-auto md:min-w-auto">
                <div className="w-40 sm:w-60">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={400}
                            height={400}
                        />
                    </Link>
                </div>
            </div>
            <div className="w-screen flex flex-col font-light overflow-x-auto">
                <div className="overflow-x-auto w-full px-2">
                    <div className="flex justify-end gap-4 sm:gap-5 text-lg sm:text-2xl min-w-max">
                        {availableGames.map((g, gameKey) => (
                            <button
                                key={gameKey}
                                className={`${game === g ? '' : 'opacity-50'} hover:opacity-100 whitespace-nowrap bg-transparent border-none cursor-pointer`}
                                onClick={() => {
                                    const url = new URL(window.location.origin)
                                    url.searchParams.set('sport', g)
                                    window.location.href = url.toString()
                                }}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center sm:justify-end px-2">
                    <button
                        className={`hover:opacity-100 opacity-50 whitespace-nowrap bg-transparent border-none cursor-pointer`}
                        onClick={() => {
                            const url = new URL(window.location.origin)
                            window.location.href = url.toString() + "FAQpage"
                        }}
                    >
                        Faq
                    </button>
                </div>
            </div>
        </header>
    )
}