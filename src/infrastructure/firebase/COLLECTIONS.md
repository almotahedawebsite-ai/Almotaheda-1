# MVP Firestore Collections Structure

## /tenants
Minimal configuration for each site.
```json
{
  "id": "tenant_1",
  "name": "My Pro Site",
  "domain": "site1.localhost:3000",
  "settings": { "theme": "dark" }
}
```

## /entities
The actual content (products, posts, etc.).
```json
{
  "id": "ent_abc123",
  "tenantId": "tenant_1",
  "type": "products",
  "slug": "iphone-15",
  "title": "iPhone 15 Pro",
  "customFields": [
    { "fieldId": "price", "value": 999 },
    { "fieldId": "color", "value": "Titanium" }
  ],
  "createdAt": "2026-03-15T..."
}
```

## /entityTypes
Definitions for dynamic fields.
```json
{
  "id": "products",
  "tenantId": "tenant_1",
  "label": "Products",
  "fields": [
    { "id": "price", "label": "Price", "type": "number" },
    { "id": "color", "label": "Color", "type": "text" }
  ]
}
```

## /slugs
URL lookup table for fast resolution.
```json
{
  "id": "iphone-15",
  "tenantId": "tenant_1",
  "targetId": "ent_abc123",
  "targetType": "entity"
}
```
