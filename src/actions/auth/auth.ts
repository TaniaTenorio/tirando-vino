"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword(formData);

  console.log("--------Login form responseData:----------", data);
  console.log("--------Login form responseError:----------", error);

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

export async function sendRecoveryEmail(formData: { email: string }) {
  const supabase = await createClient();
  console.log("--------Recovery email form data:----------", formData);

  const { error, data } = await supabase.auth.resetPasswordForEmail(
    formData.email,
  );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Correo de recuperación enviado exitosamente. Revisa tu bandeja de entrada.",
    data,
  };
}

export async function updatePassword(formData: { password: string }) {
  const supabase = await createClient();
  console.log("--------Update password form data:----------", formData);

  const { error, data } = await supabase.auth.updateUser({
    password: formData.password,
  });

  if (error) {
    console.log("Error updating password:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Contraseña actualizada exitosamente",
    data,
  };
}
