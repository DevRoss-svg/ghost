/*
import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
function signUpPage(){
    return(
        <div className="mt-20 flex flex-col items-center">
            <Card className="w-full max-w-md">
                <CardHeader className="mb-4">
                    <CardTitle className="text-center text-3xl">
                        Sign-up
                    </CardTitle>
                </CardHeader>
                <AuthForm type ="signup"/>
            </Card>
        </div>
    )
}
export default signUpPage;
*/
import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

function SignUpPage() {
  return (
    <div className="mt-20 flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">
            Sign Up
          </CardTitle>
        </CardHeader>

        {/* NEW AuthForm WITH WORKING SUPABASE INTEGRATION */}
        <AuthForm type="signup" />
      </Card>
    </div>
  );
}

export default SignUpPage;
