'use server';

/**
 * Server Action to securely verify if an email is the Super Admin.
 * Does not expose the super admin email to the client bundle.
 */
export async function isSuperAdminEmail(email: string): Promise<boolean> {
  const superAdmin = process.env.SUPER_ADMIN_EMAIL;
  if (!superAdmin) return false;
  return email.toLowerCase() === superAdmin.toLowerCase();
}

/**
 * Server Action to securely fetch the Super Admin email.
 * Should only be called from protected dashboard pages.
 */
export async function getSuperAdminEmail(): Promise<string> {
  return process.env.SUPER_ADMIN_EMAIL || '';
}
