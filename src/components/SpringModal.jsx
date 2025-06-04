import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

const ExampleWrapper = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="mt-4 grid place-content-center">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
            >
                No Steam URL? Click here!
            </button>
            <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
};

const SpringModal = ({ isOpen, setIsOpen }) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const steamUrl = "https://steamcommunity.com/profiles/76561198357014255/";

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(steamUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = steamUrl;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.body.removeChild(textArea);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-[var(--background)] to-[var(--background-light)] text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >
                        <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                        <div className="relative z-10">
                            <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                                <FiAlertCircle />
                            </div>
                            <h3 className="text-3xl font-bold text-center mb-2">
                                No Steam URL but want to try?
                            </h3>
                            <p className="text-center mb-6">
                                Try out my Steam profile to see how the app works! You can always
                                enter your own Steam profile URL later.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={handleCopyToClipboard}
                                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                >
                                    {copySuccess ? "Copied!" : "Copy Steam URL!"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExampleWrapper;