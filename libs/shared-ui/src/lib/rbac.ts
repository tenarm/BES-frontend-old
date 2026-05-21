/**
 * Type representing the nested RBAC structure:
 * module -> resource -> action -> boolean
 */
export type NestedPermissions = Record<string, Record<string, Record<string, boolean>>>;

/**
 * Safely checks if a user has a specific permission in a nested structure.
 */
export function checkPermission(
  permissions: NestedPermissions | null | undefined,
  path: string
): boolean {
  // Handle wildcards or special paths immediately
  if (path === '*' || path === 'home:*:*:*') return true;
  
  if (!permissions) return false;

  const parts = path.split(':');
  // Handle both 3-part (mod:res:act) and 4-part (mod:res:*:act) formats
  const module = parts[0];
  const resource = parts[1];
  const action = parts[parts.length - 1];
  
  if (!module || !resource || !action) return false;

  return !!permissions[module]?.[resource]?.[action];
}

// Global License Checker hook registration to prevent monorepo circular imports
let isModuleLicensedFn: (moduleName: string) => boolean = () => true;

/**
 * Registers the global licensing evaluation callback.
 * Typically invoked by the main Shell application on startup.
 */
export function setLicenseChecker(checker: (moduleName: string) => boolean) {
  isModuleLicensedFn = checker;
}

/**
 * React hook to verify if a specific extension module is licensed.
 */
export function useFeatureLicense(moduleName: string): boolean {
  return isModuleLicensedFn(moduleName.toLowerCase());
}

