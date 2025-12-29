const { AuditLog } = require('../../models');

async function log(userId, action, targetTable, targetId, details) {
  try {
    await AuditLog.create({
      user_id: userId || null,
      action,
      target_table: targetTable,
      target_id: targetId || null,
      details: details ? JSON.stringify(details) : null,
      timestamp: new Date()
    });
  } catch (e) {
    // swallow audit errors to not break main flow
  }
}

module.exports = { log };

