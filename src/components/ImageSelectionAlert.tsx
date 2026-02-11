"use client";

import { useEffect, useState } from 'react';

export default function ImageSelectionAlert() {
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const handleImageClick = async (event: MouseEvent) => {
            // Prevent multiple triggers while creating an issue
            if (isCreating) return;

            const target = event.target as HTMLElement;

            // Check if the clicked element is an image
            if (target.tagName === 'IMG') {
                const img = target as HTMLImageElement;

                // Prevent default behavior
                event.preventDefault();

                // Get image details
                const imageSrc = img.src;
                const imageAlt = img.alt || 'No alt text';
                const imageWidth = img.naturalWidth;
                const imageHeight = img.naturalHeight;

                // Step 1: Prompt for issue title
                const issueTitle = prompt(
                    `Selected image: "${imageAlt}"\n\n` +
                    `Source: ${imageSrc.substring(0, 50)}${imageSrc.length > 50 ? '...' : ''}\n\n` +
                    `Enter issue title:`
                );

                if (!issueTitle || issueTitle.trim() === '') {
                    return; // User cancelled or entered empty title
                }

                // Step 2: Confirm issue creation
                const confirmed = confirm(
                    `Create GitHub issue?\n\n` +
                    `Title: ${issueTitle}\n` +
                    `Image Alt: ${imageAlt}\n` +
                    `Image Source: ${imageSrc.substring(0, 60)}${imageSrc.length > 60 ? '...' : ''}\n` +
                    `Dimensions: ${imageWidth}x${imageHeight}\n\n` +
                    `Click OK to create the issue.`
                );

                if (!confirmed) {
                    return; // User cancelled
                }

                // Step 3: Create the issue
                setIsCreating(true);

                try {
                    const response = await fetch('/api/issues/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: issueTitle,
                            body: `**Selected Image:**\n\n` +
                                `[${imageAlt}](${imageSrc})\n\n` +
                                `**Image Details:**\n` +
                                `- Alt Text: ${imageAlt}\n` +
                                `- Source: ${imageSrc}\n` +
                                `- Dimensions: ${imageWidth}x${imageHeight}px\n\n` +
                                `**Page URL:** ${window.location.href}\n\n` +
                                `**Timestamp:** ${new Date().toISOString()}`,
                        }),
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        // Automatically open the issue in a new tab
                        window.open(data.url, '_blank');

                        // Show success message
                        alert(`✅ Issue created successfully!\n\nThe issue has been opened in a new tab.`);
                    } else {
                        alert(`❌ Failed to create issue:\n${data.error || 'Unknown error'}`);
                    }
                } catch (error: any) {
                    alert(`❌ Error creating issue:\n${error.message}`);
                } finally {
                    setIsCreating(false);
                }
            }
        };

        // Listen for click events on images
        document.addEventListener('click', handleImageClick);

        // Cleanup
        return () => {
            document.removeEventListener('click', handleImageClick);
        };
    }, [isCreating]);

    return null; // This component doesn't render anything visible
}
