import { PageHeader } from '@/components/common/page-header';
import { mockPromises, mockPoliticians } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, User, CalendarClock, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { PromiseStatus, PromiseItem } from '@/types/gov';

function getStatusColor(status: PromiseStatus): string {
  switch (status) {
    case 'Fulfilled': return 'bg-green-500';
    case 'In Progress': return 'bg-blue-500';
    case 'Pending': return 'bg-yellow-500';
    case 'Broken': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function getStatusIcon(status: PromiseStatus) {
  switch (status) {
    case 'Fulfilled': return <CheckCircle className="h-4 w-4 text-green-700" />;
    case 'In Progress': return <RefreshCw className="h-4 w-4 text-blue-700 animate-spin-slow" />;
    case 'Pending': return <CalendarClock className="h-4 w-4 text-yellow-700" />;
    case 'Broken': return <XCircle className="h-4 w-4 text-red-700" />;
    default: return <AlertTriangle className="h-4 w-4 text-gray-700" />;
  }
}


export default function PromisesPage() {
  const promises = mockPromises;

  return (
    <div>
      <PageHeader
        title="Promise Tracker"
        description="Monitor promises made by politicians and their current status."
      />
      {promises.length > 0 ? (
        <div className="space-y-6">
          {promises.map((promise: PromiseItem) => {
            const politician = mockPoliticians.find(p => p.id === promise.politicianId);
            return (
              <Card key={promise.id} id={promise.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline text-xl text-primary mb-1">{promise.title}</CardTitle>
                       {politician && (
                        <Link href={`/politicians/${politician.id}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                          <User className="h-3 w-3"/> {politician.name}
                        </Link>
                      )}
                    </div>
                    <Badge variant="outline" className={`flex items-center gap-1.5 text-sm ${
                        promise.status === 'Fulfilled' ? 'border-green-500 text-green-700 bg-green-50' :
                        promise.status === 'In Progress' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                        promise.status === 'Pending' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                        promise.status === 'Broken' ? 'border-red-500 text-red-700 bg-red-50' :
                        'border-gray-500 text-gray-700 bg-gray-50'
                      }`}>
                      {getStatusIcon(promise.status)}
                      {promise.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-3">{promise.description}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {promise.datePromised && <p>Promised on: {new Date(promise.datePromised).toLocaleDateString()}</p>}
                    {promise.dueDate && <p>Due by: {new Date(promise.dueDate).toLocaleDateString()}</p>}
                    {promise.dateCompleted && <p>Completed on: {new Date(promise.dateCompleted).toLocaleDateString()}</p>}
                    {promise.category && <p>Category: <Badge variant="secondary">{promise.category}</Badge></p>}
                  </div>
                  
                  {promise.evidenceLinks.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold mb-1">Evidence:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {promise.evidenceLinks.map((link, idx) => (
                          <li key={idx} className="text-xs">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                              {link.description || link.url} <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="ghost" size="sm">
                    <Edit className="mr-2 h-3 w-3" /> Suggest Edit
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <p>No promises found.</p>
      )}
    </div>
  );
}
