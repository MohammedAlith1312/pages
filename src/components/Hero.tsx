import Image from "next/image";
import React from "react";

interface HeroProps {
    heading: string;
    heading_tag: any;
    description: string;
    background_color: string;
    text_color: string;
    button_text: string;
    button_link: string;
    layout?: string;
    image?: string;
}

export default function Hero({
    heading,
    heading_tag,
    description,
    background_color,
    text_color,
    button_text,
    button_link,
    layout,
    image,
}: HeroProps) {
    const isReversed = layout === "reversed";

    return (
        <section
            className="relative py-20 md:py-32"
            style={{ backgroundColor: background_color, color: text_color }}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div
                    className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"
                        } items-center gap-12`}
                >
                    <div className="flex-1 text-center md:text-left">
                        {React.createElement(
                            heading_tag,
                            { className: "font-bold mb-6" },
                            heading
                        )}
                        <p className="text-lg md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto md:mx-0">
                            {description}
                        </p>
                        <div>
                            <a
                                href={button_link}
                                className="inline-block px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:opacity-90 shadow-md"
                                style={{
                                    backgroundColor: text_color,
                                    color: background_color,
                                }}
                            >
                                {button_text}
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-2xl">
                        {image && (
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-black/5">
                                <Image
                                    src={image}
                                    alt={heading}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
