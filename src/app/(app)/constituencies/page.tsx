
"use client";

import React, { useState, useEffect, useMemo } from 'react'; // Added useState, useEffect, useMemo
import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { getAllConstituencies, getPoliticianById } from '@/lib/mock-data';
import type { Constituency, ConstituencyType, Politician } from '@/types/gov';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Search, ArrowRight, Building, Globe, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { SuggestNewEntryForm } from '@/components/common/suggest-new-entry-form';
import { getCurrentUser, isUserLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function ConstituenciesPage() {
  const currentUser = getCurrentUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSuggestNewConstituencyModalOpen, setIsSuggestNewConstituencyModalOpen] = useState(false);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [filteredConstituencies, setFilteredConstituencies] = useState<Constituency[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ConstituencyType | ''>('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');

  useEffect(() => {
    setConstituencies(getAllConstituencies());
  }, []);

  const constituencyTypes = useMemo(() => 
    Array.from(new Set(constituencies.map(c => c.type))).sort() as ConstituencyType[], 
  [constituencies]);

  const constituencyProvinces = useMemo(() => 
    Array.from(new Set(constituencies.map(c => c.province))).sort(), 
  [constituencies]);

  useEffect(() => {
    let tempConstituencies = [...constituencies];

    if (searchTerm) {
      tempConstituencies = tempConstituencies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      tempConstituencies = tempConstituencies.filter(c => c.type === selectedType);
    }

    if (selectedProvince) {
      tempConstituencies = tempConstituencies.filter(c => c.province === selectedProvince);
    }
    
    switch (sortOption) {
      case 'name_asc':
        tempConstituencies.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        tempConstituencies.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'population_desc':
        tempConstituencies.sort((a, b) => (b.population || 0) - (a.population || 0));
        break;
      case 'population_asc':
        tempConstituencies.sort((a, b) => (a.population || 0) - (b.population || 0));
        break;
      default:
        break;
    }

    setFilteredConstituencies(tempConstituencies);
  }, [constituencies, searchTerm, selectedType, selectedProvince, sortOption]);
  
  const getRepresentativeDisplay = (ids?: string[], names?: string[]): React.ReactNode => {
    if (!ids || ids.length === 0) return 'N/A';
    return (names || ids).slice(0, 2).map((nameOrId, index) => {
      const id = ids[index];
      const name = names?.[index] || nameOrId;
      const politician = getPoliticianById(id);
      return (
        <React.Fragment key={id}>
          {politician ? (
            <Link href={`/politicians/${politician.id}`} className="text-primary hover:underline">
              {name}
            </Link>
          ) : (
            <span>{name}</span>
          )}
          {index < (names || ids).slice(0, 2).length - 1 && ', '}
        </React.Fragment>
      );
    });
  };


    setFilteredConstituencies(tempConstituencies);
  }, [constituencies, searchTerm, selectedType, selectedProvince, sortOption]);

  const getRepresentativeDisplay = (ids?: string[], names?: string[]): React.ReactNode => {
    if (!ids || ids.length === 0) return 'N/A';
    return (names || ids).slice(0, 2).map((nameOrId, index) => {
      const id = ids[index];
      const name = names?.[index] || nameOrId;
      const politician = getPoliticianById(id);
      return (
        <React.Fragment key={id}>
          {politician ? (
            <Link href={`/politicians/${politician.id}`} className="text-primary hover:underline">
              {name}
            </Link>
          ) : (
            <span>{name}</span>
          )}
          {index < (names || ids).slice(0, 2).length - 1 && ', '}
        </React.Fragment>
      );
    });
  };

  const handleOpenSuggestNewConstituencyModal = () => {
    if (isUserLoggedIn()) {
      setIsSuggestNewConstituencyModalOpen(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleSuggestNewConstituencySubmit = (newEntryData: any) => {
    console.log("New Constituency Suggestion:", newEntryData);
    toast({
      title: "Suggestion Submitted",
      description: `Suggestion for new constituency '${newEntryData.name || 'N/A'}' submitted for review.`,
      duration: 5000,
    });
    setIsSuggestNewConstituencyModalOpen(false);
  };


  return (
    <div>
      <PageHeader
        title="Constituencies Explorer"
        description="Discover federal, provincial, and local constituencies across the nation."
        actions={
          <Button variant="default" onClick={handleOpenSuggestNewConstituencyModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Suggest New Constituency
          </Button>
        }
      />

      <SuggestNewEntryForm
        isOpen={isSuggestNewConstituencyModalOpen}
        onOpenChange={setIsSuggestNewConstituencyModalOpen}
        entityType="Constituency"
        onSubmit={handleSuggestNewConstituencySubmit}
      />

      <Card className="mb-8 p-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-full md:col-span-1">
            <Label htmlFor="search-constituency">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-constituency"
                placeholder="Name, district, province..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="col-span-full md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="filter-type">Type</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value === 'all' ? '' : value as ConstituencyType)}>
                <SelectTrigger id="filter-type"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {constituencyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-province">Province</Label>
              <Select value={selectedProvince} onValueChange={(value) => setSelectedProvince(value === 'all' ? '' : value)}>
                <SelectTrigger id="filter-province"><SelectValue placeholder="All Provinces" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {constituencyProvinces.map(prov => <SelectItem key={prov} value={prov}>{prov}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort-constituencies">Sort By</Label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sort-constituencies"><SelectValue placeholder="Sort by..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="population_desc">Population (High-Low)</SelectItem>
                  <SelectItem value="population_asc">Population (Low-High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {filteredConstituencies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConstituencies.map((constituency) => (
            <Card key={constituency.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                {constituency.dataAiHint && (
                  <div className="mb-3 aspect-[16/9] overflow-hidden rounded-md">
                    <Image 
                      src={`https://placehold.co/400x225.png`} 
                      alt={constituency.name} 
                      width={400} height={225} 
                      className="object-cover w-full h-full"
                      data-ai-hint={constituency.dataAiHint} 
                    />
                  </div>
                )}
                <CardTitle className="font-headline text-xl text-primary">
                  <Link href={`/constituencies/${constituency.slug || constituency.id}`}>
                    {constituency.name} {constituency.code && `(${constituency.code})`}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm -mt-1">{constituency.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm flex-grow">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{constituency.district}, {constituency.province}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Rep(s): {getRepresentativeDisplay(constituency.currentRepresentativeIds, constituency.currentRepresentativeNames)}</span>
                </div>
                {constituency.population && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Building className="h-4 w-4" /> Population: {constituency.population.toLocaleString()}
                  </div>
                )}
                 {constituency.registeredVoters && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                     <Globe className="h-4 w-4" /> Voters: {constituency.registeredVoters.toLocaleString()}
                  </div>
                )}
                {constituency.tags && constituency.tags.length > 0 && (
                  <div className="pt-2">
                    {constituency.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-xs">{tag}</Badge>)}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/constituencies/${constituency.slug || constituency.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No constituencies found.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}

    
