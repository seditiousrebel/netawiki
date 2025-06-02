import { GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface EducationRecord {
  id?: string; // Optional ID for key if available, otherwise use index
  degree: string;
  field?: string;
  institution: string;
  graduationYear?: string | number;
}

interface EducationHistoryDisplayProps {
  educationHistory?: EducationRecord[];
}

const EducationHistoryDisplay: React.FC<EducationHistoryDisplayProps> = ({ educationHistory }) => {
  if (!educationHistory || educationHistory.length === 0) {
    return null; // Render nothing if there is no education history
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" /> Education
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {educationHistory.map((edu, idx) => (
            <li key={edu.id || idx} className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-semibold text-base">
                  {edu.degree}
                  {edu.field && <span className="text-muted-foreground font-normal"> in {edu.field}</span>}
                </p>
                <p className="text-muted-foreground">{edu.institution}</p>
                {edu.graduationYear && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Graduated: {edu.graduationYear}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EducationHistoryDisplay;
