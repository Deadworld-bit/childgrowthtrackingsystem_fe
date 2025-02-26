"use client";

import Tag from "@/components/Tag";
import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const text = `but traditional child care solutions can be overwhelming and outdated. That’s why we created this web—app simple, effective, and modern approach to making parenting easier while ensuring your child gets the care they need to thrive.`;
const words = text.split(' ');

export default function Introduction() {
    const scrollTarget = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: scrollTarget,
        offset: ["start end", "end end"],
    });

    const [currentWord, setCurrentWord] = useState(0);
    const wordIndex = useTransform(scrollYProgress, [0, 1], [0, words.length]);

    useEffect(() => {
        wordIndex.on("change", (latest) => {
            setCurrentWord(Math.floor(latest));
        });
    }, [wordIndex]);

    return (
        <section className="py-28 lg:py-40">
            <div className="container">
                <div className="sticky top-20">
                    <div className="flex justify-center">
                        <Tag>Why we do This?</Tag>
                    </div>
                    <div className="text-4xl text-center font-medium mt-10">
                        <span>Your child's health and well-being deserve the best, </span>
                        <span className="text-white/15">
                            {words.map((word, index) => (
                                <span key={index} className={twMerge(index < currentWord && 'text-white')}>{word} </span>
                            ))}
                        </span>
                        <span className="text-lime-400 block">
                            {" "}
                            Because every child deserves a strong, healthy start.
                        </span>
                    </div>
                </div>
                <div className="h-[30vh]" ref={scrollTarget}></div>
            </div>
        </section>
    );
}