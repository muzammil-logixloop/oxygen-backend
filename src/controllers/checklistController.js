const {
  ChecklistTemplate,
  ChecklistItem,
  ChecklistSubmission,
  ChecklistResponse,
  Chamber,
  Issue
} = require('../models');

exports.submitChecklist = async (req, res) => {
  try {

    const {
      chamberId,
      checkType,
      responses,
      declarationAccepted,
      signatureName,
      notesGeneral,
      videoUpload
    } = req.body;

    const user = req.user;

    // Validate chamber
    const chamber = await Chamber.findByPk(chamberId);
    if (!chamber) return res.status(404).json({ message: "Chamber not found" });

    // Get active template
    const template = await ChecklistTemplate.findOne({
      where: { type: checkType, active: true }
    });

    if (!template) {
      return res.status(400).json({ message: "No active checklist template found" });
    }

    const items = await ChecklistItem.findAll({
      where: { templateId: template.templateId }
    });

    // Core Rule 5.2 – Monthly video required
    if (checkType === 'Monthly' && !videoUpload) {
      return res.status(400).json({
        message: "Monthly checklist requires a video upload"
      });
    }

    let overallResult = "Pass";
    let computedFlags = [];

    // Validate each response
    for (let r of responses) {

      const item = items.find(i => i.itemId === r.itemId);
      if (!item) continue;

      // Rule 5.1 – Photo on fail
      if (item.requiresPhotoOnFail && r.result === "Fail" && !r.attachment) {
        return res.status(400).json({
          message: `Photo required for failed item ${r.itemId}`
        });
      }

      // Rule 5.3 – Critical Fail
      if (item.criticalFail && r.result === "Fail") {
        overallResult = "Fail";

        computedFlags.push({
          itemId: r.itemId,
          section: item.section,
          message: "Critical safety failure"
        });
      }
    }

    // Create submission
    const submission = await ChecklistSubmission.create({
      customerId: user.customerId,
      chamberId,
      memberId: user.userId,
      userName: user.name,
      checkType,
      templateVersion: template.version,
      overallResult,
      declarationAccepted,
      signatureName,
      notesGeneral,
      videoUpload,
      computedFlags
    });

    // Save responses
    for (let r of responses) {
      await ChecklistResponse.create({
        submissionId: submission.submissionId,
        itemId: r.itemId,
        result: r.result,
        notes: r.notes,
        attachment: r.attachment
      });
    }

    // CRITICAL FAIL AUTOMATION (Rule 5.3)
    if (overallResult === "Fail") {

      await chamber.update({
        warrantyStatus: "Suspended",
        doNotOperateFlag: true
      });

      // Create Issue automatically
      await Issue.create({
        chamberId,
        severity: "SafetyCritical",
        status: "New",
        title: "Critical Checklist Failure",
        description: "Automatic ticket due to critical checklist failure"
      });

      // TODO: trigger email notifications here
    }

    res.json({
      message: "Checklist submitted successfully",
      submissionId: submission.submissionId,
      overallResult
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChecklistTemplate = async (req, res) => {
  const { type } = req.params;

  const template = await ChecklistTemplate.findOne({
    where: { type, active: true },
    include: [ChecklistItem]
  });

  res.json(template);
};

exports.getHistory = async (req, res) => {

  const { chamberId } = req.params;

  const history = await ChecklistSubmission.findAll({
    where: { chamberId },
    include: [ChecklistResponse],
    order: [['submittedAt', 'DESC']]
  });

  res.json(history);
};


