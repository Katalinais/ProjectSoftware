import { prisma } from "../config/db.js";
import { generatePeopleMocks } from "./people.mock.js";
import { generateTrialsMocks } from "./trials.mock.js";
import { generateActionsMocks } from "./actions.mock.js";

/**
 * Script para poblar la base de datos con datos mock
 * Uso: node mocks/seed.js
 */
const seedDatabase = async () => {
  try {
    console.log("🌱 Iniciando seed de la base de datos...\n");

    // 1. Obtener datos existentes necesarios
    console.log("📋 Obteniendo datos existentes...");
    const typeTrials = await prisma.typeTrial.findMany();
    const categories = await prisma.category.findMany();
    const entryTypes = await prisma.entryType.findMany();
    const typeActions = await prisma.typeAction.findMany();
    
    if (typeTrials.length === 0) {
      console.error("❌ Error: No hay tipos de proceso en la base de datos. Por favor, crea algunos tipos de proceso primero.");
      process.exit(1);
    }

    if (entryTypes.length === 0) {
      console.error("❌ Error: No hay tipos de entrada en la base de datos. Por favor, crea algunos tipos de entrada primero.");
      process.exit(1);
    }

    if (typeActions.length === 0) {
      console.error("❌ Error: No hay tipos de acción en la base de datos. Por favor, crea algunos tipos de acción primero.");
      process.exit(1);
    }

    // 2. Generar y crear personas
    console.log("\n👥 Generando personas...");
    const peopleMocks = generatePeopleMocks(30);
    const createdPeople = [];
    
    for (const person of peopleMocks) {
      try {
        const created = await prisma.person.create({
          data: person
        });
        createdPeople.push(created);
      } catch (error) {
        if (error.code === "P2002") {
          // Documento duplicado, saltar
          console.log(`⚠️  Persona con documento ${person.document} ya existe, saltando...`);
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ ${createdPeople.length} personas creadas`);

    // 3. Obtener descripciones de acción existentes
    console.log("\n📝 Obteniendo descripciones de acción...");
    const descriptionActions = await prisma.descriptionAction.findMany();
    
    if (descriptionActions.length === 0) {
      console.error("❌ Error: No hay descripciones de acción en la base de datos. Por favor, crea algunas descripciones de actuación primero.");
      process.exit(1);
    }
    console.log(`✅ ${descriptionActions.length} descripciones de acción disponibles`);

    // 4. Generar y crear procesos (en dos fases para respetar reglas de negocio)
    console.log("\n⚖️  Generando procesos...");
    
    // Fase 1: Crear procesos normales (incluyendo Tutelas)
    const trialsMocks = generateTrialsMocks(
      createdPeople.length > 0 ? createdPeople : await prisma.person.findMany({ take: 10 }),
      typeTrials,
      categories,
      entryTypes,
      20, // Crear menos en primera fase
      [] // Sin procesos existentes aún
    );
    
    const createdTrials = [];
    for (const trial of trialsMocks) {
      try {
        const created = await prisma.trial.create({
          data: trial,
          include: {
            typeTrial: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });
        createdTrials.push(created);
      } catch (error) {
        console.log(`⚠️  Error al crear proceso ${trial.number}: ${error.message}`);
      }
    }
    console.log(`✅ ${createdTrials.length} procesos creados (primera fase)`);

    // Fase 2: Crear Incidentes de desacato basados en Tutelas existentes
    const desacatoType = typeTrials.find(tt => tt.name.toLowerCase() === "incidente de desacato");
    const tutelaType = typeTrials.find(tt => tt.name.toLowerCase() === "tutela");
    
    if (desacatoType && tutelaType) {
      const tutelaTrials = createdTrials.filter(t => t.typeTrial.id === tutelaType.id);
      
      if (tutelaTrials.length > 0) {
        console.log("\n⚖️  Generando Incidentes de desacato...");
        // Normalizar las Tutelas para que tengan typeTrialId y todos los campos necesarios
        const normalizedTutelas = tutelaTrials.map(t => ({
          id: t.id,
          number: t.number,
          arrivalDate: t.arrivalDate,
          typeTrialId: t.typeTrial.id
        }));
        
        const desacatoMocks = generateTrialsMocks(
          createdPeople.length > 0 ? createdPeople : await prisma.person.findMany({ take: 10 }),
          typeTrials,
          categories,
          entryTypes,
          Math.min(5, tutelaTrials.length), // Crear hasta 5 incidentes o el número de tutelas disponibles
          normalizedTutelas // Pasar Tutelas existentes normalizadas
        );
        
        for (const trial of desacatoMocks) {
          try {
            const created = await prisma.trial.create({
              data: trial,
              include: {
                typeTrial: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            });
            createdTrials.push(created);
          } catch (error) {
            console.log(`⚠️  Error al crear Incidente de desacato ${trial.number}: ${error.message}`);
          }
        }
        console.log(`✅ ${desacatoMocks.length} Incidentes de desacato creados`);
      }
    }
    
    console.log(`✅ Total: ${createdTrials.length} procesos creados`);

    // 5. Generar y crear actuaciones
    console.log("\n📄 Generando actuaciones...");
    
    // Obtener procesos con sus tipos incluidos
    const trialsWithTypes = createdTrials.length > 0 
      ? createdTrials 
      : await prisma.trial.findMany({ 
          take: 10,
          include: {
            typeTrial: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });
    
    // Obtener descripciones con sus tipos incluidos
    const descriptionsWithTypes = await prisma.descriptionAction.findMany({
      include: {
        typeTrial: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    const actionsMocks = generateActionsMocks(
      trialsWithTypes,
      descriptionsWithTypes,
      40
    );
    
    const createdActions = [];
    for (const action of actionsMocks) {
      try {
        const created = await prisma.action.create({
          data: action
        });
        createdActions.push(created);
      } catch (error) {
        console.log(`⚠️  Error al crear actuación: ${error.message}`);
      }
    }
    console.log(`✅ ${createdActions.length} actuaciones creadas`);

    console.log("\n✨ Seed completado exitosamente!");
    console.log(`\n📊 Resumen:`);
    console.log(`   - Personas: ${createdPeople.length}`);
    console.log(`   - Procesos: ${createdTrials.length}`);
    console.log(`   - Actuaciones: ${createdActions.length}`);

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Ejecutar si se llama directamente
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMainModule || process.argv[1]?.includes('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log("\n✅ Proceso completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Error:", error);
      process.exit(1);
    });
}

export default seedDatabase;

