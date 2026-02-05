'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Get Daily template ID dynamically
    const templates = await queryInterface.sequelize.query(
      `SELECT templateId FROM ChecklistTemplates WHERE type = 'Daily' LIMIT 1;`
    );

    const templateId = templates[0][0].templateId;

    await queryInterface.bulkInsert('ChecklistItems', [

      {
        itemId: 'D-DOOR-01',
        templateId,
        section: 'Door System',
        title: 'Door opens and closes smoothly',
        responseType: 'PassFailNA',
        instruction: 'Open and close the door fully using normal hand force only. The door should move freely without sticking, grinding, or needing excessive force.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 10,
        active: true
      },

      {
        itemId: 'D-DOOR-02',
        templateId,
        section: 'Door System',
        title: 'Door seats fully into sealing position',
        responseType: 'PassFailNA',
        instruction: 'Close the door fully and visually confirm it sits evenly against its sealing face or guides. There should be no visible gaps around the perimeter.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 11,
        active: true
      },

      {
        itemId: 'D-DOOR-03',
        templateId,
        section: 'Door System',
        title: 'No cracks/crazing/whitening/clouding',
        responseType: 'PassFailNA',
        instruction: 'Inspect under good lighting from multiple angles. Look closely for hairline cracks, spider-web patterns, stress whitening or clouding. If unsure, change viewing angle to catch reflections.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'HardShell/Winslet',
        order: 12,
        active: true
      },

      {
        itemId: 'D-DOOR-04',
        templateId,
        section: 'Door System',
        title: 'No chips/impact marks/edge damage',
        responseType: 'PassFailNA',
        instruction: 'Visually inspect around the full door edge and surface. Any chips, impact marks, dents, or edge damage must be reported.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'HardShell/Winslet',
        order: 13,
        active: true
      },

      {
        itemId: 'D-DOOR-05',
        templateId,
        section: 'Door System',
        title: 'Door retaining system fully engaged',
        responseType: 'PassFailNA',
        instruction: 'Confirm all guides, rails, clamps, or retainers are in their normal operating position and fully engaged. No looseness or missing components.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 14,
        active: true
      },

      {
        itemId: 'D-DOOR-06',
        templateId,
        section: 'Door System',
        title: 'Door cannot be opened under pressure (gentle check)',
        responseType: 'PassFailNA',
        instruction: 'Once the chamber is lightly pressurised, do not force. Gently test that the door does not move or disengage. Stop immediately if any movement occurs.',
        criticalFail: true,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 15,
        active: true
      },

      {
        itemId: 'D-WIN-01',
        templateId,
        section: 'Windows / Viewing Panels',
        title: 'Windows clear and unobstructed',
        responseType: 'PassFailNA',
        instruction: 'Wipe the surface if needed and confirm the window is clear with no residue or fogging.',
        criticalFail: false,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 20,
        active: true
      },

      {
        itemId: 'D-WIN-02',
        templateId,
        section: 'Windows / Viewing Panels',
        title: 'No cracks/crazing/scratches/delamination',
        responseType: 'PassFailNA',
        instruction: 'Inspect the full window surface under angled light. Look for cracks, star-crazing, deep scratches, delamination or lifting layers.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 21,
        active: true
      },

      {
        itemId: 'D-WIN-03',
        templateId,
        section: 'Windows / Viewing Panels',
        title: 'Window edges intact (no lifting/gaps)',
        responseType: 'PassFailNA',
        instruction: 'Inspect around the perimeter where the window meets the chamber. There should be no lifting, gaps, separation, or peeling.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 22,
        active: true
      },

      {
        itemId: 'D-DECL-01',
        templateId,
        section: 'Declaration',
        title: 'Daily declaration accepted',
        responseType: 'PassFailNA',
        instruction: 'Tick to confirm checks completed truthfully; any defect reported; chamber safe to operate today.',
        criticalFail: true,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 99,
        active: true
      }

    ].map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    })));

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ChecklistItems', {
      itemId: {
        [Sequelize.Op.like]: 'D-%'
      }
    }, {});
  }
};

