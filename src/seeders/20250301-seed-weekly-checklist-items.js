'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Get Weekly template ID dynamically
    const templates = await queryInterface.sequelize.query(
      `SELECT templateId FROM ChecklistTemplates WHERE type = 'Weekly' LIMIT 1;`
    );

    const templateId = templates[0][0].templateId;

    await queryInterface.bulkInsert('ChecklistItems', [

      {
        itemId: 'W-DOOR-01',
        templateId,
        section: 'Door System',
        title: 'Door surfaces and edges free from micro-cracks/crazing',
        responseType: 'PassFailNA',
        instruction: 'Inspect door inside and outside under bright light. Change viewing angle to catch reflections. Look for hairline cracks, spider-web patterns, whitening, clouding or stress marks.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'HardShell/Winslet',
        order: 10,
        active: true
      },

      {
        itemId: 'W-DOOR-02',
        templateId,
        section: 'Door System',
        title: 'Door alignment unchanged (square seating, even engagement)',
        responseType: 'PassFailNA',
        instruction: 'Close door and visually confirm it seats evenly with no new gaps. Compare to normal appearance. Any change from usual fit = fail.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 11,
        active: true
      },

      {
        itemId: 'W-DOOR-03',
        templateId,
        section: 'Door System',
        title: 'Door retaining/locking/guide system secure',
        responseType: 'PassFailNA',
        instruction: 'Confirm rails/clamps/guides are present, correctly positioned, and not loose. Gently test for movement by hand (no tools).',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 12,
        active: true
      },

      {
        itemId: 'W-DOOR-04',
        templateId,
        section: 'Door System',
        title: 'Door sealing/contact faces clean and undamaged',
        responseType: 'PassFailNA',
        instruction: 'Wipe contact/sealing surfaces. Check for cuts, nicks, dents, embedded debris, or uneven wear.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 13,
        active: true
      },

      {
        itemId: 'W-DOOR-05',
        templateId,
        section: 'Door System',
        title: 'Door under-pressure gentle movement check',
        responseType: 'PassFailNA',
        instruction: 'Inflate to a low pressure (per normal operation). Without force, gently test that the door cannot move or disengage. Stop immediately if any movement occurs.',
        criticalFail: true,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 14,
        active: true
      },

      {
        itemId: 'W-DOOR-06',
        templateId,
        section: 'Door System',
        title: 'Upload external photo of door closed (weekly evidence)',
        responseType: 'PassFailNA',
        instruction: 'Take a clear photo of the door closed from outside showing the full perimeter/seat area.',
        criticalFail: false,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 15,
        active: true
      },

      {
        itemId: 'W-WIN-01',
        templateId,
        section: 'Windows / Viewing Panels',
        title: 'Windows free from cracks/crazing/scratches/delamination',
        responseType: 'PassFailNA',
        instruction: 'Inspect each window inside and outside using angled light. Look especially at corners/edges for stress marks or star cracking.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 20,
        active: true
      },

      {
        itemId: 'W-WIN-02',
        templateId,
        section: 'Windows / Viewing Panels',
        title: 'Window edges/perimeter intact (no lifting/gaps/creep)',
        responseType: 'PassFailNA',
        instruction: 'Inspect the full perimeter where the window meets the vessel. Look for lifting, separation, gasket movement, edge creep, compression marks, or new gaps.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 21,
        active: true
      },

      {
        itemId: 'W-WIN-03',
        templateId,
        section: 'Windows / Viewing Panels',
        title: 'Distortion check (no abnormal bowing change)',
        responseType: 'PassFailNA',
        instruction: 'Look through the window at a straight edge (door frame/wall line). If distortion looks worse than normal, note and report.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'HardShell/Winslet',
        order: 22,
        active: true
      },

      {
        itemId: 'W-WIN-04',
        templateId,
        section: 'Windows / Viewing Panels',
        title: 'Upload photo of each window (weekly evidence)',
        responseType: 'PassFailNA',
        instruction: 'Take clear photos of each window from outside. Ensure edges/perimeter are visible.',
        criticalFail: false,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 23,
        active: true
      },

      {
        itemId: 'W-OP-01',
        templateId,
        section: 'Operational Pressure Hold',
        title: 'Pressure hold test (2–3 minutes at normal operating pressure)',
        responseType: 'PassFailNA',
        instruction: 'Inflate to normal operating pressure. Observe gauge for at least 2–3 minutes. Pressure should remain stable. Any drift/instability = fail.',
        criticalFail: true,
        requiresPhotoOnFail: true,
        appliesToModels: 'All',
        order: 60,
        active: true
      },

      {
        itemId: 'W-OP-02',
        templateId,
        section: 'Operational Pressure Hold',
        title: 'No abnormal sounds during pressurisation/hold/depressurisation',
        responseType: 'PassFailNA',
        instruction: 'Listen near door/windows/ports during full cycle. Any new unusual noise = fail and report.',
        criticalFail: true,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 61,
        active: true
      },

      {
        itemId: 'W-DECL-01',
        templateId,
        section: 'Declaration',
        title: 'Weekly declaration accepted',
        responseType: 'PassFailNA',
        instruction: 'Confirm checks completed truthfully and defects reported.',
        criticalFail: true,
        requiresPhotoOnFail: false,
        appliesToModels: 'All',
        order: 99,
        active: true
      }

    ]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ChecklistItems', {
      itemId: {
        [Sequelize.Op.like]: 'W-%'
      }
    });
  }
};
