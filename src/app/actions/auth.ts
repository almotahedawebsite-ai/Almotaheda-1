'use server';

/**
 * Returns the list of all super admin emails (from environment variables).
 * These users have full access and cannot be deleted.
 */
export async function getSuperAdminEmails(): Promise<string[]> {
  const emails: string[] = [];
  const primary = process.env.SUPER_ADMIN_EMAIL;
  const secondary = process.env.SUPER_ADMIN_EMAIL_2;
  if (primary) emails.push(primary.toLowerCase());
  if (secondary) emails.push(secondary.toLowerCase());
  return emails;
}

/**
 * Server Action to securely verify if an email is a Super Admin.
 * Does not expose super admin emails to the client bundle.
 */
export async function isSuperAdminEmail(email: string): Promise<boolean> {
  const superAdmins = await getSuperAdminEmails();
  return superAdmins.includes(email.toLowerCase());
}

/**
 * Server Action to securely fetch the primary Super Admin email.
 * Should only be called from protected dashboard pages.
 */
export async function getSuperAdminEmail(): Promise<string> {
  return process.env.SUPER_ADMIN_EMAIL || '';
}
