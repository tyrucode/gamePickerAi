import { motion } from "framer-motion";

const Example = () => {
    return (
        <div className="grid place-content-center bg-grey-600 px-4 py-24">
            <BarLoader />
        </div>
    );
};

const variants = {
    initial: {
        scaleY: 0.5,
        opacity: 0,
    },
    animate: {
        scaleY: 1,
        opacity: 1,
        transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1,
            ease: "circIn",
        },
    },
};

const BarLoader = () => {
    return (
        <motion.div
            transition={{
                scaleY: 0.3,
                staggerChildren: 0.25,
            }}
            initial="initial"
            animate="animate"
            className="flex gap-2 scale-125"
        >
            <motion.div variants={variants} className="h-12 w-2 bg-white" />
            <motion.div variants={variants} className="h-12 w-2 bg-white" />
            <motion.div variants={variants} className="h-12 w-2 bg-white" />
            <motion.div variants={variants} className="h-12 w-2 bg-white" />
            <motion.div variants={variants} className="h-12 w-2 bg-white" />
        </motion.div >
    );
};

export default Example;