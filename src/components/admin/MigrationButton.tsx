import React from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { runCategoryIdMigration } from "@/services/productService";
import { toast } from "@/components/ui/sonner";

export const MigrationButton: React.FC = () => {
  const { getClient } = useSupabase();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleMigration = async () => {
    try {
      setIsLoading(true);
      const client = await getClient();
      await runCategoryIdMigration(client);
    } catch (error) {
      console.error("Error running migration:", error);
      toast.error("Failed to run migration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMigration}
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? "Running Migration..." : "Run Category ID Migration"}
    </Button>
  );
};
