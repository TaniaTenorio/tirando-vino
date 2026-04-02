const AUTH_MESSAGE_MAP = [
  {
    includes: "Invalid login credentials",
    message: "Correo o contraseña incorrectos.",
  },
  {
    includes: "User not found",
    message: "No se encontró una cuenta con ese correo electrónico.",
  },
  {
    includes: "User already registered",
    message: "Este correo electrónico ya está registrado.",
  },
  {
    includes: "Password should be at least 6 characters",
    message: "La contraseña debe tener al menos 6 caracteres.",
  },
  {
    includes: "Invalid email",
    message: "Por favor ingresa un correo electrónico válido.",
  },
];

export const getAuthMessage = (message, fallbackMessage) => {
  if (!message) {
    return fallbackMessage;
  }

  const normalizedMessage = AUTH_MESSAGE_MAP.find(({ includes }) =>
    message.includes(includes),
  );

  return normalizedMessage?.message ?? fallbackMessage;
};
