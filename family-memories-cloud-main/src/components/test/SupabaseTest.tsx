import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase, logQueryError, supabaseUrl, getClientInfo } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupabaseTest = () => {
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Test a simple query to check if Supabase is connected
  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Testing Supabase connection...");
      
      // First, log the Supabase client configuration
      const clientInfo = getClientInfo();
      console.log("Supabase Client Config:", clientInfo);
      
      // Simple query to test the connection
      console.log("Running test query on families table...");
      const { data, error } = await supabase
        .from('families')
        .select('id, name')
        .limit(1);
        
      if (error) {
        console.error("Test query error:", error);
        logQueryError(error, "testConnection", { table: "families" });
        throw error;
      }
      
      console.log("Test query successful:", data);
      setResults({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        clientConfig: clientInfo
      });
      
    } catch (error: any) {
      console.error("Connection test failed:", error);
      setError(error.message || "Unknown error occurred");
      setResults({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Run connection test on component mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-x-2">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Test Connection"}
          </Button>
        </div>
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
            <h3 className="font-semibold">Error</h3>
            <p className="break-all">{error}</p>
          </div>
        )}
        
        {results && (
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-semibold">Results</h3>
            <pre className="text-xs overflow-auto mt-2 p-2 bg-background rounded border">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseTest;
