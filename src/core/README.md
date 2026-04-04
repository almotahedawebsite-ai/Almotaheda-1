# WPaaS Folder Structure (Next.js 14 App Router)

This project follows a modular, clean-architecture approach to support multi-tenancy and dynamic scaling.

## /src/app
The heart of the Next.js App Router. Contains pages, layouts, and route handlers.
- `site/`: Public-facing website pages.
- `dashboard/`: Admin dashboard pages.
- `api/`: Backend API endpoints.

## /src/modules
Feature-based isolation. Each module (e.g., `shop`, `blog`, `courses`) contains its own logic, specific components, and event handlers.
- Encourages extensibility without bloating the core.

## /src/core
Singleton registries, global orchestrators, and system-level logic.
- `events/`: EventBus implementation.
- `registry/`: Module and Block registration.
- `tenant/`: Multi-tenancy detection and context.
- `schema/`: Lazy migration and validation logic.

## /src/infrastructure
External integrations and data persistence implementations.
- `firebase/`: Firestore and Auth configuration.
- `cloudinary/`: Media upload and optimization services.
- `repositories/`: Concrete Firestore repository implementations.

## /src/domain
The "Pure" layer. Contains interfaces, types, and business rules that do not depend on any framework or library.

## /src/presentation
UI components layer.
- `components/`: Reusable atomic components.
- `blocks/`: Dynamic Page Builder blocks.
- `layouts/`: Shared page layouts.

## /src/types
Global TypeScript declarations and shared schema definitions.

## /src/utils
Stateless helper functions and shared utilities.
