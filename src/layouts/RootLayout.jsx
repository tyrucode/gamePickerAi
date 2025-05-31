// imports
import { Outlet } from "react-router"
import { NavLink } from "react-router"

function RootLayout() {
    return (
        <div className="min-h-screen">
            <header className="bg-gradient-to-r from-[var(--background-light)] to-[var(--background)] text-[var(--text-color)] shadow-lg border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className=" hover:scale-105 transition-all duration-200 ease-in-out text-4xl md:text-5xl font-bold tracking-wide text-center bg-white bg-clip-text text-transparent">
                        <NavLink to="/" >Steam Game Finder</NavLink>
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
                <p>Not affiliated with Valve Corporation or Steam | <a className="underline" href="https://github.com/tyrucode" target="_blank" >GitHub</a> <a className="underline" href="https://www.linkedin.com/in/tyler-ruiz-84a287305/" target="_blank">LinkedIn</a></p>
            </footer>
        </div>
    )
}

export default RootLayout