import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  console.log(
    "Creating Supabase client with URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
