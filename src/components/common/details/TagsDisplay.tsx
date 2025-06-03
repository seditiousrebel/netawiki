import React, { memo } from 'react'; // Import memo
import Link from 'next/link';
import { Tag as TagIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TagsDisplayProps {
  tags?: string[];
}

const TagsDisplay: React.FC<TagsDisplayProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null; // Render nothing if there are no tags
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-primary" /> Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`} passHref legacyBehavior>
            <Badge variant="secondary" className="hover:bg-primary/20 transition-colors cursor-pointer">
              {tag}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default memo(TagsDisplay);
