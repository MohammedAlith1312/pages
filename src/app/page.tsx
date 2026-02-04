import homeData from "../../lib/pages/2026-02-04-home.json";
import Hero from "@/components/Hero";

export default function LandingPage() {
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
