# Mocks - Datos de Prueba

Este directorio contiene archivos para generar datos mock (de prueba) para poblar la base de datos durante el desarrollo.

## Archivos

- **`people.mock.js`**: Genera datos mock de personas (naturales y empresas)
- **`trials.mock.js`**: Genera datos mock de procesos judiciales
- **`actions.mock.js`**: Genera datos mock de actuaciones
- **`seed.js`**: Script principal que ejecuta todos los mocks y pobla la base de datos

## Uso

### Ejecutar el seed completo

```bash
npm run seed
```

O directamente:

```bash
node mocks/seed.js
```

### Usar mocks individuales

```javascript
import { generatePeopleMocks } from './mocks/people.mock.js';
import { generateTrialsMocks } from './mocks/trials.mock.js';
import { generateActionsMocks } from './mocks/actions.mock.js';

// Generar 20 personas
const people = generatePeopleMocks(20);

// Generar 30 procesos (requiere personas, tipos de proceso, categorías y tipos de entrada)
const trials = generateTrialsMocks(people, typeTrials, categories, entryTypes, 30);

// Generar 50 actuaciones (requiere procesos y descripciones de actuación)
const actions = generateActionsMocks(trials, descriptionActions, 50);
```

## Requisitos Previos

Antes de ejecutar el seed, asegúrate de que la base de datos tenga:

1. **Tipos de Proceso** (`type_trials`): Al menos uno
2. **Tipos de Entrada** (`entry_types`): Al menos uno
3. **Descripciones de Actuación** (`description_actions`): **Requerido** - Al menos una descripción de actuación debe existir en la base de datos
4. **Categorías** (`categories`): Opcional, pero recomendado para procesos que las requieren

**Nota**: El script NO crea descripciones de actuación automáticamente. Debes crearlas manualmente antes de ejecutar el seed.

## Datos Generados

### Personas
- **60% Personas Naturales**: Con nombres colombianos comunes y cédulas válidas (8-10 dígitos)
- **40% Empresas**: Con nombres de empresas y NITs válidos (9 dígitos)

### Procesos
- Números de proceso únicos en formato `YYYY-RRRRR`
- Fechas de llegada en los últimos 5 años
- Estados: PRIMERA_INSTANCIA, SEGUNDA_INSTANCIA, ARCHIVADO
- Si está ARCHIVADO, incluye fecha de cierre
- Respeta la validación de "Pagos por consignación" (sin categoría)
- **Incidentes de desacato**: Solo se crean si hay Tutelas previas, usan el mismo número y categorías de Tutela

### Actuaciones
- 80% asociadas a procesos, 20% sin proceso
- Fechas dentro del rango del proceso (si tiene)
- Distribuidas en los últimos 2 años
- **Coherentes con el tipo de proceso**: Las descripciones se filtran según el tipo de proceso

## Notas

- Los mocks evitan duplicados (documentos, números de proceso, IDs)
- Si ya existen datos en la base de datos, el script intentará crear nuevos sin duplicar
- Los errores se muestran pero no detienen el proceso completo
- Los Incidentes de desacato se crean en una segunda fase, después de las Tutelas

