'use client'; // Required for client components in Next.js App Router

import React from 'react';
import { ExampleDiffViewer } from '@/components/ui/SideBySideDiffViewer'; // Assuming this is the exported example
import { ExampleVersionHistoryViewer } from '@/components/ui/VersionHistoryDiffViewer'; // Assuming this is the exported example

const DiffTestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Diff Viewer Components Test Page</h1>
        <p className="text-sm text-gray-600">
          This page demonstrates the `SideBySideDiffViewer` and `VersionHistoryDiffViewer` components.
        </p>
      </header>

      <section className="mb-12 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-300">
          SideBySideDiffViewer Test (Moderation Diff)
        </h2>
        <div className="overflow-x-auto">
          <ExampleDiffViewer />
        </div>
      </section>

      <section className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-300">
          VersionHistoryDiffViewer Test
        </h2>
        <div className="overflow-x-auto">
          <ExampleVersionHistoryViewer />
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-gray-500">
        <p>End of test page.</p>
      </footer>
    </div>
  );
};

export default DiffTestPage;
