/**
 * 5. PERMISSION SYSTEM (GRANULAR)
 */

export type Action = 'create_entity' | 'edit_entity' | 'delete_entity' | 'publish_entity' | 'manage_modules' | 'manage_users';

interface PermissionMatrix {
  [role: string]: Action[];
}

const ROLES_PERMISSIONS: PermissionMatrix = {
  admin: ['create_entity', 'edit_entity', 'delete_entity', 'publish_entity', 'manage_modules', 'manage_users'],
  editor: ['create_entity', 'edit_entity', 'publish_entity'],
  support: ['edit_entity'],
  product_manager: ['create_entity', 'edit_entity', 'delete_entity']
};

export class PermissionService {
  static can(role: string, action: Action): boolean {
    const permissions = ROLES_PERMISSIONS[role] || [];
    return permissions.includes(action);
  }

  // Dashboard logic: Hide/Disable buttons based on permissions
  static enforce(role: string, action: Action) {
    if (!this.can(role, action)) {
      throw new Error(`Forbidden: Role ${role} cannot perform ${action}`);
    }
  }
}
