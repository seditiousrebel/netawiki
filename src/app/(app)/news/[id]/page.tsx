
"use client";

import React from 'react';
import { getNewsArticleByIdOrSlug, getPoliticianById, getPartyById, getBillById, getPromiseById, getControversyById, getElectionById } from '@/lib/mock-data';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, CalendarDays, UserCircle, Tag, Link as LinkIcon, CheckSquare, ShieldQuestion, Newspaper, ArrowLeft, Users, Flag, FileText, ListChecks, VoteIcon, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

export default function NewsArticlePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const article = getNewsArticleByIdOrSlug(params.id);
  const { toast } = useToast();

  if (!article) {
    return (
      <div className="text-center py-10">
        <Newspaper className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-xl font-semibold">Article Not Found</p>
        <p className="text-muted-foreground">The article you are looking for does not exist or may have been removed.</p>
        <Link href="/news" className="mt-6 inline-block">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to News List
          </Button>
        </Link>
      </div>
    );
  }

  const renderTaggedEntities = () => {
    const entities: React.ReactNode[] = [];

    article.taggedPoliticianIds?.forEach(id => {
      const politician = getPoliticianById(id);
      if (politician) entities.push(
        <Link key={`pol-${id}`} href={`/politicians/${politician.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <UserCircle className="h-4 w-4" /> {politician.name}
        </Link>
      );
    });
    article.taggedPartyIds?.forEach(id => {
      const party = getPartyById(id);
      if (party) entities.push(
        <Link key={`party-${id}`} href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <Flag className="h-4 w-4" /> {party.name}
        </Link>
      );
    });
     article.taggedBillIds?.forEach(id => {
      const bill = getBillById(id);
      if (bill) entities.push(
        <Link key={`bill-${id}`} href={`/bills/${bill.slug || bill.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <FileText className="h-4 w-4" /> {bill.title} ({bill.billNumber})
        </Link>
      );
    });
    article.taggedPromiseIds?.forEach(id => {
      const promise = getPromiseById(id);
      if (promise) entities.push(
        <Link key={`promise-${id}`} href={`/promises/${promise.slug || promise.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <ListChecks className="h-4 w-4" /> {promise.title}
        </Link>
      );
    });
    article.taggedControversyIds?.forEach(id => {
      const controversy = getControversyById(id);
      if (controversy) entities.push(
        <Link key={`controversy-${id}`} href={`/controversies/${controversy.slug || controversy.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <ShieldAlert className="h-4 w-4" /> {controversy.title}
        </Link>
      );
    });
    article.taggedElectionIds?.forEach(id => {
      const election = getElectionById(id);
      if (election) entities.push(
        <Link key={`election-${id}`} href={`/elections/${election.slug || election.id}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
          <VoteIcon className="h-4 w-4" /> {election.name}
        </Link>
      );
    });

    return entities.length > 0 ? (
      <div className="space-y-1.5">
        {entities.map((entity, index) => <div key={index}>{entity}</div>)}
      </div>
    ) : <p className="text-sm text-muted-foreground">No specific entities tagged.</p>;
  };


  return (
    <div>
      <PageHeader
        title={article.title}
        description={
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            {article.authorName && <span className="flex items-center gap-1.5"><UserCircle className="h-4 w-4"/>By {article.authorName}</span>}
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/>Published: {format(new Date(article.publicationDate), 'MMMM dd, yyyy')}</span>
            <span className="flex items-center gap-1.5"><Newspaper className="h-4 w-4"/>Source: {article.sourceName}</span>
          </div>
        }
        actions={
            article.isAggregated && article.url ? (
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="flex items-center gap-2">
                        View Original Article <ExternalLink className="h-4 w-4" />
                    </Button>
                </a>
            ) : (
                 <Link href="/news">
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to News
                    </Button>
                </Link>
            )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {article.dataAiHint && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`https://placehold.co/800x400.png`} // Placeholder
                alt={article.title}
                width={800}
                height={400}
                className="w-full object-cover"
                data-ai-hint={article.dataAiHint}
              />
            </div>
          )}

          {article.isFactCheck && (
            <Card className="bg-yellow-50 border-yellow-300 shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-yellow-700 flex items-center gap-2">
                  <CheckSquare className="h-6 w-6"/> GovTrackr Fact Check
                </CardTitle>
              </CardHeader>
              {article.summary && <CardContent><p className="text-yellow-800 italic">{article.summary}</p></CardContent>}
            </Card>
          )}

          {article.fullContent ? (
            <Card>
              <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                {/* Using dangerouslySetInnerHTML for mock HTML content. In a real app, use a proper Markdown/HTML renderer. */}
                <div dangerouslySetInnerHTML={{ __html: article.fullContent.replace(/\n/g, '<br />') }} />
              </CardContent>
            </Card>
          ) : article.isAggregated && article.summary ? (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Summary from {article.sourceName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 whitespace-pre-line">{article.summary}</p>
                    {article.url && (
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                            <Button variant="link" className="p-0 h-auto text-primary items-center">
                                Read full article on {article.sourceName} <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                        </a>
                    )}
                </CardContent>
            </Card>
          ) : (
            <p className="text-muted-foreground">Full article content not available for this aggregated link. Please refer to the original source.</p>
          )}

          {/* Placeholder for Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Comments & Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">(Comments feature coming soon.)</p>
              {/* Future: Add Textarea for new comment and list existing comments */}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary"/> Article Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {article.category && (
                <div className="text-sm">
                  <strong>Category:</strong> <Badge variant="secondary">{article.category}</Badge>
                </div>
              )}
              {article.topics && article.topics.length > 0 && (
                <div className="text-sm">
                  <strong>Topics:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {article.topics.map(topic => <Badge key={topic} variant="outline">{topic}</Badge>)}
                  </div>
                </div>
               )}
               {article.isFactCheck && (
                <div className="text-sm flex items-center gap-1 font-medium text-yellow-700">
                  <CheckSquare className="h-4 w-4"/> This is a Fact-Check article.
                </div>
              )}
               {article.isAggregated && (
                <div className="text-sm flex items-center gap-1">
                  <ShieldQuestion className="h-4 w-4"/> This article is aggregated from an external source.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary"/> Related Entities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTaggedEntities()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
