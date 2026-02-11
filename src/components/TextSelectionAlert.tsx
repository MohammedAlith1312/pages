"use client";

import { useEffect, useState } from 'react';

export default function TextSelectionAlert() {
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const handleTextSelection = async () => {
            // Prevent multiple triggers while creating an issue
            if (isCreating) return;

            const selectedText = window.getSelection()?.toString().trim();

            if (selectedText && selectedText.length > 0) {
                // Step 1: Prompt for issue title
                const issueTitle = prompt(`Selected text: "${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}"\n\nEnter issue title:`);

                if (!issueTitle || issueTitle.trim() === '') {
                    return; // User cancelled or entered empty title
                }

                // Step 2: Confirm issue creation
                const confirmed = confirm(
                    `Create GitHub issue?\n\n` +
                    `Title: ${issueTitle}\n` +
                    `Selected Text: ${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}\n\n` +
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
                            body: `**Selected Text:**\n> ${selectedText}\n\n**Page URL:** ${window.location.href}\n\n**Timestamp:** ${new Date().toISOString()}`,
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

        // Listen for mouseup event (when user finishes selecting text)
        document.addEventListener('mouseup', handleTextSelection);

        // Cleanup
        return () => {
            document.removeEventListener('mouseup', handleTextSelection);
        };
    }, [isCreating]);

    return null; // This component doesn't render anything visible
}
