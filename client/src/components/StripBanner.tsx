"use client";
import { motion } from "framer-motion";
import Parallax from "@/animation/Parallax";
import RevealText from "@/utils/RevealText";

export default function StripBanner() {
    const wordVars = {
        initial: { opacity: 0, filter: "blur(10px)", y: 15 },
        animate: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.8 } },
    };

    const imgFrontLoadVars = {
        initial: { opacity: 0, x: 253 },
        animate: { opacity: 1, x: 0, transition: { delay: 1, duration: 1.5, ease: [0.33, 1, 0.68, 1] } },
    };

    const iconLoadVars = (delay: number) => ({
        initial: { opacity: 0, filter: "blur(15px)", scale: 0.7 },
        animate: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { delay, duration: 1 } },
    });



    return (
        <section className="hero-banner-section relative">
            <div className="relative  lg:h-[calc(100dvh-96px)] h-[calc(100dvh)] w-full overflow-hidden max-lg:mt-5">
                <div className="container h-full">
                    <div className="h-full w-full flex justify-center items-start lg:items-center ">
                        <div className="w-full relative z-10">
                            <div className="flex max-lg:flex-col gap-30 items-center">

                                <div className="lg:w-5/12 w-full">
                                    <div className="head-wrapper">
                                        <Parallax className="max-lg:transform-none!" distance={200}>
                                            <motion.h1
                                                variants={wordVars}
                                                initial="initial"
                                                animate="animate"
                                                transition={{ duration: 1.1 }}
                                                className='relative font-bold font-playfair'>
                                                Mushroom focus Strips
                                            </motion.h1>
                                            <RevealText tag="p" className="mt-5 font-playfair! leading-5! text-base! sm:text-lg! md:text-xl! lg:text-2xl! lg:leading-7!">
                                                Enhance focus and everyday wellness with chocolate-flavored Mushroom Focus Strips powered by functional mushrooms.
                                            </RevealText>
                                        </Parallax>
                                    </div>
                                </div>

                                <div className="lg:w-7/12 w-full relative flex justify-center items-center">
                                    {/* <div className="absolute inset-0 pointer-events-none">
                                        <motion.div variants={iconLoadVars(1.2)} initial="initial" animate="animate" className="absolute -top-16 left-[15%] max-[575px]:-top-13 max-[575px]:left-0 xl:w-24 xl:h-24 w-20 h-20 max-[575px]:w-18 max-[575px]:h-18"><Image src="/hero-1.png" alt="icon" width={100} height={100} /></motion.div>
                                        <motion.div variants={iconLoadVars(1.4)} initial="initial" animate="animate" className="absolute -top-16 right-[15%] max-[575px]:-top-13 max-[575px]:right-0 xl:w-24 xl:h-24 w-20 h-20 max-[575px]:w-18 max-[575px]:h-18"><Image src="/hero-2.png" alt="icon" width={100} height={100} /></motion.div>
                                        <motion.div variants={iconLoadVars(1.6)} initial="initial" animate="animate" className="absolute -bottom-16 left-[15%] max-[575px]:-bottom-13 max-[575px]:left-0 xl:w-24 xl:h-24 w-20 h-20 max-[575px]:w-18 max-[575px]:h-18"><Image src="/hero-3.png" alt="icon" width={100} height={100} /></motion.div>
                                        <motion.div variants={iconLoadVars(1.8)} initial="initial" animate="animate" className="absolute -bottom-16 right-[15%] max-[575px]:-bottom-13 max-[575px]:right-0 xl:w-24 xl:h-24 w-20 h-20 max-[575px]:w-18 max-[575px]:h-18"><Image src="/hero-4.png" alt="icon" width={100} height={100} /></motion.div>
                                    </div> */}
                                    <div className="relative z-50">
                                        <div className="relative w-[300px] h-[300px] max-[575px]:w-[270px] xl:w-[450px] xl:h-[450px]">
                                            <div className="img-bg">
                                                <img
                                                    src="/product-empty-new.webp"
                                                    alt="Box"
                                                    width={450}
                                                    height={450}
                                                    className="drop-shadow-2xl"
                                                />
                                            </div>
                                            {/* The "Filling" effect is kept here via imgFrontLoadVars */}
                                            <motion.div
                                                variants={imgFrontLoadVars as any}
                                                initial="initial"
                                                animate="animate"
                                                className="img-front absolute top-0 left-0"
                                            >
                                                <img src="/product-fill-new.webp" alt="Label" width={450} height={450} />
                                            </motion.div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}