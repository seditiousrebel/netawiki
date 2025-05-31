
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Flag, FileText, ListChecks, Star } from 'lucide-react'; // Added Star for Featured section
import Image from 'next/image';
import { EntityCard } from '@/components/common/entity-card'; // Added EntityCard
import {
  getPoliticianById,
  getBillById,
  getPartyById,
  getElectionById
} from '@/lib/mock-data'; // Added getter functions

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-headline font-semibold text-primary">
            <ShieldCheck className="h-7 w-7" />
            <span>GovTrackr</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/30">
          <div className="container text-center">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Stay Informed. Hold Them Accountable.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
              GovTrackr helps you follow politicians, parties, bills, and promises, all in one place. 
              Understand political actions and their impact with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/politicians">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">Explore Politicians</Button>
              </Link>
              <Link href="/bills">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Track Bills</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Politician Profiles"
                description="Detailed info, voting records, and political journeys."
                href="/politicians"
              />
              <FeatureCard
                icon={<Flag className="h-10 w-10 text-primary" />}
                title="Party Overviews"
                description="Leadership, history, and ideologies of political parties."
                href="/parties"
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Bill Tracking"
                description="Follow bills from introduction to law with summaries and votes."
                href="/bills"
              />
              <FeatureCard
                icon={<ListChecks className="h-10 w-10 text-primary" />}
                title="Promise Monitoring"
                description="Track promises made by politicians and their current status."
                href="/promises"
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <Star className="h-10 w-10 text-primary" /> Featured Content
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(() => {
                const politician = getPoliticianById('p1'); // Alice Democratia
                const bill = getBillById('b1'); // Clean Energy Act 2024
                const party = getPartyById('party1'); // Blue Unity Party
                const election = getElectionById('e1'); // General Election 2024

                const featuredItems = [];

                if (politician) {
                  featuredItems.push(
                    <EntityCard
                      key={politician.id}
                      id={politician.id}
                      name={politician.name}
                      imageUrl={politician.photoUrl}
                      imageAiHint={politician.dataAiHint || "politician portrait"}
                      description={politician.positions[0]?.title || 'Public Figure'}
                      viewLink={`/politicians/${politician.id}`}
                      category="Politician"
                    />
                  );
                }

                if (bill) {
                  featuredItems.push(
                    <EntityCard
                      key={bill.id}
                      id={bill.id}
                      name={bill.title}
                      // imageUrl="https://placehold.co/600x400/0284c7/white?text=Bill" // Generic placeholder
                      imageAiHint="legislative document icon"
                      description={bill.summary.substring(0, 70) + '...'}
                      viewLink={`/bills/${bill.id}`}
                      category="Bill"
                    />
                  );
                }

                if (party) {
                  featuredItems.push(
                    <EntityCard
                      key={party.id}
                      id={party.id}
                      name={party.name}
                      imageUrl={party.logoUrl}
                      imageAiHint={party.dataAiHint || "party logo"}
                      description={party.ideology?.join(', ') || 'Political Party'}
                      viewLink={`/parties/${party.id}`}
                      category="Party"
                    />
                  );
                }

                if (election) {
                  featuredItems.push(
                    <EntityCard
                      key={election.id}
                      id={election.id}
                      name={election.name}
                      // imageUrl="https://placehold.co/600x400/16a34a/white?text=Election" // Generic placeholder
                      imageAiHint="election ballot box icon"
                      description={`${election.electionType} - ${new Date(election.date).toLocaleDateString()}`}
                      viewLink={`/elections/${election.id}`}
                      category="Election"
                    />
                  );
                }
                return featuredItems;
              })()}
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-20 bg-secondary/30">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Powered by Your Input</h2>
              <p className="text-lg text-foreground/80 mb-6">
                Our platform thrives on community contributions. Suggest edits, add information, and help us build the most comprehensive political tracker.
              </p>
              <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Get Involved
              </Button>
            </div>
            <div>
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Community collaboration" 
                width={600} 
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="collaboration community"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-background">
        <div className="container text-center text-foreground/70">
          <p>&copy; {new Date().getFullYear()} GovTrackr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  const cardContent = (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }
  return cardContent;
}
