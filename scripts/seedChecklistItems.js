const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { ChecklistItem, ChecklistTemplate } = require('../src/models'); // adjust path

async function seed() {
  try {
    // Get the Daily template
    const template = await ChecklistTemplate.findOne({ where: { type: 'Monthly', active: true } });
    if (!template) {
      console.error('Daily checklist template not found. Please seed templates first.');
      process.exit(1);
    }

    const results = [];

    fs.createReadStream(path.join(__dirname, 'ChecklistItems_Monthly.csv'))
      .pipe(csv())
      .on('data', (data) => {
        // Convert booleans from CSV strings
        data.criticalFail = data.criticalFail === 'True';
        data.requiresPhotoOnFail = data.requiresPhotoOnFail === 'True';
        data.active = data.active === 'True';

        // Convert numbers
        data.order = parseInt(data.order);

        // Attach templateId from template
        data.templateId = template.templateId;

        results.push(data);
      })
      .on('end', async () => {
        try {
          await ChecklistItem.bulkCreate(results, { ignoreDuplicates: true });
          console.log('Checklist items seeded successfully!');
          process.exit(0);
        } catch (err) {
          console.error('Error seeding checklist items:', err);
          process.exit(1);
        }
      });
  } catch (err) {
    console.error('Seed script failed:', err);
    process.exit(1);
  }
}

seed();
