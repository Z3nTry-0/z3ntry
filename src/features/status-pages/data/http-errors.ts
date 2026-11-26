export const httpErrors = {
  400: {
    title: "Solicitud no válida",
    description: "Revisa la dirección o vuelve al inicio.",
  },
  404: {
    title: "Página no encontrada",
    description: "La página que buscas no existe o cambió de dirección.",
  },
  429: {
    title: "Demasiadas solicitudes",
    description: "Espera un momento antes de volver a intentarlo.",
  },
  500: {
    title: "Error del servidor",
    description: "No pudimos cargar esta página. Inténtalo más tarde.",
  },
  502: {
    title: "Respuesta no válida",
    description: "Un servicio no respondió como esperábamos. Inténtalo más tarde.",
  },
  503: {
    title: "Servicio no disponible",
    description: "El servicio no está disponible en este momento. Inténtalo más tarde.",
  },
  504: {
    title: "Tiempo de espera agotado",
    description: "Un servicio tardó demasiado en responder. Inténtalo más tarde.",
  },
} as const;
