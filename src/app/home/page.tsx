import homeData from "../../../lib/pages/home.json";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: homeData.title,
};

export default function HomePage() {
    return (
        <main>
            {homeData.sections.map((section: any, index: number) => {
                if (section.type === "hero") {
                    return (
                        <Hero
                            key={index}
                            heading={section.heading}
                            description={section.description}
                            background_color={section.background_color}
                            text_color={section.text_color}
                            button_text={section.button_text}
                            button_link={section.button_link}
                            layout={section.layout}
                            image={section.image}
                        />
                    );
                }
                return null;
            })}
        </main>
    );
}
