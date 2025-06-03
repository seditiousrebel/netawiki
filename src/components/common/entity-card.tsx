import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React, { memo } from 'react'; // Import memo

interface EntityCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  imageAiHint?: string;
  description?: string;
  viewLink: string;
  category?: string;
}

// Original component function (renamed to avoid conflict, or could be anonymous in memo)
const EntityCardComponent: React.FC<EntityCardProps> = ({ id, name, imageUrl, imageAiHint, description, viewLink, category }) => {
  // Determine the image source explicitly
  const imageToDisplay = (typeof imageUrl === 'string' && imageUrl.trim() !== '')
    ? imageUrl
    : 'https://placehold.co/400x250.png?text=No+Image';

  // Adjust data-ai-hint if a placeholder is being used
  const effectiveAiHint = (typeof imageUrl === 'string' && imageUrl.trim() !== '')
    ? (imageAiHint || "profile image")
    : (imageAiHint || "placeholder image");

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <Image
          src={imageToDisplay}
          alt={name}
          width={400}
          height={250}
          className="object-cover w-full h-48"
          data-ai-hint={effectiveAiHint}
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        {category && <p className="text-sm text-primary font-medium mb-1">{category}</p>}
        <CardTitle className="font-headline text-xl mb-2">{name}</CardTitle>
        {description && <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={viewLink} className="w-full">
          <Button variant="outline" className="w-full">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Export the memoized version
export const EntityCard = memo(EntityCardComponent);
