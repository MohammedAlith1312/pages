
"use client";

import { useState } from 'react';

export default function TextBlock() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [issueUrl, setIssueUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');
        setIssueUrl('');

        try {
            const res = await fetch('/api/issues/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    body: description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create issue');
            }

            setStatus('success');
            setIssueUrl(data.url);
            setTitle(''); // Clear form
            setDescription('');
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Report an Issue</h2>

            {status === 'success' && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-200">
                    Success! Issue created. {' '}
                    <a
                        href={issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline hover:text-green-800"
                    >
                        View on GitHub
                    </a>.
                </div>
            )}

            {status === 'error' && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
                    Error: {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief summary of the issue"
                        required
                        disabled={status === 'submitting'}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Detailed description..."
                        required
                        disabled={status === 'submitting'}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
            ${status === 'submitting'
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Issue'}
                </button>
            </form>
        </div>
    );
}
