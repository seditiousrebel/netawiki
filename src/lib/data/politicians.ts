
import type { Politician } from '@/types/gov';

export const mockPoliticians: Politician[] = [
  {
    id: 'p1',
    name: 'Alice Democratia',
    partyId: 'party1',
    partyName: 'Blue Unity Party',
    positions: [{ title: 'Senator', startDate: '2020-01-15' }],
    contactInfo: { 
      email: 'alice@example.com', 
      website: 'https://alice.example.com',
      twitter: 'https://twitter.com/AliceDemocratia',
      facebook: 'https://facebook.com/AliceDemocratia',
      linkedin: 'https://linkedin.com/in/AliceDemocratia'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2010-05-01', event: 'Elected City Councilor' },
      { date: '2015-11-03', event: 'Elected Mayor' },
      { date: '2020-01-15', event: 'Sworn in as Senator' },
    ],
    bio: 'Alice Democratia is a dedicated public servant with over a decade of experience in governance, championing transparency and citizen engagement.',
    district: 'Statewide',
    dateOfBirth: '1975-03-12',
    gender: 'Female',
    education: [
      { institution: 'State University', degree: 'M.A.', field: 'Public Administration', graduationYear: '2005' },
      { institution: 'City College', degree: 'B.A.', field: 'Political Science', graduationYear: '2002' },
    ],
  },
  {
    id: 'p2',
    name: 'Bob Republicanus',
    partyId: 'party2',
    partyName: 'Red Alliance Group',
    positions: [{ title: 'Representative', startDate: '2018-01-20' }],
    contactInfo: { 
      email: 'bob@example.com', 
      website: 'https://bob.example.com',
      twitter: 'https://twitter.com/BobRepub',
      instagram: 'https://instagram.com/BobRepubOfficial'
    },
    photoUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'politician portrait',
    politicalJourney: [
      { date: '2012-08-10', event: 'Founded local business association' },
      { date: '2018-01-20', event: 'Elected as Representative' },
    ],
    bio: 'Bob Republicanus brings a strong business background to his role, focusing on economic growth and fiscal responsibility.',
    district: '5th Congressional District',
    dateOfBirth: '1980-09-25',
    gender: 'Male',
    education: [
      { institution: 'Commerce Institute', degree: 'MBA', field: 'Business Administration', graduationYear: '2008' },
      { institution: 'Tech College', degree: 'B.S.', field: 'Economics', graduationYear: '2005' },
    ],
  },
];

export function getPoliticianById(id: string): Politician | undefined {
  return mockPoliticians.find(p => p.id === id);
}
