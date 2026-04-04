/**
 * Feature Flags Utility
 * Toggles major site features based on environment variables.
 */
export const FEATURES = {
  // Blog Module (Future)
  ENABLE_BLOG: process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true',
  
  // Courses Module (Future)
  ENABLE_COURSES: process.env.NEXT_PUBLIC_ENABLE_COURSES === 'true',
};

/**
 * Checks if a feature should be active, considering both the hard-toggle (ENV)
 * and the soft-toggle (Database Settings).
 */
export const isFeatureActive = (featureName: keyof typeof FEATURES, dbToggle?: boolean): boolean => {
  const envEnabled = FEATURES[featureName];
  if (!envEnabled) return false;
  
  // If dbToggle is provided, it must also be true (if env is true)
  if (dbToggle !== undefined) return dbToggle;
  
  return envEnabled;
};
