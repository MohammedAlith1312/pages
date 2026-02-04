import Image from "next/image";

interface HeroProps {
    heading: string;
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
            className="relative py-20 md:py-32 overflow-hidden"
            style={{ backgroundColor: background_color, color: text_color }}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div
                    className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"
                        } items-center gap-12`}
                >
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
                            {heading}
                        </h1>
                        <p className="text-lg md:text-xl opacity-80 mb-10 leading-relaxed max-w-2xl mx-auto md:mx-0 animate-fade-in-up delay-100">
                            {description}
                        </p>
                        <div className="animate-fade-in-up delay-200">
                            <a
                                href={button_link}
                                className="inline-block px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                style={{
                                    backgroundColor: text_color,
                                    color: background_color,
                                }}
                            >
                                {button_text}
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-2xl animate-fade-in delay-300">
                        {image ? (
                            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                                <Image
                                    src={image}
                                    alt={heading}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className="aspect-square rounded-full opacity-20 blur-3xl animate-pulse mx-auto"
                                style={{
                                    background: `linear-gradient(45deg, ${text_color}, transparent)`,
                                    maxWidth: '400px'
                                }}
                            ></div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
