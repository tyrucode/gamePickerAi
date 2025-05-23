// imports
import { Outlet } from "react-router"

function RootLayout() {
    return (
        <div className="min-h-screen">
            <header className="bg-gradient-to-r from-[var(--background-light)] to-[var(--background)] text-[var(--text-color)] shadow-lg border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-center bg-white bg-clip-text text-transparent">
                        Steam Game Finder
                    </h1>
                    <p className="text-center text-[var(--text-secondary)] mt-2 text-sm uppercase tracking-widest">
                        Powered by Steam API
                    </p>
                </div>
            </header>
            <main className="mt-8 px-4 pb-16">
                <Outlet />
            </main>
            <footer className="text-center text-[var(--text-secondary)] text-sm py-8 border-t border-[var(--border-color)] mt-16">
                <p>Not affiliated with Valve Corporation or Steam</p>
            </footer>
        </div>
    )
}

export default RootLayout