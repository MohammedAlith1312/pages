
import React from 'react';
import Hero from './Hero';
import Features from './Features';

interface Section {
    type: string;
    [key: string]: any;
}

interface PageBuilderProps {
    sections: Section[];
}

export default function PageBuilder({ sections }: PageBuilderProps) {
    if (!sections) return null;

    return (
        <div className="flex flex-col">
            {sections.map((section, index) => {
                switch (section.type) {
                    case 'hero':
                        // @ts-ignore - Spreading props is safe here as JSON matches component props
                        return <Hero key={index} {...section} />;
                    case 'features':
                        // @ts-ignore - Spreading props is safe here as JSON matches component props
                        return <Features key={index} {...section} />;
                    default:
                        console.warn(`Unknown section type: ${section.type}`);
                        return null;
                }
            })}
        </div>
    );
}
