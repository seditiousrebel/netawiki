import React, { memo } from 'react'; // Import memo
import { ScrollText, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Import Button

interface AssetDeclarationItem {
  id: string; // ID is now mandatory for edit/delete
  description: string;
  year: string | number;
  value?: string;
  sourceUrl?: string;
}

interface AssetDeclarationsDisplayProps {
  assetDeclarations?: AssetDeclarationItem[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
}

const AssetDeclarationsDisplay: React.FC<AssetDeclarationsDisplayProps> = ({ assetDeclarations, onEditItem, onDeleteItem }) => {
  if (!assetDeclarations || assetDeclarations.length === 0) {
    // Return a message if there are no assets, especially if edit/delete capabilities are present
    // This part can be enhanced to show an "Add Asset" prompt if appropriate in the context it's used.
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" /> Asset Declarations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No asset declarations available.</p>
        </CardContent>
      </Card>
    );
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
              key={asset.id} // Use mandatory ID for key
              className="text-sm border-b border-border pb-3 last:border-b-0 last:pb-0 flex justify-between items-start"
            >
              <div className="flex-grow">
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
              {(onEditItem || onDeleteItem) && (
                <div className="ml-4 flex-shrink-0 space-x-2 self-center">
                  {onEditItem && (
                    <Button variant="outline" size="iconXs" onClick={() => onEditItem(asset.id)}>
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {onDeleteItem && (
                    <Button variant="destructive" size="iconXs" onClick={() => onDeleteItem(asset.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default memo(AssetDeclarationsDisplay);
