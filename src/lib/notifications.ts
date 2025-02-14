export const notifications = {
  errors: {
    general: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
    network: "Error de conexión. Verifica tu conexión a internet.",
    auth: {
      invalid: "Correo electrónico o contraseña inválidos",
      exists: "Este correo electrónico ya está registrado",
      required: "Por favor, inicia sesión para continuar",
    },
    data: {
      import: "Error al importar datos. Verifica el formato del archivo.",
      export: "Error al exportar datos. Inténtalo de nuevo.",
      save: "Error al guardar los cambios. Inténtalo de nuevo.",
    },
    ai: {
      config: "Configura tus claves API para usar las funciones de IA",
      request: "Error al procesar la solicitud de IA",
    },
  },
  success: {
    auth: {
      login: "¡Bienvenido de nuevo!",
      register: "¡Cuenta creada exitosamente!",
      logout: "Has cerrado sesión correctamente",
    },
    data: {
      import: "Datos importados correctamente",
      export: "Datos exportados correctamente",
      save: "Cambios guardados correctamente",
    },
    settings: "Configuración actualizada correctamente",
  },
}; 