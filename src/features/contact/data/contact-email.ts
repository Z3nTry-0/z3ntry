export const contactEmailHref = "mailto:contact@z3ntry.com";

export function buildContactDraft(name: string, email: string, message: string): string {
  const subject = encodeURIComponent("Consulta para Z3nTry");
  const body = [message.trim(), "", `Nombre: ${name.trim()}`, `Correo: ${email.trim()}`]
    .join("\n").replace(/\r\n?|\n/g, "\r\n");
  return `${contactEmailHref}?subject=${subject}&body=${encodeURIComponent(body)}`;
}
