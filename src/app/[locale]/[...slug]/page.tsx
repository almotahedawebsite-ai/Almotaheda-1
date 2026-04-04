import { notFound } from 'next/navigation';
import { adminDb } from '@/infrastructure/firebase/admin';
import { ServerBaseRepository } from '@/infrastructure/repositories/server/ServerBaseRepository';
import { ServerEntityRepository } from '@/infrastructure/repositories/server/ServerEntityRepository';
import { EntityRenderer } from '@/presentation/components/EntityRenderer';
import { EntityTypesConfig } from '@/config/entityTypes';
import { ServerSettingsRepository } from '@/infrastructure/repositories/server/ServerSettingsRepository';

export default async function DynamicEntityPage({ 
  params 
}: { 
  params: Promise<{ locale: string, slug: string[] }> 
}) {

  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  const slugPath = slug.join('/');

  const repo = new ServerSettingsRepository();
  const settings = await repo.getGlobalSettings();

  const slugRepo = new ServerBaseRepository<any>(adminDb, 'slugs');
  const slugInfo = await slugRepo.find([
    { field: 'id', operator: '==', value: slugPath }
  ]);

  if (slugInfo.length === 0) return notFound();

  const { targetId } = slugInfo[0];

  const entityRepo = new ServerEntityRepository();
  const entity = await entityRepo.getById(targetId);

  if (!entity) return notFound();

  const typeDef = EntityTypesConfig.find(t => t.id === entity.type) || { id: entity.type, label: entity.type, fields: [] };

  return (
    <main className="min-h-screen bg-gray-50">
      <EntityRenderer entity={entity} typeDefinition={typeDef} locale={locale} />
    </main>
  );
}

