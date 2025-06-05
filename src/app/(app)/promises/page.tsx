
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { mockPromises, mockPoliticians, mockParties } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, User, CalendarClock, CheckCircle, XCircle, RefreshCw, AlertTriangle, Building, Users2, Percent, Landmark, CalendarCheck2, Info, Link2, FileText, ArrowRight, History, ClipboardList, SearchIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { PromiseStatus, PromiseItem, PromiseEvidenceLink } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Input } from '@/components/ui/input';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { entitySchemas } from '@/lib/schemas'; // Added
import type { EntityType } from '@/lib/data/suggestions'; // Added
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FilterBar } from '@/components/common/filter-bar';
import { EmptyState } from '@/components/common/empty-state';


function getStatusVisuals(status: PromiseStatus): { icon: React.ReactNode; badgeClass: string; } {
  switch (status) {
    case 'Fulfilled':
      return { icon: <CheckCircle className="h-4 w-4 text-green-700" />, badgeClass: 'border-green-500 text-green-700 bg-green-50' };
    case 'In Progress':
      return { icon: <RefreshCw className="h-4 w-4 text-blue-700 animate-spin-slow" />, badgeClass: 'border-blue-500 text-blue-700 bg-blue-50' };
    case 'Pending':
      return { icon: <CalendarClock className="h-4 w-4 text-yellow-700" />, badgeClass: 'border-yellow-500 text-yellow-700 bg-yellow-50' };
    case 'Broken':
      return { icon: <XCircle className="h-4 w-4 text-red-700" />, badgeClass: 'border-red-500 text-red-700 bg-red-50' };
    case 'Stalled':
      return { icon: <AlertTriangle className="h-4 w-4 text-orange-600" />, badgeClass: 'border-orange-500 text-orange-600 bg-orange-50' };
    case 'Modified':
      return { icon: <Info className="h-4 w-4 text-purple-600" />, badgeClass: 'border-purple-500 text-purple-600 bg-purple-50' };
    case 'Cancelled':
      return { icon: <XCircle className="h-4 w-4 text-slate-600" />, badgeClass: 'border-slate-500 text-slate-600 bg-slate-50' };
    case 'Partially Fulfilled':
      return { icon: <CheckCircle className="h-4 w-4 text-teal-600" />, badgeClass: 'border-teal-500 text-teal-600 bg-teal-50' };
    default:
      return { icon: <AlertTriangle className="h-4 w-4 text-gray-700" />, badgeClass: 'border-gray-500 text-gray-700 bg-gray-50' };
  }
}


