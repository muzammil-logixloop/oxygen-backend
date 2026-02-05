const ChecklistTemplate = require('../src/models/ChecklistTemplate');

async function seed() {
  try {
    await ChecklistTemplate.bulkCreate([
      { type: 'Daily', version: 1, appliesToModels: ["All"], active: true },
      { type: 'Weekly', version: 1, appliesToModels: ["All"], active: true },
      { type: 'Monthly', version: 1, appliesToModels: ["All"], active: true }
    ], { ignoreDuplicates: true }); // optional, prevents duplicate key errors

    console.log("Checklist templates seeded");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

seed();
