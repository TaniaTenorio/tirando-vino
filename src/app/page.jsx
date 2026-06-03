import React from "react";
import HomeClient from "./components/HomeClient";
import { getHomeData } from "@/lib/supabase/helpers";

export default async function Home() {
  const { wines, merch } = await getHomeData();

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
