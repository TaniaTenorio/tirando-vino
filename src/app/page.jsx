import React from "react";
import HomeClient from "./components/HomeClient";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: wines = [] }, { data: merch = [] }] = await Promise.all([
    supabase
      .from("wines")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("merch")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  const winesData = wines.map((item) => ({
    ...item,
    imageURL: item.image || null,
  }));

  const merchData = merch.map((item) => ({
    ...item,
    imageURL: item.image || null,
  }));

  return <HomeClient winesData={winesData} merchData={merchData} />;
}
