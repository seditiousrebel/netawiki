
"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import React, { useState } from 'react'; // Added useState
import { useRouter } from 'next/navigation'; // Added useRouter
import { useToast } from "@/hooks/use-toast"; // Added useToast
import { simulateLoginByEmail } from '@/lib/auth'; // Added simulateLoginByEmail
import { cn } from '@/lib/utils'; // Added missing import

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (simulateLoginByEmail(email)) {
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to your feed...",
        duration: 3000,
      });
      router.push('/feed');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password (mock). Please try one of the test accounts: seditiousrebel@gmail.com or bhup0004@gmail.com (password: sachinn1)",
        variant: "destructive",
        duration: 6000,
      });
      setIsLoading(false);
    }
    // No need to setIsLoading(false) on success because of redirect.
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-headline font-semibold text-primary mx-auto mb-2">
            <ShieldCheck className="h-8 w-8" />
            <span>GovTrackr</span>
          </Link>
          <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your personalized feed and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="•••••••• (sachinn1)" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <Link href="/auth/forgot-password">
            <Button variant="link" className="p-0 h-auto text-primary" disabled={isLoading}>Forgot password?</Button>
          </Link>
          <p className="mt-4 text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className={cn("font-medium text-primary hover:underline", isLoading && "pointer-events-none opacity-50")}>
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
