# Viaja Agencia - Plataforma Web

Rediseno completo de la pagina web de Viaja Agencia (viajaagencia.com.mx). Agencia de viajes premium con mas de 20 anos de experiencia en Leon, Guanajuato.

## Tech Stack

- **Next.js 15** (App Router, TypeScript, Turbopack)
- **Tailwind CSS 4** + Design tokens custom
- **Framer Motion** - Animaciones y transiciones
- **Supabase** - Base de datos, autenticacion, storage
- **Lucide React** - Iconografia SVG

## Inicio Rapido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de produccion
npm run build
```

El sitio estara disponible en `http://localhost:3000`.

## Estructura del Proyecto

```
src/
  app/
    (public)/          # Paginas publicas (homepage, destinos, paquetes, etc.)
    admin/             # Panel administrativo (login, CRUD pages)
    api/               # API routes (hotels, tours, cars, contact, newsletter)
  components/
    layout/            # Navbar, Footer, WhatsApp button
    home/              # Secciones del homepage
    search/            # Componentes de busqueda
    admin/             # Componentes del admin panel
    ui/                # Componentes UI reutilizables
  lib/
    supabase/          # Clientes de Supabase (browser, server, middleware, types)
    services/          # Service layer (Hotelbeds, Juniper, types)
    utils/             # Utilidades (cn, format)
    data/              # Mock data para desarrollo
```

## Configuracion de Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Copiar `.env.example` a `.env.local` y llenar las credenciales
3. Ejecutar el schema SQL en el SQL Editor de Supabase:
   - `supabase/migrations/001_initial_schema.sql` (tablas + RLS + storage)
   - `supabase/seed.sql` (datos iniciales)
4. Crear un usuario admin en Authentication > Users

## Panel Administrativo

Acceder a `/admin` para gestionar contenido:

- **Promociones** - Ofertas y paquetes destacados
- **Paquetes** - Paquetes de viaje con itinerarios
- **Destinos** - 12 regiones del mundo
- **Testimonios** - Resenas de clientes
- **Viajes Grupales** - Trips grupales con disponibilidad
- **Eventos** - Bodas, lunas de miel, corporativos
- **Blog** - Posts con editor de contenido
- **FAQ** - Preguntas frecuentes
- **Configuracion** - Datos de la empresa

## Integraciones API (Pendientes)

### Bedsonline / Hotelbeds
- Service layer preparado en `src/lib/services/hotelbeds.ts`
- Auth: SHA256 signature
- Portal: developer.hotelbeds.com
- Feature flag: `USE_LIVE_HOTELBEDS=true` en `.env`

### Naturleon / Juniper
- Service layer preparado en `src/lib/services/juniper.ts`
- Workflow: Static Data > Availability > Valuation > Booking
- Portal: api-edocs.ejuniper.com
- Feature flag: `USE_LIVE_JUNIPER=true` en `.env`

## Despliegue

Optimizado para Vercel:

```bash
# Conectar con Vercel
npx vercel

# Deploy produccion
npx vercel --prod
```

Variables de entorno necesarias en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
