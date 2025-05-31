import Link from 'next/link';

const entities = [
  { name: 'Politicians', path: '/politicians' },
  { name: 'Bills', path: '/bills' },
  { name: 'Committees', path: '/committees' },
  { name: 'Constituencies', path: '/constituencies' },
  { name: 'Controversies', path: '/controversies' },
  { name: 'Elections', path: '/elections' },
  { name: 'News', path: '/news' },
  { name: 'Parties', path: '/parties' },
  { name: 'Promises', path: '/promises' },
];

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Adjusted title size for mobile-first approach */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explore</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {entities.map((entity) => (
          <Link key={entity.name} href={entity.path} legacyBehavior>
            <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <h2 className="text-xl font-semibold mb-2">{entity.name}</h2>
              <p className="text-gray-600">Discover {entity.name.toLowerCase()}.</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
