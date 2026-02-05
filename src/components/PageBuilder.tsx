import Hero from "./Hero";
import Features from "./Features";

interface PageBuilderProps {
    sections: any[];
}

export default function PageBuilder({ sections }: PageBuilderProps) {
    if (!sections) return null;

    return (
        <>
            {sections.map((section: any, index: number) => {
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
                if (section.type === "features") {
                    return (
                        <Features
                            key={index}
                            heading={section.heading}
                            cards={section.cards}
                        />
                    );
                }
                return null;
            })}
        </>
    );
}
