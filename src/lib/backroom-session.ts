import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { DECOY_HASH, verifyPassword } from "./password";
import { supabase, supabaseConfigured, type AdminRow } from "./supabase";

// The backroom's sign-in: accounts in the `admins` table (email + scrypt password hash, created by
// `npm run db:seed`) and a stateless session cookie, `<admin id>.<expires>.<hmac>`, signed with
// AUTH_SECRET over the account's password hash. Changing a password or deleting the account signs
// that person out everywhere. The cookie is http-only and scoped to /backroom.
//
// requireAdmin() is the security boundary: every backroom page, data read and server action calls
// it (a layout check alone would not cover the actions, which are public POST endpoints).

const COOKIE = "ree-backroom";
const HOURS = 12;

export type Admin = Pick<AdminRow, "id" | "email" | "name">;

export function backroomSetup() {
  return {
    supabase: supabaseConfigured(),
    secret: (process.env.AUTH_SECRET?.length ?? 0) >= 32,
  };
}

function sign(adminId: string, expires: number, passwordHash: string) {
  return createHmac("sha256", process.env.AUTH_SECRET!).update(`backroom:${adminId}:${expires}:${passwordHash}`).digest("base64url");
}

async function findAdmin(column: "id" | "email", value: string): Promise<AdminRow | null> {
  const { data, error } = await supabase().from("admins").select("*").eq(column, value).maybeSingle();
  if (error) throw new Error(`Could not read accounts: ${error.message}`);
  return data as AdminRow | null;
}

// The account for this email and password, or null. A wrong email costs the same scrypt work as a
// wrong password, so the answer's timing does not tell which one was wrong.
export async function checkCredentials(email: string, password: string): Promise<AdminRow | null> {
  const admin = await findAdmin("email", email.trim().toLowerCase());
  const ok = await verifyPassword(password, admin?.password_hash ?? DECOY_HASH);
  return admin && ok ? admin : null;
}

export async function startSession(admin: AdminRow) {
  const expires = Date.now() + HOURS * 3_600_000;
  (await cookies()).set(COOKIE, `${admin.id}.${expires}.${sign(admin.id, expires, admin.password_hash)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/backroom",
    expires: new Date(expires),
  });
  await supabase().from("admins").update({ last_login_at: new Date().toISOString() }).eq("id", admin.id);
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/backroom" });
}

// The signed-in account, or null. Reads the cookie before anything else: that is what makes every
// backroom page render per request (checking the env first let the build freeze them as static).
export const currentAdmin = cache(async (): Promise<Admin | null> => {
  const value = (await cookies()).get(COOKIE)?.value;
  const setup = backroomSetup();
  if (!value || !setup.supabase || !setup.secret) return null;
  const [adminId, stamp, signature] = value.split(".");
  const expires = Number(stamp);
  if (!adminId || !signature || !/^[0-9a-f-]{36}$/i.test(adminId) || !Number.isFinite(expires) || expires < Date.now()) return null;
  const admin = await findAdmin("id", adminId);
  if (!admin) return null;
  const expected = Buffer.from(sign(admin.id, expires, admin.password_hash));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return { id: admin.id, email: admin.email, name: admin.name };
});

export const requireAdmin = cache(async (): Promise<Admin> => {
  const admin = await currentAdmin();
  if (!admin) redirect("/backroom/login");
  return admin;
});
