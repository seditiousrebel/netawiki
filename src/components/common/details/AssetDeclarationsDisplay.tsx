import React, { memo } from 'react'; // Import memo
import { ScrollText, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AssetDeclarationItem {
  id?: string; // Optional ID for stable keys
  description: string;
  year: string | number;
  value?: string;
  sourceUrl?: string;
}

interface AssetDeclarationsDisplayProps {
  assetDeclarations?: AssetDeclarationItem[];
}

const AssetDeclarationsDisplay: React.FC<AssetDeclarationsDisplayProps> = ({ assetDeclarations }) => {
  if (!assetDeclarations || assetDeclarations.length === 0) {
    return null; // Render nothing if there are no asset declarations
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" /> Asset Declarations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {assetDeclarations.map((asset, idx) => (
            <li 
              key={asset.id || idx} 
              className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-base">
                  {asset.description} <span className="text-muted-foreground font-normal">({asset.year})</span>
                </p>
                {asset.value && (
                  <p className="text-muted-foreground mt-0.5">Value: {asset.value}</p>
                )}
                {asset.sourceUrl && (
                  <a 
                    href={asset.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline text-xs flex items-center gap-1 mt-1"
                  >
                    View Source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default memo(AssetDeclarationsDisplay);
