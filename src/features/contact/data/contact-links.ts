const instagramHandle = import.meta.env.PUBLIC_INSTAGRAM_HANDLE?.trim().replace(/^@/, "");

const handle = instagramHandle && /^[\w.]{1,30}$/.test(instagramHandle) ? instagramHandle : "z3n_try";
export const instagram = { href: `https://www.instagram.com/${handle}/` };
