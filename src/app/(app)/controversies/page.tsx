
"use client";

import { PageHeader } from '@/components/common/page-header';
import { mockControversies, getControversyById } from '@/lib/mock-data'; // Assuming mock-data exports this
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, Edit } from 'lucide-react';
import type { Controversy } from '@/types/gov';
import { useToast } from "@/hooks/use-toast";

function getSeverityBadgeVariant(severity: Controversy['severityIndicator']) {
  switch (severity) {
    case 'Critical':
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary'; // Or 'warning' if you add such a variant
    case 'Low':
    default:
      return 'outline';
  }
}

export default function ControversiesPage() {
  const controversies = mockControversies;
  const { toast } = useToast();

  const handleSuggestEdit = () => {
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
      />
      {controversies.length > 0 ? (
        <div className="space-y-6">
          {controversies.map((controversy: Controversy) => (
            <Card key={controversy.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl mb-1">
                      <Link href={`/controversies/${controversy.id}`} className="text-primary hover:underline">
                        {controversy.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Status: <Badge variant={controversy.status === 'Proven' || controversy.status === 'Legal Action Initiated' ? 'destructive' : 'secondary'}>{controversy.status}</Badge>
                      {controversy.dates?.started && ` | Started: ${new Date(controversy.dates.started).toLocaleDateString()}`}
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
                    Key Involved: {controversy.involvedEntities.map(e => e.name).join(', ')}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                 <Button variant="ghost" size="sm" onClick={handleSuggestEdit}>
                  <Edit className="mr-2 h-3 w-3" /> Suggest Edit
                </Button>
                <Link href={`/controversies/${controversy.id}`}>
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
          <p className="text-sm text-muted-foreground">It's all quiet on the political front... for now.</p>
        </div>
      )}
    </div>
  );
}
