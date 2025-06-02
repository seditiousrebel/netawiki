
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/common/page-header';
import { getAllNewsArticles } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight, FileText, ExternalLink, SearchIcon, CheckSquare, ShieldQuestion, Bookmark, BookmarkCheck } from 'lucide-react'; // Added Bookmark, BookmarkCheck
import type { NewsArticleLink, NewsArticleCategory } from '@/types/gov';
import { format } from 'date-fns';
// Removed duplicate import: import { Button } from '@/components/ui/button'; 
import { PlusCircle } from 'lucide-react'; 
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form'; 
import { entitySchemas } from '@/lib/schemas'; 
import type { EntityType } from '@/lib/data/suggestions'; 
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth'; 
import { useRouter } from 'next/navigation'; 
import { useToast } from "@/hooks/use-toast"; 

const LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY = 'govtrackr_bookmarked_articles';

export default function NewsPage() {
  const router = useRouter(); 
  const { toast } = useToast(); 
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false); 
  const [articles, setArticles] = useState<NewsArticleLink[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticleLink[]>([]);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsArticleCategory | ''>('');
  const [sortOption, setSortOption] = useState('date_desc');

  useEffect(() => {
    setArticles(getAllNewsArticles());
    try {
      const bookmarkedArticlesStr = localStorage.getItem(LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY);
      if (bookmarkedArticlesStr) {
        setBookmarkedArticleIds(JSON.parse(bookmarkedArticlesStr));
      }
    } catch (error) {
      console.error("Error reading bookmarked articles from localStorage:", error);
      // Optionally, clear corrupted data or show a toast
    }
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set<NewsArticleCategory>();
    articles.forEach(article => {
      if (article.category) categories.add(article.category);
    });
    return Array.from(categories).sort();
  }, [articles]);

  useEffect(() => {
    let tempArticles = [...articles];

    if (searchTerm) {
      tempArticles = tempArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.topics?.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      tempArticles = tempArticles.filter(article => article.category === selectedCategory);
    }

    switch (sortOption) {
      case 'date_asc':
        tempArticles.sort((a, b) => new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime());
        break;
      case 'title_asc':
        tempArticles.sort((a,b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        tempArticles.sort((a,b) => b.title.localeCompare(a.title));
        break;
      case 'date_desc':
      default:
        tempArticles.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        break;
    }
    setFilteredArticles(tempArticles);
  }, [articles, searchTerm, selectedCategory, sortOption]);

  const handleOpenSuggestModal = () => { 
    if (isUserLoggedIn()) {
      setIsSuggestModalOpen(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSuggestSubmit = (formData: any) => { 
    console.log('New News Suggestion:', formData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new news article '${formData.title || 'N/A'}' submitted.`,
    });
    setIsSuggestModalOpen(false);
  };

  const handleBookmarkToggle = (articleId: string, articleTitle: string) => {
    const newBookmarkedIds = bookmarkedArticleIds.includes(articleId)
      ? bookmarkedArticleIds.filter(id => id !== articleId)
      : [...bookmarkedArticleIds, articleId];
    
    setBookmarkedArticleIds(newBookmarkedIds);

    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKED_ARTICLES_KEY, JSON.stringify(newBookmarkedIds));
      toast({
        title: bookmarkedArticleIds.includes(articleId) ? `Bookmark Removed` : `Article Bookmarked`,
        description: bookmarkedArticleIds.includes(articleId) 
          ? `"${articleTitle.substring(0,30)}..." removed from bookmarks.`
          : `"${articleTitle.substring(0,30)}..." added to bookmarks.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating bookmarked articles in localStorage:", error);
      toast({
        title: "Could not update bookmark",
        description: "There was an issue saving your bookmark preference. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      // Revert state if localStorage fails
      setBookmarkedArticleIds(bookmarkedArticleIds);
    }
  };

  return (
    <div>
      <PageHeader
        title="News & Articles"
        description="Stay updated with the latest political news, analyses, and fact-checks."
        actions={ 
          <Button variant="default" onClick={handleOpenSuggestModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Article
          </Button>
        }
      />

      {isSuggestModalOpen && entitySchemas.News && ( 
        <SuggestNewEntryForm
          isOpen={isSuggestModalOpen}
          onOpenChange={setIsSuggestModalOpen}
          entityType={'News' as EntityType}
          entitySchema={entitySchemas.News}
          onSubmit={handleSuggestSubmit}
        />
      )}

      <Card className="mb-8 p-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="search-news">Search News</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-news"
                placeholder="Title, summary, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="filter-category">Category</Label>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value as NewsArticleCategory)}>
              <SelectTrigger id="filter-category"><SelectValue placeholder="Filter by category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sort-news">Sort By</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort-news"><SelectValue placeholder="Sort by..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (Newest First)</SelectItem>
                <SelectItem value="date_asc">Date (Oldest First)</SelectItem>
                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredArticles.length > 0 ? (
        <div className="space-y-6">
          {filteredArticles.map(article => (
            <Card key={article.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col sm:flex-row">
              {article.dataAiHint && (
                 <div className="sm:w-1/4 md:w-1/5 lg:w-1/6 flex-shrink-0">
                    <Image
                        src={`https://placehold.co/300x200.png`} 
                        alt={article.title}
                        width={300}
                        height={200}
                        className="object-cover w-full h-48 sm:h-full rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                        data-ai-hint={article.dataAiHint}
                    />
                 </div>
              )}
              <div className="flex flex-col flex-grow">
                <CardHeader className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-1.5">
                        {article.category && <Badge variant="secondary">{article.category}</Badge>}
                        {article.isFactCheck && <Badge variant="destructive" className="bg-yellow-500 text-black hover:bg-yellow-600"><CheckSquare className="mr-1 h-3 w-3"/>Fact Check</Badge>}
                        {article.isAggregated && <Badge variant="outline">Aggregated</Badge>}
                    </div>
                  <CardTitle className="font-headline text-xl">
                    {article.isAggregated && article.url ? (
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {article.title} <ExternalLink className="inline-block h-4 w-4 ml-1" />
                      </a>
                    ) : (
                      <Link href={`/news/${article.slug || article.id}`} className="text-primary hover:underline">
                        {article.title}
                      </Link>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {article.sourceName} &bull; {format(new Date(article.publicationDate), 'MMMM dd, yyyy')}
                    {article.authorName && ` &bull; By ${article.authorName}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4 flex-grow">
                  {article.summary && <p className="text-foreground/80 line-clamp-3 mb-2">{article.summary}</p>}
                  {article.topics && article.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {article.topics.map(topic => <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>)}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmarkToggle(article.id, article.title)}
                    aria-label={bookmarkedArticleIds.includes(article.id) ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    {bookmarkedArticleIds.includes(article.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  {!article.isAggregated && (
                    <Link href={`/news/${article.slug || article.id}`} className="ml-auto">
                      <Button variant="outline" size="sm">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No news articles found.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria, or check back later for new content.</p>
        </div>
      )}
    </div>
  );
}
