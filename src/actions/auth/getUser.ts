"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@/interfaces/user";

export const getUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user: session },
    } = await supabase.auth.getUser();

    if (!session) {
      return null;
    }

    const userId = session.id;

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
