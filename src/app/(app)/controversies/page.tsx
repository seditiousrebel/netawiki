
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { mockControversies } from '@/lib/mock-data'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, Edit, SearchIcon, PlusCircle } from 'lucide-react';
import type { Controversy, InvolvedEntity } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { entitySchemas } from '@/lib/schemas'; // Ensured import
import type { EntityType } from '@/lib/data/suggestions'; // Ensured import
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns'; // Added import for format

type SeverityIndicator = Controversy['severityIndicator'];
type ControversyStatus = Controversy['status'];

const severityOrder: SeverityIndicator[] = ['Critical', 'High', 'Medium', 'Low'];

function getSeverityBadgeVariant(severity: SeverityIndicator) {
  switch (severity) {
    case 'Critical':
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary'; 
    case 'Low':
    default:
      return 'outline';
  }
}

export default function ControversiesPage() {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const router = useRouter();
  const [isSuggestNewControversyModalOpen, setIsSuggestNewControversyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityIndicator | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ControversyStatus | ''>('');
  const [sortOption, setSortOption] = useState('date_desc'); // Default sort: newest first
  const [filteredControversies, setFilteredControversies] = useState<Controversy[]>(mockControversies);

  const allSeverities = useMemo(() => {
    const severities = new Set<SeverityIndicator>();
    mockControversies.forEach(controversy => severities.add(controversy.severityIndicator));
    return Array.from(severities).sort((a, b) => severityOrder.indexOf(a) - severityOrder.indexOf(b));
  }, []);

  const allStatuses = useMemo(() => {
    const statuses = new Set<ControversyStatus>();
    mockControversies.forEach(controversy => statuses.add(controversy.status));
    return Array.from(statuses).sort();
  }, []);

  useEffect(() => {
    let updatedControversies = [...mockControversies];

    // Search term filter
    if (searchTerm) {
      updatedControversies = updatedControversies.filter(controversy =>
        controversy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        controversy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        controversy.involvedEntities.some(entity => entity.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Severity filter
    if (selectedSeverity) {
      updatedControversies = updatedControversies.filter(controversy => controversy.severityIndicator === selectedSeverity);
    }

    // Status filter
    if (selectedStatus) {
      updatedControversies = updatedControversies.filter(controversy => controversy.status === selectedStatus);
    }
    
    // Apply sorting
    const getDateVal = (dateStr: string | undefined, ascending: boolean = true): number => {
        if (!dateStr) return ascending ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        return new Date(dateStr).getTime();
    };

    switch (sortOption) {
      case 'date_desc':
        updatedControversies.sort((a, b) => getDateVal(b.dates?.started, false) - getDateVal(a.dates?.started, false));
        break;
      case 'date_asc':
        updatedControversies.sort((a, b) => getDateVal(a.dates?.started) - getDateVal(b.dates?.started));
        break;
      case 'severity_desc':
        updatedControversies.sort((a, b) => severityOrder.indexOf(a.severityIndicator) - severityOrder.indexOf(b.severityIndicator));
        break;
      case 'severity_asc':
        updatedControversies.sort((a, b) => severityOrder.indexOf(b.severityIndicator) - severityOrder.indexOf(a.severityIndicator));
        break;
      default:
        updatedControversies.sort((a, b) => getDateVal(b.dates?.started, false) - getDateVal(a.dates?.started, false));
        break;
    }

    setFilteredControversies(updatedControversies);
  }, [searchTerm, selectedSeverity, selectedStatus, sortOption]);

  const handleOpenSuggestNewControversyModal = () => {
    if (isUserLoggedIn()) {
      setIsSuggestNewControversyModalOpen(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSuggestNewControversySubmit = (newEntryData: any) => {
    console.log("New Controversy Suggestion:", newEntryData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new controversy '${newEntryData.title || 'N/A'}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestNewControversyModalOpen(false);
  };

  const handleSuggestEdit = () => {
    if (!isUserLoggedIn()) {
      router.push('/auth/login');
      return;
    }
    toast({
      title: "Suggest Edit Feature",
      description: "This functionality is under development. Approved suggestions will update the content. You can see mock suggestions being managed on the /admin/suggestions page.",
      duration: 6000,
    });
  };

  return (
    <div>
      <PageHeader
        title="Controversies Tracker"
        description="Follow major political controversies, their status, and involved entities."
        actions={
          <Button variant="default" onClick={handleOpenSuggestNewControversyModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Controversy
          </Button>
        }
      />

      {isSuggestNewControversyModalOpen && entitySchemas.Controversy && ( // Added check for entitySchemas.Controversy
        <SuggestNewEntryForm
            isOpen={isSuggestNewControversyModalOpen}
            onOpenChange={setIsSuggestNewControversyModalOpen}
            entityType={'Controversy' as EntityType}
            entitySchema={entitySchemas.Controversy} 
            onSubmit={handleSuggestNewControversySubmit}
        />
      )}


      <Card className="mb-8 p-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2 md:col-span-4">
            <Label htmlFor="search-controversy">Search Controversies</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-controversy"
                placeholder="Title, description, or involved entity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="filter-severity">Severity</Label>
            <Select value={selectedSeverity} onValueChange={(value) => setSelectedSeverity(value === 'all' ? '' : value as SeverityIndicator)}>
              <SelectTrigger id="filter-severity"><SelectValue placeholder="Filter by severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {allSeverities.map(severity => (
                  <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value === 'all' ? '' : value as ControversyStatus)}>
              <SelectTrigger id="filter-status"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {allStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full sm:col-span-1 md:col-span-2">
            <Label htmlFor="sort-controversies">Sort By</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort-controversies"><SelectValue placeholder="Sort by..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date Started (Newest First)</SelectItem>
                <SelectItem value="date_asc">Date Started (Oldest First)</SelectItem>
                <SelectItem value="severity_desc">Severity (Critical First)</SelectItem>
                <SelectItem value="severity_asc">Severity (Low First)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredControversies.length > 0 ? (
        <div className="space-y-6">
          {filteredControversies.map((controversy: Controversy) => (
            <Card key={controversy.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl mb-1">
                      <Link href={`/controversies/${controversy.slug || controversy.id}`} className="text-primary hover:underline">
                        {controversy.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Status: <Badge variant={controversy.status === 'Proven' || controversy.status === 'Legal Action Initiated' ? 'destructive' : 'secondary'}>{controversy.status}</Badge>
                      {controversy.dates?.started && ` | Started: ${format(new Date(controversy.dates.started), 'MM/dd/yyyy')}`}
                    </CardDescription>
                  </div>
                  <Badge variant={getSeverityBadgeVariant(controversy.severityIndicator)}>
                    Severity: {controversy.severityIndicator}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-3 line-clamp-3">{controversy.description}</p>
                {controversy.involvedEntities.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Key Involved: {controversy.involvedEntities.map(e => e.name).slice(0,3).join(', ')}{controversy.involvedEntities.length > 3 ? '...' : ''}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                 <Button variant="ghost" size="sm" onClick={handleSuggestEdit}>
                  <Edit className="mr-2 h-3 w-3" /> Suggest Edit
                </Button>
                <Link href={`/controversies/${controversy.slug || controversy.id}`}>
                  <Button variant="outline" size="sm">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No controversies found.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria, or it's all quiet on the political front... for now.</p>
        </div>
      )}
    </div>
  );
}


      