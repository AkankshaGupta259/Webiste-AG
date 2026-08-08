import { cookies } from "next/headers";

/** Name of the httpOnly cookie holding the admin JWT. */
export const TOKEN_COOKIE = "personal_token";

/** Read the admin token from the request cookies (server-side only). */
export async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}
