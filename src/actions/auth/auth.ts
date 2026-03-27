"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "User logged in successfully",
    data,
  };
}

export async function signup(formData: {
  name: string;
  email: string;
  password: string;
}) {
  const supabase = await createClient();
  console.log("--------Signup form data:----------", formData);

  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "User signed up successfully",
    data,
  };
}
