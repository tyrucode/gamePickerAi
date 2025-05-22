
function Home() {
    return (
        <div className="flex justify-center items-center min-h[60vh]">
            <img src="myImage" alt="steams logo" />
            <form className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4">
                    Enter Steam page URL here!
                </h2>
                <input
                    type="text"
                    id="myTextBox"
                    name="myTextBox"
                    placeholder="https://steamcommunity.com/profiles/..."
                    className="w-96 px-6 py-4 text-lg rounded-2xl border-2 border-[var(--ui-element-colors)] focus:outline-none focus:border-blue-400 transition-colors"

                />
                <button
                    type="submit"
                    className="px-8 py-3 text-lg font-medium rounded-xl  hover:opacity-80 transition-opacity"
                >
                    Submit
                </button>
            </form>

        </div>
    )
}

export default Home