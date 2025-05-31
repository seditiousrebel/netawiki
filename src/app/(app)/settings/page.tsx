
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCog, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, notifications, and preferences."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><UserCog className="text-primary h-5 w-5"/> Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Update your profile information and password.</p>
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Bell className="text-primary h-5 w-5"/> Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Configure your notification preferences.</p>
            <Button variant="outline">Manage Notifications</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Palette className="text-primary h-5 w-5"/> Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Customize the look and feel of the app.</p>
            {/* Theme toggle can be added here later */}
            <Button variant="outline" disabled>Toggle Dark Mode (Coming Soon)</Button>
          </CardContent>
        </Card>

         <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">Followed Entities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Manage politicians and parties you follow.</p>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline">Manage Followed Politicians</Button>
                <Button variant="outline">Manage Followed Parties</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
