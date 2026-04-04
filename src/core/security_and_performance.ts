/**
 * 7. SECURITY (FIREBASE RULES)
 * 
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Helper: Check if user has a specific role
 *     function hasRole(role) {
 *       return request.auth != null && request.auth.token.role == role;
 *     }
 * 
 *     // Public Access: Allow reading published content
 *     match /entities/{entity} {
 *       allow read: if resource.data.status == 'published';
 *       allow write: if hasRole('admin') || hasRole('editor');
 *     }
 * 
 *     // Admin Only: Dashboard Config & Types
 *     match /types/{type} {
 *       allow read: if true;
 *       allow write: if hasRole('admin');
 *     }
 * 
 *     match /configs/{config} {
 *       allow read, write: if hasRole('admin');
 *     }
 *   }
 * }
 */

/**
 * 6. PERFORMANCE STRATEGY
 * 
 * - ISR (Incremental Static Regeneration): Use revalidate: 60 in getStaticProps for high traffic.
 * - Caching: Firestore queries are cached locally by Firebase SDK.
 * - CDN: Vercel/Next.js automatically edge-caches the rendered HTML/JSON.
 * - Scaling: 1M products is handled by Firestore's automatic horizontal scaling.
 */
