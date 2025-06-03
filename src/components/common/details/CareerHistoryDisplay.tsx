import React, { memo } from 'react'; // Import memo
import { Briefcase } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CareerRecord {
  id?: string; // Optional ID for stable keys
  title: string;
  organization?: string;
  startDate: string; // Expecting ISO date string or a parsable date string
  endDate?: string; // Can be 'Present' or a date string
}

interface CareerHistoryDisplayProps {
  careerHistory?: CareerRecord[];
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        // If parsing failed, it might be a year-only string or other format
        // For simplicity, return as is if not a full valid date
        // More robust parsing might be needed for various input date formats
        return dateString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Fallback to original string in case of error
  }
};

const CareerHistoryDisplay: React.FC<CareerHistoryDisplayProps> = ({ careerHistory }) => {
  if (!careerHistory || careerHistory.length === 0) {
    return null; // Render nothing if there is no career history
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" /> Positions Held
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {careerHistory.map((job, idx) => (
            <li key={job.id || idx} className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-semibold text-base">{job.title}</p>
                {job.organization && (
                  <p className="text-muted-foreground">{job.organization}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(job.startDate)} – {job.endDate === 'Present' ? 'Present' : formatDate(job.endDate)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default memo(CareerHistoryDisplay);
