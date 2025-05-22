// imports
import { Outlet } from "react-router"

function RootLayout() {
    return (
        <div>
            <header className="bg-[var(--ui-element-colors)] text-[var(--text-color)] shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4  items-center ">
                    <h1 className="text-5xl font-bold tracking-wide text-center">Game Finder (functionality first)</h1>
                    <nav className="space-x-4">
                    </nav>
                </div>
            </header>
            <main className="mt-16 px-4 ">
                <Outlet />
            </main>
            <footer>

            </footer>
        </div>
    )
}

export default RootLayout