export default function PromisesPage() {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isSuggestNewPromiseModalOpen, setIsSuggestNewPromiseModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPromiser, setSelectedPromiser] = useState('');
  const [selectedDeadlineYear, setSelectedDeadlineYear] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filteredPromises, setFilteredPromises] = useState<PromiseItem[]>(mockPromises);

  const allStatuses = useMemo(() => {
    const statuses = new Set<PromiseStatus>();
    mockPromises.forEach(promise => statuses.add(promise.status));
    return Array.from(statuses).sort();
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    mockPromises.forEach(promise => {
      if (promise.category) categories.add(promise.category);
    });
    return Array.from(categories).sort();
  }, []);

  const allPromisers = useMemo(() => {
    const promisersMap = new Map<string, { value: string; label: string }>();
    mockPromises.forEach(promise => {
      if (promise.politicianId) {
        const politician = mockPoliticians.find(p => p.id === promise.politicianId);
        if (politician && !promisersMap.has(`politician-${politician.id}`)) {
          promisersMap.set(`politician-${politician.id}`, {
            value: `politician-${politician.id}`,
            label: `${politician.name} (Politician)`,
          });
        }
      }
      if (promise.partyId) {
        const party = mockParties.find(p => p.id === promise.partyId);
        if (party && !promisersMap.has(`party-${party.id}`)) {
          promisersMap.set(`party-${party.id}`, {
            value: `party-${party.id}`,
            label: `${party.name} (Party)`,
          });
        }
      }
    });
    return Array.from(promisersMap.values()).sort((a,b) => a.label.localeCompare(b.label));
  }, []);

  const allDeadlineYears = useMemo(() => {
    const years = new Set<string>();
    mockPromises.forEach(promise => {
      if (promise.expectedFulfillmentDate) {
        years.add(new Date(promise.expectedFulfillmentDate).getFullYear().toString());
      }
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)); // Sort years descending
  }, []);

  useEffect(() => {
    let updatedPromises = [...mockPromises];

    if (searchTerm) {
      updatedPromises = updatedPromises.filter(promise =>
        promise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promise.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      updatedPromises = updatedPromises.filter(promise => promise.status === selectedStatus);
    }

    if (selectedCategory) {
      updatedPromises = updatedPromises.filter(promise => promise.category === selectedCategory);
    }
    
    if (selectedDeadlineYear) {
      updatedPromises = updatedPromises.filter(promise => {
        if (!promise.expectedFulfillmentDate) return false;
        return new Date(promise.expectedFulfillmentDate).getFullYear().toString() === selectedDeadlineYear;
      });
    }

    if (selectedPromiser) {
      const [type, id] = selectedPromiser.split('-');
      if (type === 'politician') {
        updatedPromises = updatedPromises.filter(p => p.politicianId === id);
      } else if (type === 'party') {
        updatedPromises = updatedPromises.filter(p => p.partyId === id);
      }
    }
    
    const getDateVal = (dateStr: string | undefined, ascending: boolean = true) => {
        if (!dateStr) return ascending ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        return new Date(dateStr).getTime();
    };

    const getSortableLatestUpdateDate = (promise: PromiseItem): number => {
      if (!promise.statusUpdateHistory || promise.statusUpdateHistory.length === 0) {
        return 0; 
      }
      return Math.max(...promise.statusUpdateHistory.map(update => new Date(update.date).getTime()));
    };


    switch (sortOption) {
      case 'deadline_asc':
        updatedPromises.sort((a, b) => getDateVal(a.expectedFulfillmentDate) - getDateVal(b.expectedFulfillmentDate));
        break;
      case 'deadline_desc':
        updatedPromises.sort((a, b) => getDateVal(b.expectedFulfillmentDate, false) - getDateVal(a.expectedFulfillmentDate, false));
        break;
      case 'promised_newest':
        updatedPromises.sort((a, b) => getDateVal(b.datePromised, false) - getDateVal(a.datePromised, false));
        break;
      case 'promised_oldest':
        updatedPromises.sort((a, b) => getDateVal(a.datePromised) - getDateVal(b.datePromised));
        break;
      case 'recently_updated_newest':
        updatedPromises.sort((a, b) => getSortableLatestUpdateDate(b) - getSortableLatestUpdateDate(a));
        break;
      case 'recently_updated_oldest':
        updatedPromises.sort((a, b) => {
          const dateA = getSortableLatestUpdateDate(a);
          const dateB = getSortableLatestUpdateDate(b);
          if (dateA === 0 && dateB !== 0) return -1; 
          if (dateB === 0 && dateA !== 0) return 1;
          if (dateA === 0 && dateB === 0) return 0;
          return dateA - dateB;
        });
        break;
      default: 
        updatedPromises.sort((a,b) => a.id.localeCompare(b.id)); 
        break;
    }

    setFilteredPromises(updatedPromises);
  }, [searchTerm, selectedStatus, selectedCategory, selectedPromiser, selectedDeadlineYear, sortOption]);

  const handleOpenSuggestNewPromiseModal = () => {
    if (isUserLoggedIn()) {
      setIsSuggestNewPromiseModalOpen(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSuggestNewPromiseSubmit = (newEntryData: any) => {
    console.log("New Promise Suggestion:", newEntryData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new promise '${newEntryData.title || 'N/A'}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestNewPromiseModalOpen(false);
  };

  const handleSuggestEdit = (promiseId: string) => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    toast({
      title: `Suggest Edit for Promise: ${promiseId}`,
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  const getPromiserLink = (promise: PromiseItem) => {
    if (promise.politicianId) {
      const politician = mockPoliticians.find(p => p.id === promise.politicianId);
      if (politician) {
        return (
          <Link href={`/politicians/${politician.id}`} className="text-primary hover:underline flex items-center gap-1">
            <User className="h-3.5 w-3.5"/> {politician.name}
          </Link>
        );
      }
    }
    if (promise.partyId) {
      const party = mockParties.find(p => p.id === promise.partyId);
      if (party) {
        return (
          <Link href={`/parties/${party.id}`} className="text-primary hover:underline flex items-center gap-1">
            <Users2 className="h-3.5 w-3.5"/> {party.name}
          </Link>
        );
      }
    }
    return <span className="flex items-center gap-1"><ClipboardList className="h-3.5 w-3.5"/> Unknown Promiser</span>;
  };

  return (
    <div>
      <PageHeader
        title="Promise Tracker"
        description="Monitor promises made by politicians and parties, and their current status."
        actions={
          <Button variant="default" onClick={handleOpenSuggestNewPromiseModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Promise
          </Button>
        }
      />

      <SuggestNewEntryForm
        isOpen={isSuggestNewPromiseModalOpen}
        onOpenChange={setIsSuggestNewPromiseModalOpen}
        entityType={'Promise' as EntityType} // Used EntityType
        entitySchema={entitySchemas.Promise} // Passed the schema
        onSubmit={handleSuggestNewPromiseSubmit}
      />

      <FilterBar title="Filters">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="search-promise">Search Promises</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-promise"
                placeholder="Title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="col-span-full md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div>
              <Label htmlFor="filter-status">Status</Label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value === 'all' ? '' : value)}>
                <SelectTrigger id="filter-status"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {allStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-category">Category</Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                <SelectTrigger id="filter-category"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-promiser">Promiser</Label>
              <Select value={selectedPromiser} onValueChange={(value) => setSelectedPromiser(value === 'all' ? '' : value)}>
                <SelectTrigger id="filter-promiser"><SelectValue placeholder="All Promisers" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Promisers</SelectItem>
                  {allPromisers.map(prom => <SelectItem key={prom.value} value={prom.value}>{prom.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-deadline-year">Deadline Year</Label>
              <Select value={selectedDeadlineYear} onValueChange={(value) => setSelectedDeadlineYear(value === 'all' ? '' : value)}>
                <SelectTrigger id="filter-deadline-year"><SelectValue placeholder="All Years" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {allDeadlineYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="sort-promises">Sort By</Label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sort-promises"><SelectValue placeholder="Default" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="deadline_asc">Deadline (Soonest First)</SelectItem>
                  <SelectItem value="deadline_desc">Deadline (Latest First)</SelectItem>
                  <SelectItem value="promised_newest">Promised (Newest First)</SelectItem>
                  <SelectItem value="promised_oldest">Promised (Oldest First)</SelectItem>
                  <SelectItem value="recently_updated_newest">Recently Updated (Newest)</SelectItem>
                  <SelectItem value="recently_updated_oldest">Recently Updated (Oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </FilterBar>


      {filteredPromises.length > 0 ? (
        <div className="space-y-6">
          {filteredPromises.map((promise: PromiseItem) => {
            const { icon: statusIcon, badgeClass } = getStatusVisuals(promise.status);
            const detailPageUrl = `/promises/${promise.slug || promise.id}`;
            return (
              <Card key={promise.id} id={promise.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <CardTitle className="font-headline text-xl mb-1">
                        <Link href={detailPageUrl} className="text-primary hover:underline">
                          {promise.title}
                        </Link>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <div className="flex items-center gap-1.5">
                           Promised by: {getPromiserLink(promise)}
                        </div>
                         <div className="flex items-center gap-1">Category: <Badge variant="secondary" className="text-xs">{promise.category}{promise.subCategory && ` > ${promise.subCategory}`}</Badge></div>
                         <div className="flex items-center gap-1">Scope: <Badge variant="outline" className="text-xs">{promise.geographicScope}</Badge></div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`flex items-center gap-1.5 text-sm shrink-0 ${badgeClass}`}>
                      {statusIcon}
                      {promise.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4 line-clamp-3 whitespace-pre-line">{promise.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs text-muted-foreground mb-4">
                    {promise.datePromised && <p className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-primary/70"/>Promised: {new Date(promise.datePromised).toLocaleDateString()}</p>}
                    {promise.expectedFulfillmentDate && <p className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-primary/70"/>Due by: {new Date(promise.expectedFulfillmentDate).toLocaleDateString()}</p>}
                    {promise.actualFulfillmentDate && promise.status === 'Fulfilled' && <p className="flex items-center gap-1.5"><CalendarCheck2 className="h-3.5 w-3.5 text-green-600"/>Fulfilled on: {new Date(promise.actualFulfillmentDate).toLocaleDateString()}</p>}
                    {promise.sourceType && <p className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-primary/70"/>Source: {promise.sourceType}{promise.sourceDetails && <span className="text-foreground/60 italic text-[0.7rem]"> ({promise.sourceDetails.substring(0,50)}{promise.sourceDetails.length > 50 ? '...' : ''})</span>}</p>}
                    {promise.responsibleAgency && <p className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-primary/70"/>Responsible: {promise.responsibleAgency}</p>}
                  </div>

                  {promise.fulfillmentPercentage !== undefined && (promise.status === 'In Progress' || promise.status === 'Partially Fulfilled' || promise.status === 'Fulfilled') && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                         <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                           <Percent className="h-3.5 w-3.5 text-primary/70"/> Progress:
                         </p>
                         <span className="text-sm font-semibold text-primary">{promise.fulfillmentPercentage}%</span>
                      </div>
                      <Progress value={promise.fulfillmentPercentage} className="h-2" />
                    </div>
                  )}

                  {promise.reasonForStatus && (promise.status === 'Broken' || promise.status === 'Stalled' || promise.status === 'Modified' || promise.status === 'Cancelled') && (
                    <div className="mb-3 p-2 bg-muted/50 rounded-md">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Info className="h-3.5 w-3.5 text-primary/70"/>Reason for Status:</p>
                      <p className="text-xs text-foreground/70 mt-0.5">{promise.reasonForStatus}</p>
                    </div>
                  )}
                  
                  {promise.evidenceLinks.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><Link2 className="h-4 w-4 text-primary/80"/>Evidence:</h4>
                      <ul className="space-y-1.5">
                        {promise.evidenceLinks.map((link: PromiseEvidenceLink, idx: number) => (
                          <li key={idx} className="text-xs">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              {link.description || link.url}
                              {link.type && <Badge variant="outline" className="ml-2 text-[0.65rem] px-1.5 py-0">{link.type}</Badge>}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSuggestEdit(promise.id)}>
                    <Edit className="mr-2 h-3 w-3" /> Suggest Edit
                  </Button>
                  <Link href={detailPageUrl}>
                    <Button variant="outline" size="sm">View Details <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          IconComponent={ClipboardList}
          title="No Promises Found"
          message="Try adjusting your search or filter criteria."
        />
      )}
    </div>
  );
}
