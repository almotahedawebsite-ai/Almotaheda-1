/**
 * 10. FINAL DEVELOPER GUIDE
 * 
 * Workflow for adding new features:
 * 
 * --- 1. Create a New Module ---
 * 1. Create directory: /src/modules/my_feature
 * 2. Create index.ts:
 *    export const initMyFeature = () => {
 *      registry.register({
 *        name: 'my_feature',
 *        entityTypes: [{ type: 'item', fields: [...] }],
 *        blocks: [{ type: 'grid', component: MyGrid }]
 *      });
 *    };
 * 
 * --- 2. Add a New Page Builder Block ---
 * 1. Create component: /src/presentation/components/blocks/MyNewBlock.tsx
 * 2. Add to BLOCK_COMPONENTS in BlockFactory.tsx:
 *    'my_new_block': dynamic(() => import('./MyNewBlock'))
 * 
 * --- 3. Add a New Entity Type ---
 * 1. Open Admin Dashboard.
 * 2. Create new Entity Definition (saved to Firestore /types).
 * 3. NO CODE CHANGES REQUIRED.
 * 
 * --- 4. Subscribing to Events ---
 * 1. In module init():
 *    eventBus.subscribe('entity.created', async (data) => {
 *      // Custom logic for your module
 *    });
 */

export const DeveloperGuide = "See instructions above for extending the WPaaS platform.";
