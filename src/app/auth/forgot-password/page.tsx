"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle forgot password logic
    alert("Password reset functionality not implemented yet.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-xl">
         <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-headline font-semibold text-primary mx-auto mb-2">
            <ShieldCheck className="h-8 w-8" />
            <span>GovTrackr</span>
          </Link>
          <CardTitle className="font-headline text-2xl">Forgot Your Password?</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Send Reset Link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <Link href="/auth/login">
            <Button variant="link" className="p-0 h-auto text-primary flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Log In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
