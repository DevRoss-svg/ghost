"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AuthType = "login" | "signup";

type Props = {
  type: AuthType;
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShowVerificationMessage(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) return;

    startTransition(async () => {
      const supabase = createClient();

      if (isLoginForm) {
        // Login
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          if (authError.message.includes('Email not confirmed')) {
            setError('Please verify your email before logging in. Check your inbox for the verification link.');
          } else {
            setError(authError.message);
          }
          return;
        }

        // Login successful - redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        // Sign up
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (authError) {
          setError(authError.message);
          return;
        }

        // Show verification message
        setUserEmail(email);
        setShowVerificationMessage(true);
      }
    });
  };

  // Verification pending message
  if (showVerificationMessage) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-full bg-blue-100 p-3">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          
          <p className="text-muted-foreground mb-4">
            We've sent a verification link to:
          </p>
          
          <p className="font-semibold text-lg mb-4">{userEmail}</p>
          
          <div className="bg-muted p-4 rounded-lg text-sm text-left w-full max-w-md">
            <p className="font-semibold mb-2">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your email inbox</li>
              <li>Click the verification link we sent</li>
              <li>You'll be redirected to the dashboard</li>
            </ol>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Didn't receive the email? Check your spam folder</span>
          </div>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowVerificationMessage(false)}
          >
            Back to sign up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>

      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>

        <p className="text-sm text-muted-foreground">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`font-medium text-primary underline-offset-4 hover:underline ${
              isPending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isLoginForm ? "Sign up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;