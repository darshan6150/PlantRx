import RevealText from '@/utils/RevealText';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import React, { useRef } from 'react'

function SupplementBanner() {
    const containerRef = useRef(null);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const mouseMoveX = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);
    const mouseMoveY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { clientX, clientY } = e;
        const xPct = (clientX / window.innerWidth) - 0.5;
        const yPct = (clientY / window.innerHeight) - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yLid = useTransform(scrollYProgress, [0.1, 0.4, 0.8], [-174, -200, -300]);
    const xLid = useTransform(scrollYProgress, [0.1, 0.3, 0.8], ["0%", "5%", "75%"]);
    const rotateZ = useTransform(scrollYProgress, [0.1, 0.8], [-360, -663.44]);
    const rotateX = useTransform(scrollYProgress, [0.1, 0.8], [0, 40]);

    const supplements = [
        { x: "-40vw", y: "-35vh", scale: 0.7, blur: "5px", delay: 0.42 },
        { x: "-45vw", y: "-10vh", scale: 1.2, blur: "0px", delay: 0.48 },
        { x: "-42vw", y: "15vh",  scale: 0.9, blur: "3px", delay: 0.55 },
        { x: "-20vw", y: "30vh",  scale: 1.4, blur: "8px", delay: 0.62 },
        { x: "-15vw", y: "-50vh", scale: 0.6, blur: "2px", delay: 0.45 },
        { x: "-10vw", y: "-20vh", scale: 0.8, blur: "4px", delay: 0.68 },
        { x: "-25vw", y: "0vh",   scale: 1.0, blur: "0px", delay: 0.52 },
        { x: "-35vw", y: "35vh",  scale: 1.1, blur: "1px", delay: 0.72 },
        { x: "38vw",  y: "-30vh", scale: 1.3, blur: "6px", delay: 0.44 },
        { x: "25vw",  y: "-15vh", scale: 0.9, blur: "0px", delay: 0.50 },
        { x: "40vw",  y: "5vh",   scale: 0.8, blur: "4px", delay: 0.58 },
        { x: "20vw",  y: "25vh",  scale: 1.5, blur: "7px", delay: 0.65 },
        { x: "17vw",  y: "-35vh", scale: 0.8, blur: "1px", delay: 0.47 },
        { x: "32vw",  y: "15vh",  scale: 0.7, blur: "2px", delay: 0.53 },
        { x: "15vw",  y: "40vh",  scale: 1.2, blur: "5px", delay: 0.69 },
        { x: "45vw",  y: "-5vh",  scale: 0.6, blur: "0px", delay: 0.75 },
    ];

    return (
        <div 
            ref={containerRef} 
            onMouseMove={handleMouseMove} 
            className="relative h-[300vh] bg-white"
        >
        <div className="absolute w-full h-full z-9 block" style={{background: "radial-gradient(circle, rgba(194, 160, 88, 0.35) 0%, transparent 70%)"}} />
                <div className="sticky top-[10%] flex items-center justify-center gap-[100px] flex-col h-screen overflow-hidden">
                    <div className="content-wrapper relative z-40 pt-20 flex flex-col items-center text-center">
                        <h1 className='text-green xl:leading-[100px]'> 
                            <span className='text-gold'>
                                <RevealText tag='span'>Dietary</RevealText>
                            </span>
                            <RevealText tag='span'>Supplement</RevealText>
                        </h1>
                        <RevealText tag='h3'>Fat Burner with MCT</RevealText>
                    </div>
                    <motion.div 
                    initial={{ y: 800, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
                    className="relative perspective-[1200px] transform-style-3d"> 
                        <motion.img
                            src="/sup-bottle-lid.png"
                            style={{ 
                                y: yLid, x: xLid, rotate: rotateZ, rotateX: rotateX
                            }}
                            className="absolute top-[30%] left-[44%] w-[215px] h-auto object-contain z-50 pointer-events-none"
                        />

                        
                        <motion.img
                            src="/sup-bottle-open.png"
                            className="object-contain drop-shadow-2xl max-w-[400px] block h-auto mx-auto relative z-20"
                        />
                    </motion.div>
                {supplements.map((sup, index) => {
                            const imageNumber = (index % 8) + 1;
                            const popRange = [sup.delay, sup.delay + 0.08];
                            
                            const scale = useTransform(scrollYProgress, popRange, [0, sup.scale]);
                            const opacity = useTransform(scrollYProgress, popRange, [0, 1]);
                            const drift = useTransform(scrollYProgress, [sup.delay, 1], [0, -60]);

                            return (
                                <motion.img
                                    key={index}
                                    src={`/sup_${imageNumber}.png`}
                                    style={{ 
                                        x: sup.x, 
                                        y: sup.y,
                                        translateX: mouseMoveX, 
                                        translateY: mouseMoveY,
                                        translateZ: drift, 
                                        scale: scale,
                                        opacity: opacity,
                                        filter: `blur(${sup.blur})`,
                                        left: '50%',
                                        top: '50%',
                                    }}
                                    className="absolute w-24 h-auto object-contain z-30 pointer-events-none"
                                />
                            );
                        })}
                </div>
            </div>
    )
}

export default SupplementBanner