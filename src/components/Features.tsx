import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FeatureCard {
    title: string;
    image: string;
    description: string;
    link: string;
    link_text: string;
}

interface FeaturesProps {
    heading: string;
    cards: FeatureCard[];
}

export default function Features({ heading, cards }: FeaturesProps) {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {heading}
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                        >
                            <div className="relative h-48 w-full">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 text-gray-900">
                                    {card.title}
                                </h3>
                                <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                                    {card.description}
                                </p>
                                <div>
                                    <Link
                                        href={card.link}
                                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                    >
                                        {card.link_text}
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
