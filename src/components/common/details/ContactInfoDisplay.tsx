import { Mail, Phone, Globe, Twitter, Facebook, Linkedin, Instagram, Building, Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ContactInfo {
  email?: string;
  phone?: string;
  officePhone?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

interface ContactInfoDisplayProps {
  contactInfo: ContactInfo;
}

const ContactInfoDisplay: React.FC<ContactInfoDisplayProps> = ({ contactInfo }) => {
  const socialMediaUsername = (url: string | undefined, platform: string): string => {
    if (!url) return `${platform} Profile`;
    try {
      const parsedUrl = new URL(url);
      let username = parsedUrl.pathname.split('/').pop();
      if (username) {
        // Remove potential query params or fragments from username
        username = username.split('?')[0].split('#')[0];
        if (username.startsWith('@')) {
          return username;
        }
        return `@${username}`;
      }
    } catch (error) {
      console.error(`Error parsing ${platform} URL:`, error);
    }
    return `${platform} Profile`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contactInfo.email && (
          <p className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={`mailto:${contactInfo.email}`} className="hover:underline truncate" target="_blank" rel="noopener noreferrer">
              {contactInfo.email}
            </a>
          </p>
        )}
        {contactInfo.phone && (
          <p className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={`tel:${contactInfo.phone}`} className="hover:underline truncate">
              {contactInfo.phone}
            </a>
          </p>
        )}
        {contactInfo.officePhone && (
          <p className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={`tel:${contactInfo.officePhone}`} className="hover:underline truncate">
              {contactInfo.officePhone} (Office)
            </a>
          </p>
        )}
        {contactInfo.permanentAddress && (
          <p className="flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{contactInfo.permanentAddress} (Permanent)</span>
          </p>
        )}
        {contactInfo.temporaryAddress && (
          <p className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-primary flex-shrink-0" /> {/* Using Building icon for temporary office/address as well */}
            <span className="truncate">{contactInfo.temporaryAddress} (Temporary)</span>
          </p>
        )}
        {contactInfo.website && (
          <p className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {contactInfo.website}
            </a>
          </p>
        )}
        {contactInfo.twitter && (
          <p className="flex items-center gap-2 text-sm">
            <Twitter className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {socialMediaUsername(contactInfo.twitter, 'Twitter')}
            </a>
          </p>
        )}
        {contactInfo.facebook && (
          <p className="flex items-center gap-2 text-sm">
            <Facebook className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {socialMediaUsername(contactInfo.facebook, 'Facebook')}
            </a>
          </p>
        )}
        {contactInfo.linkedin && (
          <p className="flex items-center gap-2 text-sm">
            <Linkedin className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {socialMediaUsername(contactInfo.linkedin, 'LinkedIn')}
            </a>
          </p>
        )}
        {contactInfo.instagram && (
          <p className="flex items-center gap-2 text-sm">
            <Instagram className="h-4 w-4 text-primary flex-shrink-0" />
            <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {socialMediaUsername(contactInfo.instagram, 'Instagram')}
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactInfoDisplay;
