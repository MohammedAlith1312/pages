'use client';

import { useActionState } from 'react';
import { createGitHubIssue } from '../app/actions';

const initialState = {
  success: false,
  message: '', 
  url: ''
};

export default function IssueForm({
  heading = "Report an Issue",
  description = "Found a bug? Let us know!",
  buttonText = "Submit Issue"
}: {
  heading?: string;
  description?: string;
  buttonText?: string;
}) {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
      return await createGitHubIssue(formData);
  }, initialState);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{heading}</h2>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {state.success ? (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg text-center">
              <p className="font-medium">Issue created successfully!</p>
              <a 
                href={state.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:underline mt-2 inline-block"
              >
                View Issue on GitHub &rarr;
              </a>
            </div>
          ) : (
            <form action={formAction} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Navigation bug on mobile"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              {state.message && (
                <div className="text-red-500 text-sm text-center">
                  {state.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  buttonText
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
