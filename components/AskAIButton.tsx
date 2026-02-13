"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleClickAskAIButton = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement your AI functionality here
      // For now, just show a placeholder message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success("AI Assistant", {
        description: "AI features coming soon!",
      });
      
    } catch (error) {
      toast.error("Failed to connect to AI", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleClickAskAIButton}
      variant="default"
      className="gap-2"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span>Ask AI</span>
        </>
      )}
    </Button>
  );
}

export default AskAIButton;