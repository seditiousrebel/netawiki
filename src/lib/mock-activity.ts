// src/lib/mock-activity.ts

export type ActivityItem = {
  id: string; // Unique ID for the activity itself
  timestamp: string; // ISO 8601 string
  entityId: string; // ID of the entity that performed or is related to the activity
  entityType: 'politician' | 'party' | 'bill' | 'promise' | 'news'; // Type of the entity
  entityName?: string; // Name of the entity, if available/relevant (e.g., Politician Name, Party Name)
  title: string; // A short title for the activity feed
  description: string; // A longer description of the activity
  link?: string; // Optional link to the relevant page or resource
  actorId?: string; // Optional: If a different entity/user initiated the activity on behalf of the entityId
  actorName?: string; // Optional: Name of the actor
};

// Helper to get a date in the past
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockActivities: ActivityItem[] = [
  // Politician Activities
  {
    id: 'act_pol_001',
    timestamp: daysAgo(1),
    entityId: 'sachin-datta', // Assuming 'sachin-datta' is a valid Politician ID from mockPoliticians
    entityType: 'politician',
    entityName: 'Sachin Datta',
    title: 'New Statement on Economic Policy',
    description: 'Sachin Datta released a detailed statement outlining new proposals for economic reform and growth.',
    link: '/politicians/sachin-datta#statements', // Example link
  },
  {
    id: 'act_pol_002',
    timestamp: daysAgo(3),
    entityId: 'jane-doe', // Assuming 'jane-doe' is a valid Politician ID
    entityType: 'politician',
    entityName: 'Jane Doe',
    title: 'Voted on Bill XYZ',
    description: 'Jane Doe cast a "Yea" vote on the recent Bill XYZ concerning environmental protection.',
    link: '/bills/bill-xyz', // Example link
  },
  {
    id: 'act_pol_003',
    timestamp: daysAgo(5),
    entityId: 'sachin-datta',
    entityType: 'politician',
    entityName: 'Sachin Datta',
    title: 'Hosted Town Hall Meeting',
    description: 'Sachin Datta hosted a town hall meeting to discuss local constituency issues and answer questions from residents.',
    link: '/news/sachin-datta-town-hall-summary', // Example link to a news article about it
  },

  // Party Activities
  {
    id: 'act_par_001',
    timestamp: daysAgo(2),
    entityId: 'green-party', // Assuming 'green-party' is a valid Party ID from mockParties
    entityType: 'party',
    entityName: 'Green Party',
    title: 'Updated Party Manifesto on Healthcare',
    description: 'The Green Party published an updated section of their manifesto focusing on new healthcare initiatives.',
    link: '/parties/green-party#manifesto',
  },
  {
    id: 'act_par_002',
    timestamp: daysAgo(4),
    entityId: 'tech-forward-party', // Assuming 'tech-forward-party' is a valid Party ID
    entityType: 'party',
    entityName: 'Tech Forward Party',
    title: 'Announced New Leadership Candidate',
    description: 'The Tech Forward Party announced John Smith as a candidate for the upcoming party leadership election.',
    link: '/parties/tech-forward-party/news/leadership-announcement',
  },

  // Bill Activities
  {
    id: 'act_bill_001',
    timestamp: daysAgo(1),
    entityId: 'hr-123', // Assuming 'hr-123' is a valid Bill ID from mockBills
    entityType: 'bill',
    entityName: 'Education Reform Act', // Bill title can serve as entityName here
    title: 'Passed Second Reading',
    description: 'The Education Reform Act (HR-123) successfully passed its second reading in parliament.',
    link: '/bills/hr-123',
  },
  {
    id: 'act_bill_002',
    timestamp: daysAgo(6),
    entityId: 's-456', // Assuming 's-456' is a valid Bill ID
    entityType: 'bill',
    entityName: 'Infrastructure Investment Bill',
    title: 'New Amendment Proposed',
    description: 'An amendment was proposed for the Infrastructure Investment Bill (S-456) regarding funding allocation.',
    link: '/bills/s-456#amendments',
  },

  // Promise Activities
  {
    id: 'act_prom_001',
    timestamp: daysAgo(2),
    entityId: 'promise-001', // Assuming 'promise-001' is a valid Promise ID from mockPromises
    entityType: 'promise',
    entityName: 'Build 10 New Schools', // Promise title
    title: 'Status Updated: In Progress',
    description: 'The promise to "Build 10 New Schools" has been updated to "In Progress". Groundbreaking on 2 sites has begun.',
    link: '/promises#promise-001', // Link to promise tracker or specific promise page
  },
  {
    id: 'act_prom_002',
    timestamp: daysAgo(7),
    entityId: 'promise-002',
    entityType: 'promise',
    entityName: 'Reduce Carbon Emissions by 20%',
    title: 'Evidence Added: New Report Published',
    description: 'A new government report detailing progress towards the "Reduce Carbon Emissions by 20%" promise has been added as evidence.',
    link: '/promises#promise-002',
  },
   // News Activities (can be used if users follow specific news topics or sources, or for general news in feed)
  {
    id: 'act_news_001',
    timestamp: daysAgo(0), // Today
    entityId: 'climate-change-summit-report', // Slug or ID of a news article
    entityType: 'news',
    entityName: 'Climate Change Summit Report', // Article Title
    title: 'New Article: "Global Leaders Agree on New Climate Targets"',
    description: 'A comprehensive report on the outcomes of the recent Global Climate Change Summit.',
    link: '/news/climate-change-summit-report',
    actorName: 'The National Times' // Source of the news
  },
  {
    id: 'act_news_002',
    timestamp: daysAgo(1),
    entityId: 'election-coverage-analysis',
    entityType: 'news',
    entityName: 'Election Coverage Analysis',
    title: 'Analysis: "Key Takeaways from Recent Election Polls"',
    description: 'An in-depth analysis of the latest election polls and their potential implications.',
    link: '/news/election-coverage-analysis',
    actorName: 'Politics Today Weekly'
  }
];

// Function to get activities, could be expanded with filtering/pagination later
export const getMockActivities = (limit?: number): ActivityItem[] => {
  const sortedActivities = mockActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  if (limit) {
    return sortedActivities.slice(0, limit);
  }
  return sortedActivities;
};
