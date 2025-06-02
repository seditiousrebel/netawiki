
import type { Bill, BillStatus, BillTimelineEvent } from '@/types/gov';

export const mockBills: Bill[] = [
  {
    id: 'b1',
    slug: 'clean-energy-act-2024',
    title: 'Clean Energy Act 2024',
    billNumber: 'S. 567',
    summary: 'A bill to promote investment in renewable energy sources and reduce carbon emissions, aiming for 50% renewable energy by 2035.',
    purpose: 'To transition the national energy grid towards cleaner sources, create green jobs, meet international climate targets, and stimulate innovation in energy storage technologies.',
    sponsors: [
        { id: 'p1', name: 'Alice Democratia', type: 'Primary' },
        { id: 'p2', name: 'Bob Republicanus', type: 'Co-Sponsor' }, // Added co-sponsor
        { id: 'p4', name: 'Senator Evelyn "Evie" Chang', type: 'Co-Sponsor' } // Added co-sponsor
    ],
    status: 'Passed Senate, Awaiting House Action' as BillStatus, // Updated status
    introducedDate: '2024-03-15',
    billType: 'Government',
    responsibleMinistry: 'Ministry of Energy',
    houseOfIntroduction: 'Senate',
    parliamentarySession: '3rd Session, 48th Parliament',
    keyDates: {
      introduced: '2024-03-15',
      committeeReferral: '2024-03-18',
      passedUpperHouse: '2024-07-10', // Added
    },
    timelineEvents: [
      { date: '2024-03-15', event: 'Bill Introduced in Senate', description: 'First reading by Senator Alice Democratia.', iconType: 'billEvent' },
      { date: '2024-03-18', event: 'Referred to Committee', description: 'Sent to the Senate Committee on Energy and Natural Resources for review.', iconType: 'billEvent', actor: 'Senate Clerk' },
      { date: '2024-04-05', event: 'First Committee Hearing', description: 'Public and expert testimonies heard.', iconType: 'billEvent', actor: 'Senate Committee on Energy and Natural Resources' },
      { date: '2024-04-12', event: 'Second Committee Hearing', description: 'Further expert testimony and review of proposed amendments from industry stakeholders.', iconType: 'billEvent', actor: 'Senate Committee on Energy and Natural Resources' },
      { date: '2024-04-20', event: 'Committee Markup Session', description: 'Amendments discussed and incorporated into revised bill text.', iconType: 'billEvent', actor: 'Senate Committee on Energy and Natural Resources', relatedDocumentUrl: 'https://example.com/s567-markup-summary.pdf' },
      { date: '2024-04-25', event: 'Committee Vote', description: 'Bill passed favorably by committee vote (9-2).', iconType: 'billEvent', actor: 'Senate Committee on Energy and Natural Resources' },
      { date: '2024-04-28', event: 'Reported out of Committee', description: 'Bill reported to Senate floor with recommendation to pass.', iconType: 'billEvent', actor: 'Senate Committee on Energy and Natural Resources' },
      { date: '2024-05-10', event: 'Second Reading in Senate', description: 'General principles of the bill debated on the Senate floor.', iconType: 'billEvent', actor: 'Senate' },
      { date: '2024-05-15', event: 'Amendment S.A. 451 Proposed', description: 'Proposed by Sen. Fictional to increase solar tax credits.', iconType: 'billEvent', actor: 'Sen. Fictional', relatedDocumentUrl: 'https://example.com/s567-amdt-sa451.pdf' },
      { date: '2024-05-17', event: 'Vote on Amendment S.A. 451', description: 'Amendment adopted (55-43).', iconType: 'billEvent', actor: 'Senate' },
      { date: '2024-05-20', event: 'Amendment S.A. 455 (Substitute) Proposed', description: 'Proposed by Sen. Opposition to weaken emission targets.', iconType: 'billEvent', actor: 'Sen. Opposition' },
      { date: '2024-05-22', event: 'Vote on Amendment S.A. 455', description: 'Amendment rejected (30-68).', iconType: 'billEvent', actor: 'Senate' },
      { date: '2024-07-10', event: 'Third Reading and Final Passage Vote in Senate', description: 'Bill passed Senate (65-33).', iconType: 'billEvent', actor: 'Senate' },
      { date: '2024-07-11', event: 'Sent to House for Consideration', description: 'Bill formally transmitted to the House of Representatives.', iconType: 'billEvent', actor: 'Senate Clerk' }
    ],
    committees: ['Senate Committee on Energy and Natural Resources', 'House Committee on Energy and Commerce (Anticipated)'], // Updated
    votingResults: { // Added Senate voting results
        senate: {
            date: '2024-07-10',
            passed: true,
            records: [
                { politicianId: 'p1', politicianName: 'Alice Democratia', vote: 'Yea'},
                { politicianId: 'p2', politicianName: 'Bob Republicanus', vote: 'Nay'}, // Changed vote for realism
                { politicianId: 'p4', politicianName: 'Senator Evelyn "Evie" Chang', vote: 'Yea'},
                { politicianId: 'politician-fictional-senate-1', politicianName: 'Sen. John Doe', vote: 'Yea'},
                { politicianId: 'politician-fictional-senate-2', politicianName: 'Sen. Jane Smith', vote: 'Nay'},
                { politicianId: 'politician-fictional-senate-3', politicianName: 'Sen. Mike Johnson', vote: 'Yea'},
                { politicianId: 'politician-fictional-senate-4', politicianName: 'Sen. Emily Davis', vote: 'Abstain'},
            ]
        }
    },
    lastActionDate: '2024-07-11', // Updated
    lastActionDescription: 'Sent to House for Consideration.', // Updated
    impact: 'Amends the National Energy Policy Act of 2005 to include new incentives for solar and wind power, and establishes a Green Technology Fund.', // Updated
    tags: ['energy', 'climate-change', 'renewable-energy', 'government-bill', 'tax-credits', 'innovation'], // Updated
    fullTextUrl: 'https://example.com/s567-text-v2-passed-senate.pdf', // Updated
    revisionHistory: [
      {
        id: 'rev-bill-001',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        author: 'EditorAlice',
        event: 'Bill Summary Updated',
        details: 'Clarified language in the bill summary regarding funding allocation.',
        suggestionId: 'sugg_bill_summ_abc'
      },
      {
        id: 'rev-bill-002',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        author: 'AdminBob',
        event: 'Sponsor List Amended',
        details: 'Added co-sponsor Rep. Fictional based on parliamentary records.',
      }
    ]
  },
  {
    id: 'b2',
    slug: 'digital-literacy-for-all-act',
    title: 'Digital Literacy For All Act',
    billNumber: 'H.R. 1230',
    summary: 'Provides funding for digital literacy programs in underserved communities and establishes a National Digital Skills Taskforce.',
    purpose: 'To bridge the digital divide, ensure all citizens have necessary skills for the modern economy, and coordinate national efforts on digital inclusion.',
    sponsors: [
        { id: 'p2', name: 'Bob Republicanus', type: 'Primary' }, 
        { id: 'p1', name: 'Alice Democratia', type: 'Co-Sponsor' },
        { id: 'p4', name: 'Senator Evelyn "Evie" Chang', type: 'Co-Sponsor' } // Added co-sponsor
    ],
    status: 'Signed into Law' as BillStatus, // Updated status
    introducedDate: '2023-09-10',
    billType: 'Private Member',
    houseOfIntroduction: 'House',
    parliamentarySession: '2nd Session, 48th Parliament',
    keyDates: {
      introduced: '2023-09-10',
      passedLowerHouse: '2024-02-20',
      passedUpperHouse: '2024-05-10', // Added
      signedIntoLaw: '2024-05-25' // Added
    },
    votingResults: {
      house: {
        date: '2024-02-20',
        records: [
          { politicianId: 'p1', politicianName: 'Alice Democratia', vote: 'Yea' }, // Removed (Proxy) for consistency
          { politicianId: 'p2', politicianName: 'Bob Republicanus', vote: 'Yea' },
          { politicianId: 'p5', politicianName: 'Councilman Marcus "The Maverick" Thorne', vote: 'Yea' }, // Fictional, assuming he was in House
          { politicianId: 'politician-fictional-house-1', politicianName: 'Rep. Fictional A', vote: 'Yea'},
          { politicianId: 'politician-fictional-house-2', politicianName: 'Rep. Fictional B', vote: 'Nay'},
        ],
        passed: true,
      },
      senate: { // Added Senate voting results
        date: '2024-05-10',
        passed: true,
        records: [
            { politicianId: 'p1', politicianName: 'Alice Democratia', vote: 'Yea'},
            { politicianId: 'p4', politicianName: 'Senator Evelyn "Evie" Chang', vote: 'Yea'},
            { politicianId: 'politician-fictional-senate-1', politicianName: 'Sen. John Doe', vote: 'Yea'},
            { politicianId: 'politician-fictional-senate-2', politicianName: 'Sen. Jane Smith', vote: 'Yea'},
            { politicianId: 'politician-fictional-senate-3', politicianName: 'Sen. Mike Johnson', vote: 'Abstain'},
        ]
      }
    },
    timelineEvents: [
      { date: '2023-09-10', event: 'Bill Introduced in House', description: 'First reading by Rep. Bob Republicanus.', iconType: 'billEvent' },
      { date: '2023-10-01', event: 'Referred to House Committee on Education and Labor.', iconType: 'billEvent', actor: 'House Clerk'},
      { date: '2024-01-15', event: 'Amendment H.Amdt.301 Proposed', description: 'Amendment to expand program scope to include senior citizens, proposed by Rep. Alice Democratia.', actor: 'Rep. Alice Democratia', relatedDocumentUrl: 'https://example.com/hr1230-hamdt301.pdf', iconType: 'billEvent' },
      { date: '2024-01-20', event: 'Amendment H.Amdt.301 Adopted by Committee', description: 'The committee adopted the amendment to expand program scope.', iconType: 'billEvent', actor: 'House Committee on Education and Labor'},
      { date: '2024-02-20', event: 'Passed House Vote', description: 'The bill successfully passed the House vote (380-50).', iconType: 'billEvent', actor: 'House' },
      { date: '2024-02-22', event: 'Sent to Senate for Consideration', description: 'Bill received in the Senate.', iconType: 'billEvent', actor: 'House Clerk'},
      { date: '2024-02-28', event: 'Referred to Senate Committee on Health, Education, Labor, and Pensions (HELP)', iconType: 'billEvent', actor: 'Senate Clerk'},
      { date: '2024-03-15', event: 'Senate HELP Committee Hearing', description: 'Testimonies from educators and tech industry leaders.', iconType: 'billEvent', actor: 'Senate HELP Committee'},
      { date: '2024-04-10', event: 'Senate HELP Committee Reports Favorably', description: 'Bill reported out with minor technical amendments.', iconType: 'billEvent', actor: 'Senate HELP Committee'},
      { date: '2024-05-10', event: 'Passed Senate Vote with Unanimous Consent', description: 'The bill successfully passed the Senate.', iconType: 'billEvent', actor: 'Senate' },
      { date: '2024-05-15', event: 'Bill Enrolled and Presented to President', description: 'Final version of the bill prepared and sent for presidential signature.', iconType: 'billEvent', actor: 'Congress'},
      { date: '2024-05-25', event: 'Signed into Law by President', description: 'President Example signed the H.R. 1230 into law.', iconType: 'billEvent', actor: 'President Example', relatedDocumentUrl: 'https://example.com/hr1230-signing-statement.pdf'}
    ],
    committees: ['House Committee on Education and Labor', 'Senate Committee on Health, Education, Labor, and Pensions'], // Updated
    lastActionDate: '2024-05-25', // Updated
    lastActionDescription: 'Signed into Law by President.', // Updated
    fullTextUrl: 'https://example.com/hr1230-enacted.pdf', // Updated
    impact: 'Establishes a new grant program under the Department of Education and forms a National Digital Skills Taskforce to coordinate efforts.', // Updated
    tags: ['education', 'digital-divide', 'technology', 'social-program', 'bipartisan', 'enacted'], // Updated
  },
  // New Bill 1: Highly Amended & Passed (ID: b3)
  {
    id: 'b3',
    slug: 'national-ai-research-act-2025',
    title: 'National AI Research & Development Act 2025',
    billNumber: 'H.R. 2042',
    summary: 'A bill to establish a national strategy for AI research, fund AI centers of excellence, and promote public-private partnerships in AI development while addressing ethical considerations.',
    purpose: 'To ensure national leadership in artificial intelligence, foster innovation, develop a skilled AI workforce, and establish ethical guidelines for AI deployment.',
    sponsors: [
        { id: 'p4', name: 'Senator Evelyn "Evie" Chang', type: 'Primary' }, // Assuming she's back in Senate or this is a past bill
        { id: 'p1', name: 'Alice Democratia', type: 'Co-Sponsor' },
        { id: 'p2', name: 'Bob Republicanus', type: 'Co-Sponsor' },
    ],
    status: 'Signed into Law' as BillStatus,
    introducedDate: '2025-01-15', // Fictional future date
    billType: 'Government',
    responsibleMinistry: 'Ministry of Science and Technology',
    houseOfIntroduction: 'House', // Let's start in House for this one
    parliamentarySession: '1st Session, 49th Parliament',
    keyDates: {
      introduced: '2025-01-15',
      committeeReferral: '2025-01-20',
      passedLowerHouse: '2025-04-10',
      passedUpperHouse: '2025-07-15',
      signedIntoLaw: '2025-08-01'
    },
    timelineEvents: [
      { date: '2025-01-15', event: 'Bill Introduced in House', description: 'First reading by Rep. Chang (assuming a role change or generic sponsor).', iconType: 'billEvent', actor: 'Rep. Chang' },
      { date: '2025-01-20', event: 'Referred to House Committee on Science, Space, and Technology', iconType: 'billEvent', actor: 'House Clerk' },
      { date: '2025-02-05', event: 'First Hearing in House Science Committee', iconType: 'billEvent', actor: 'House Science Committee' },
      { date: '2025-02-15', event: 'House Science Committee Markup', description: 'Amdt. H.A. 1 (Funding Increase for AI Ethics Research) - Adopted.', iconType: 'billEvent', actor: 'House Science Committee', relatedDocumentUrl: 'https://example.com/hr2042-ha1.pdf' },
      { date: '2025-02-20', event: 'House Science Committee Reports Favorably (Amended)', iconType: 'billEvent', actor: 'House Science Committee' },
      { date: '2025-03-10', event: 'Floor Debate in House - Day 1', iconType: 'billEvent', actor: 'House' },
      { date: '2025-03-12', event: 'Amdt. H.A. 5 (Workforce Retraining Program) by Rep. Alice Democratia - Adopted', iconType: 'billEvent', actor: 'Rep. Alice Democratia', relatedDocumentUrl: 'https://example.com/hr2042-ha5.pdf' },
      { date: '2025-03-15', event: 'Amdt. H.A. 7 (Restrictions on Facial Recognition) by Rep. Foe - Rejected', iconType: 'billEvent', actor: 'Rep. Foe' },
      { date: '2025-04-10', event: 'Passed House Vote (Amended)', description: 'Vote: 310-120', iconType: 'billEvent', actor: 'House' },
      { date: '2025-04-12', event: 'Sent to Senate', iconType: 'billEvent', actor: 'House Clerk' },
      { date: '2025-04-15', event: 'Referred to Senate Committee on Commerce, Science, and Transportation', iconType: 'billEvent', actor: 'Senate Clerk' },
      { date: '2025-05-01', event: 'Senate Commerce Committee Hearing', iconType: 'billEvent', actor: 'Senate Commerce Committee' },
      { date: '2025-05-10', event: 'Senate Commerce Committee Markup', description: 'Amdt. S.A. 2 (International Collaboration Mandate) - Adopted.', iconType: 'billEvent', actor: 'Senate Commerce Committee', relatedDocumentUrl: 'https://example.com/hr2042-sa2.pdf' },
      { date: '2025-05-15', event: 'Senate Commerce Committee Reports Favorably (Amended)', iconType: 'billEvent', actor: 'Senate Commerce Committee' },
      { date: '2025-06-05', event: 'Passed Senate Vote (Amended)', description: 'Vote: 75-23', iconType: 'billEvent', actor: 'Senate' },
      { date: '2025-06-10', event: 'House Disagrees with Senate Amendments - Conference Requested', iconType: 'billEvent', actor: 'House' },
      { date: '2025-06-20', event: 'Conference Committee Formed', iconType: 'billEvent', actor: 'Congress' },
      { date: '2025-07-05', event: 'Conference Report Filed', description: 'Compromise reached between House and Senate versions.', iconType: 'billEvent', actor: 'Conference Committee', relatedDocumentUrl: 'https://example.com/hr2042-confreport.pdf' },
      { date: '2025-07-10', event: 'House Adopts Conference Report', iconType: 'billEvent', actor: 'House' },
      { date: '2025-07-15', event: 'Senate Adopts Conference Report', iconType: 'billEvent', actor: 'Senate' },
      { date: '2025-07-20', event: 'Presented to President', iconType: 'billEvent', actor: 'Congress' },
      { date: '2025-08-01', event: 'Signed into Law by President Example', iconType: 'billEvent', actor: 'President Example' }
    ],
    committees: ['House Committee on Science, Space, and Technology', 'Senate Committee on Commerce, Science, and Transportation', 'Conference Committee on H.R. 2042'],
    votingResults: {
      house: { date: '2025-04-10', passed: true, records: [
        { politicianId: 'p1', politicianName: 'Alice Democratia', vote: 'Yea'},
        { politicianId: 'p2', politicianName: 'Bob Republicanus', vote: 'Yea'},
        { politicianId: 'p4', politicianName: 'Senator Evelyn "Evie" Chang', vote: 'Yea'}, // Assuming Rep. role for this bill
        { politicianId: 'p5', politicianName: 'Councilman Marcus "The Maverick" Thorne', vote: 'Yea'}, // Assuming Rep. role
      ]},
      senate: { date: '2025-07-15', passed: true, records: [ // Vote on Conference report
        { politicianId: 'p1', politicianName: 'Alice Democratia', vote: 'Yea'},
        { politicianId: 'p4', politicianName: 'Senator Evelyn "Evie" Chang', vote: 'Yea'},
      ]}
    },
    lastActionDate: '2025-08-01',
    lastActionDescription: 'Signed into Law by President Example.',
    impact: 'Establishes the National AI Initiative Office (NAIIO) and allocates $10 billion over 5 years for AI research and education.',
    tags: ['ai', 'technology', 'research', 'innovation', 'ethics', 'government-bill', 'bipartisan'],
    fullTextUrl: 'https://example.com/hr2042-enacted.pdf',
  },
  // Bill 2: Controversial & Failed (ID: b4)
  {
    id: 'b4',
    slug: 'accountability-in-public-office-act-2024',
    title: 'Accountability in Public Office Act 2024',
    billNumber: 'S. 990',
    summary: 'A bill to impose stricter ethics regulations, term limits for parliamentarians, and create an independent anti-corruption agency with broad investigative powers.',
    purpose: 'To enhance transparency, reduce corruption, and restore public trust in government institutions.',
    sponsors: [
        { id: 'p5', name: 'Councilman Marcus "The Maverick" Thorne', type: 'Primary' }, // Assuming Senator role for this bill
        { id: 'p1', name: 'Alice Democratia', type: 'Co-Sponsor' },
    ],
    status: 'Failed in House' as BillStatus,
    introducedDate: '2024-02-01',
    billType: 'Private Member',
    houseOfIntroduction: 'Senate',
    parliamentarySession: '3rd Session, 48th Parliament',
    controversyIds: ['c1', 'c-bill-lobbying-pressure-b4'], // Linked to existing and new fictional controversy
    keyDates: {
      introduced: '2024-02-01',
      passedUpperHouse: '2024-04-15',
      failedLowerHouse: '2024-06-20'
    },
    timelineEvents: [
      { date: '2024-02-01', event: 'Bill Introduced in Senate', description: 'Introduced by Sen. Thorne, citing public demand for reform.', iconType: 'billEvent', actor: 'Sen. Thorne' },
      { date: '2024-02-10', event: 'Referred to Senate Judiciary Committee', iconType: 'billEvent', actor: 'Senate Clerk' },
      { date: '2024-03-01', event: 'Heated Debate in Senate Judiciary Committee Hearing', description: 'Strong opposition from some members citing overreach; strong support from reform advocates.', iconType: 'billEvent', actor: 'Senate Judiciary Committee' },
      { date: '2024-03-15', event: 'Committee Reports Bill with No Recommendation', description: 'Due to deep divisions, committee sends bill to floor without a formal recommendation.', iconType: 'billEvent', actor: 'Senate Judiciary Committee' },
      { date: '2024-04-05', event: 'Intense Floor Debate in Senate', description: 'Multiple filibuster threats from opponents.', iconType: 'billEvent', actor: 'Senate' },
      { date: '2024-04-15', event: 'Narrowly Passed Senate Vote', description: 'Passed 51-49 after lengthy negotiations and minor amendments on term limit clauses.', iconType: 'billEvent', actor: 'Senate' },
      { date: '2024-04-18', event: 'Sent to House', iconType: 'billEvent', actor: 'Senate Clerk' },
      { date: '2024-04-25', event: 'Referred to House Oversight Committee', iconType: 'billEvent', actor: 'House Clerk' },
      { date: '2024-05-10', event: 'House Oversight Committee Hearings Begin', description: 'Significant lobbying efforts reported from groups opposing the independent agency.', iconType: 'billEvent', actor: 'House Oversight Committee' },
      { date: '2024-06-05', event: 'House Oversight Committee Votes Against Bill', description: 'Bill fails to pass committee (15-25).', iconType: 'billEvent', actor: 'House Oversight Committee' },
      { date: '2024-06-20', event: 'Motion to Discharge Bill in House Fails', description: 'Attempt to bring bill to full House vote despite committee rejection fails (180-250). Bill effectively dead.', iconType: 'billEvent', actor: 'House' }
    ],
    committees: ['Senate Judiciary Committee', 'House Oversight Committee'],
    votingResults: {
      senate: { date: '2024-04-15', passed: true, records: [
        { politicianId: 'p1', politicianName: 'Alice Democratia', vote: 'Yea'},
        { politicianId: 'p4', politicianName: 'Senator Evelyn "Evie" Chang', vote: 'Yea'},
        { politicianId: 'p5', politicianName: 'Councilman Marcus "The Maverick" Thorne', vote: 'Yea'}, // as Senator
        { politicianId: 'politician-fictional-senate-1', politicianName: 'Sen. John Doe', vote: 'Nay'},
      ]},
      house: { date: '2024-06-20', passed: false, voteType: 'Motion to Discharge', records: [ // Vote on Motion to Discharge
        { politicianId: 'p1', politicianName: 'Alice Democratia', vote: 'Yea'}, // Assuming Alice is also in house, or this is a generic example
        { politicianId: 'p2', politicianName: 'Bob Republicanus', vote: 'Nay'},
        { politicianId: 'p4', politicianName: 'Senator Evelyn "Evie" Chang', vote: 'Nay'}, // Assuming Rep. role
        { politicianId: 'p5', politicianName: 'Councilman Marcus "The Maverick" Thorne', vote: 'Yea'}, // Assuming Rep. role
      ]}
    },
    lastActionDate: '2024-06-20',
    lastActionDescription: 'Motion to Discharge Bill in House Failed. Bill effectively dead for the session.',
    impact: 'If passed, would have significantly reformed ethics laws and established a powerful anti-corruption body.',
    tags: ['ethics', 'anti-corruption', 'term-limits', 'transparency', 'controversial', 'failed-bill'],
    fullTextUrl: 'https://example.com/s990-final-senate.pdf',
  },
  // Bill 3: Simple & Quick - Fails Early (ID: b5)
  {
    id: 'b5',
    slug: 'commemorative-coin-local-hero-act-2024',
    title: 'Commemorative Coin for Local Hero Act 2024',
    billNumber: 'H.R. 3015',
    summary: 'Authorizes the minting of a commemorative coin in honor of local community hero, Ms. Jane Appleseed.',
    purpose: 'To recognize the outstanding contributions of Ms. Jane Appleseed to her community and preserve her legacy.',
    sponsors: [ { id: 'p2', name: 'Bob Republicanus', type: 'Primary' } ],
    status: 'Failed in Committee' as BillStatus,
    introducedDate: '2024-07-01',
    billType: 'Private Member',
    houseOfIntroduction: 'House',
    parliamentarySession: '3rd Session, 48th Parliament',
    keyDates: {
      introduced: '2024-07-01',
      committeeReferral: '2024-07-02',
    },
    timelineEvents: [
      { date: '2024-07-01', event: 'Bill Introduced in House', description: 'First reading by Rep. Bob Republicanus.', iconType: 'billEvent', actor: 'Rep. Bob Republicanus' },
      { date: '2024-07-02', event: 'Referred to House Committee on Financial Services', iconType: 'billEvent', actor: 'House Clerk' },
      { date: '2024-07-15', event: 'Committee Hearing', description: 'Brief hearing. Concerns raised about the number of commemorative coin bills.', iconType: 'billEvent', actor: 'House Committee on Financial Services' },
      { date: '2024-07-20', event: 'Failed in Committee Vote', description: 'The committee voted against recommending the bill (8-15).', iconType: 'billEvent', actor: 'House Committee on Financial Services' }
    ],
    committees: ['House Committee on Financial Services'],
    lastActionDate: '2024-07-20',
    lastActionDescription: 'Failed to pass in House Committee on Financial Services.',
    impact: 'No direct legislative impact as it failed.',
    tags: ['commemorative', 'local-hero', 'private-member-bill', 'failed-bill'],
    fullTextUrl: 'https://example.com/hr3015-introduced.pdf',
  },
  // Existing b6 and b7, keep them for variety if they don't conflict with new b3,b4,b5
  // For this exercise, I'll assume b6 and b7 are IDs used in politician voting records and should be kept or updated.
  // If they were meant to be replaced by the new b3, b4, b5, that should be specified.
  // For now, I will add the new bills and keep b6, b7 if they are just IDs.
  // The prompt mentioned "Bill 1: Highly Amended & Passed (ID: b3)" - so I will replace existing b3 if it exists.
  // Let's check what b3, b4, b5 were in the original `politicians.ts` voting records.
  // Alice: b3 (National Infrastructure Bond Act), b4 (Universal Healthcare Reform Bill), b5 (Agricultural Subsidy Increase Act)
  // Bob: b3 (National Infrastructure Bond Act)
  // So, my new b3, b4, b5 will overwrite these. I should rename the original b3,b4,b5 in politician voting records or map them.
  // Given the task is to *deepen bills.ts*, I will use new IDs for my new bills and leave existing b3,b4,b5 as they are,
  // unless explicitly told to replace them. The prompt says "ID: b3", "ID: b4", "ID: b5" for new bills, which implies replacement.
  // So I will replace the content of b3, b4, b5 if they exist, or add them if they don't.
  // The current mockBills only has b1, b2. So b3, b4, b5 will be new additions. This is simpler.
];

export function getBillById(id: string): Bill | undefined {
  return mockBills.find(b => b.id === id || b.slug === id);
}

export function getBillsBySponsor(politicianId: string): Bill[] {
  return mockBills.filter(bill =>
    bill.sponsors.some(sponsor => sponsor.id === politicianId)
  );
}

    