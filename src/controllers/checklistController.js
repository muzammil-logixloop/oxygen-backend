const {
  ChecklistTemplate,
  ChecklistItem,
  ChecklistSubmission,
  ChecklistResponse,
  Chamber,
  Issue
} = require('../models');

// exports.submitChecklist = async (req, res) => {
//   try {

//     const {
//       chamberId,
//       checkType,
//       responses,
//       declarationAccepted,
//       signatureName,
//       notesGeneral,
//       videoUpload
//     } = req.body;

//     const user = req.user;

//     // Validate chamber
//     const chamber = await Chamber.findByPk(chamberId);
//     if (!chamber) return res.status(404).json({ message: "Chamber not found" });

//     // Get active template
//     const template = await ChecklistTemplate.findOne({
//       where: { type: checkType, active: true }
//     });

//     if (!template) {
//       return res.status(400).json({ message: "No active checklist template found" });
//     }

//     const items = await ChecklistItem.findAll({
//       where: { templateId: template.templateId }
//     });

//     // Core Rule 5.2 – Monthly video required
//     if (checkType === 'Monthly' && !videoUpload) {
//       return res.status(400).json({
//         message: "Monthly checklist requires a video upload"
//       });
//     }

//     let overallResult = "Pass";
//     let computedFlags = [];

//     // Validate each response
//     for (let r of responses) {

//       const item = items.find(i => i.itemId === r.itemId);
//       if (!item) continue;

//       // Rule 5.1 – Photo on fail
//       if (item.requiresPhotoOnFail && r.result === "Fail" && !r.attachment) {
//         return res.status(400).json({
//           message: `Photo required for failed item ${r.itemId}`
//         });
//       }

//       // Rule 5.3 – Critical Fail
//       if (item.criticalFail && r.result === "Fail") {
//         overallResult = "Fail";

//         computedFlags.push({
//           itemId: r.itemId,
//           section: item.section,
//           message: "Critical safety failure"
//         });
//       }
//     }

//     // Create submission
//     const submission = await ChecklistSubmission.create({
//       customerId: user.customerId,
//       chamberId,
//       memberId: user.userId,
//       userName: user.name,
//       checkType,
//       templateVersion: template.version,
//       overallResult,
//       declarationAccepted,
//       signatureName,
//       notesGeneral,
//       videoUpload,
//       computedFlags
//     });

//     // Save responses
//     for (let r of responses) {
//       await ChecklistResponse.create({
//         submissionId: submission.submissionId,
//         itemId: r.itemId,
//         result: r.result,
//         notes: r.notes,
//         attachment: r.attachment
//       });
//     }

//     // CRITICAL FAIL AUTOMATION (Rule 5.3)
//     if (overallResult === "Fail") {

//       await chamber.update({
//         warrantyStatus: "Suspended",
//         doNotOperateFlag: true
//       });

//       // Create Issue automatically
//       await Issue.create({
//         chamberId,
//         severity: "SafetyCritical",
//         status: "New",
//         title: "Critical Checklist Failure",
//         description: "Automatic ticket due to critical checklist failure"
//       });

//       // TODO: trigger email notifications here
//     }

//     res.json({
//       message: "Checklist submitted successfully",
//       submissionId: submission.submissionId,
//       overallResult
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.submitChecklist = async (req, res) => {
  try {
    const user = req.user;

    // Multer returns files as an array because we use .any()
    const files = req.files || [];

    // Map attachments and video correctly
    const attachmentsMap = {};
    let videoFile = null;

    files.forEach(file => {
      const match = file.fieldname.match(/^attachments\[(.+)\]$/);

      if (match) {
        const itemId = match[1];
        attachmentsMap[itemId] = file.filename;
      }

      if (file.fieldname === "videoUpload") {
        videoFile = file;
      }
    });

    // console.log("Mapped attachments:", attachmentsMap);

    // Parse request body
    const { chamberId, checkType, declarationAccepted, signatureName, notesGeneral } = req.body;

    if (!req.body.responses) {
      return res.status(400).json({ message: "Responses are required" });
    }

    const responses = JSON.parse(req.body.responses);

    // Validate chamber
    const chamber = await Chamber.findByPk(chamberId);
    if (!chamber) {
      return res.status(404).json({ message: "Chamber not found" });
    }

    // Get active templa
    const template = await ChecklistTemplate.findOne({
      where: { type: checkType, active: true }
    });

    if (!template) {
      return res.status(400).json({ message: "No active checklist template found" });
    }

    const items = await ChecklistItem.findAll({
      where: { templateId: template.templateId }
    });

    // Monthly video validation
    if (checkType === 'Monthly' && !videoFile) {
      return res.status(400).json({ message: "Monthly checklist requires a video upload" });
    }

    let overallResult = "Pass";
    let computedFlags = [];

    // Validate each response
    for (let r of responses) {
      const item = items.find(i => i.itemId == r.itemId);
      if (!item) continue;

      // Photo required on fail
      if (
        item.requiresPhotoOnFail &&
        r.result === "Fail" &&
        !attachmentsMap[r.itemId]
      ) {
        return res.status(400).json({
          message: `Photo required for failed item ${r.itemId}`
        });
      }

      // Critical fail handling
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
      videoUpload: videoFile ? videoFile.filename : null,
      computedFlags
    });

    // Save responses
    for (let r of responses) {
      await ChecklistResponse.create({
        submissionId: submission.submissionId,
        itemId: r.itemId,
        result: r.result,
        notes: r.notes || '',
        attachment: attachmentsMap[r.itemId] || null
      });
    }

    // Critical fail automation
    if (overallResult === "Fail") {
      await chamber.update({
        warrantyStatus: "Suspended",
        doNotOperateFlag: true
      });

      await Issue.create({
        chamberId,
        reportedById: user.userId,
        severity: "SafetyCritical",
        status: "New",
        title: "Critical Checklist Failure",
        description: "Automatic ticket due to critical checklist failure"
      });
    }

    return res.json({
      message: "Checklist submitted successfully",
      submissionId: submission.submissionId,
      overallResult
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
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



// Get submissions for logged-in user with proper URLs
exports.getMySubmissions = async (req, res) => {
  try {
    const user = req.user;

    // Base URL for uploaded files
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;

    // Fetch submissions with proper eager loading
    const submissions = await ChecklistSubmission.findAll({
  where: { memberId: user.userId },
  include: [
    {
      model: ChecklistResponse,
      as: 'ChecklistResponses', // must match association
      attributes: ['itemId', 'result', 'notes', 'attachment']
    },
    {
      model: Chamber,
      as: 'Chamber', // must match association
      attributes: ['id', 'serialNumber', 'modelName'] // use real columns
    }
  ],
  order: [['submittedAt', 'DESC']]
});


    // Format submissions with full URLs
    const formatted = submissions.map(sub => {
  const submission = sub.toJSON();

  return {
    submissionId: submission.submissionId,
    chamberId: submission.chamberId,
    chamberSerialNumber: submission.Chamber?.serialNumber || null,
    chamberModelName: submission.Chamber?.modelName || null,
    checkType: submission.checkType,
    overallResult: submission.overallResult,
    submittedAt: submission.submittedAt,
    notesGeneral: submission.notesGeneral,
    signatureName: submission.signatureName,
    videoUrl: submission.videoUpload
      ? `${baseUrl}/${submission.videoUpload}`
      : null,
    responses: submission.ChecklistResponses.map(r => ({
      itemId: r.itemId,
      result: r.result,
      notes: r.notes,
      attachmentUrl: r.attachment
        ? `${baseUrl}/${r.attachment}`
        : null
    }))
  };
});


    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
