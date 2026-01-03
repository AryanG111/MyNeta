const nodemailer = require('nodemailer');
const config = require('./config');

// Create transporter with SMTP settings
const transporter = nodemailer.createTransport({
    host: config.smtp.host || 'smtp.gmail.com',
    port: config.smtp.port || 587,
    secure: config.smtp.secure || false,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
    }
});

// Verify connection on startup
transporter.verify((error) => {
    if (error) {
        console.log('⚠️  Email service not configured:', error.message);
    } else {
        console.log('✅ Email service ready');
    }
});

// Email templates
const templates = {
    newComplaint: (complaint, voterName) => ({
        subject: `🚨 New Complaint: ${complaint.issue.substring(0, 50)}...`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h2 style="color: white; margin: 0;">New Complaint Received</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                    <p><strong>From:</strong> ${voterName}</p>
                    <p><strong>Priority:</strong> ${complaint.priority || 'Medium'}</p>
                    <div style="background: #fef3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0;"><strong>Issue:</strong></p>
                        <p style="margin: 10px 0 0 0;">${complaint.issue}</p>
                    </div>
                    <a href="http://localhost:5173/complaints" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px;">
                        View in Dashboard
                    </a>
                </div>
                <div style="padding: 15px; background: #f9fafb; text-align: center; border-radius: 0 0 10px 10px;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">MyNeta Campaign Management</p>
                </div>
            </div>
        `
    }),

    volunteerRegistration: (volunteer) => ({
        subject: `👋 New Volunteer Registration: ${volunteer.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h2 style="color: white; margin: 0;">New Volunteer Application</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                    <table style="width: 100%;">
                        <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0; font-weight: bold;">${volunteer.name}</td></tr>
                        <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;">${volunteer.email}</td></tr>
                        <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;">${volunteer.mobile}</td></tr>
                        ${volunteer.message ? `<tr><td style="padding: 8px 0; color: #6b7280;">Message:</td><td style="padding: 8px 0;">${volunteer.message}</td></tr>` : ''}
                    </table>
                    <a href="http://localhost:5173/admin" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px;">
                        Review in Admin Panel
                    </a>
                </div>
                <div style="padding: 15px; background: #f9fafb; text-align: center; border-radius: 0 0 10px 10px;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">MyNeta Campaign Management</p>
                </div>
            </div>
        `
    }),

    complaintResolved: (complaint, voterEmail) => ({
        subject: `✅ Your Complaint Has Been Resolved`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h2 style="color: white; margin: 0;">Complaint Resolved!</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                    <p>Dear Voter,</p>
                    <p>We're happy to inform you that your complaint has been addressed and resolved.</p>
                    <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0;"><strong>Your Complaint:</strong></p>
                        <p style="margin: 10px 0 0 0;">${complaint.issue}</p>
                    </div>
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0;"><strong>Resolution:</strong></p>
                        <p style="margin: 10px 0 0 0;">${complaint.resolution_notes || 'Issue has been addressed.'}</p>
                    </div>
                    ${complaint.resolution_photo ? `
                        <p><strong>Proof Photo:</strong></p>
                        <img src="http://localhost:5000${complaint.resolution_photo}" alt="Resolution proof" style="max-width: 100%; border-radius: 8px;">
                    ` : ''}
                    <p style="margin-top: 20px;">Thank you for bringing this to our attention. We value your feedback!</p>
                </div>
                <div style="padding: 15px; background: #f9fafb; text-align: center; border-radius: 0 0 10px 10px;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">MyNeta Campaign Management</p>
                </div>
            </div>
        `
    }),

    taskAssigned: (task, volunteerEmail) => ({
        subject: `📋 New Task Assigned: ${task.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 20px; border-radius: 10px 10px 0 0;">
                    <h2 style="color: white; margin: 0;">New Task Assigned</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                    <h3 style="margin-top: 0;">${task.title}</h3>
                    <p>${task.description || 'No description provided.'}</p>
                    <table style="width: 100%; margin: 15px 0;">
                        <tr><td style="padding: 8px 0; color: #6b7280;">Priority:</td><td style="padding: 8px 0; font-weight: bold;">${task.priority}</td></tr>
                        ${task.due_date ? `<tr><td style="padding: 8px 0; color: #6b7280;">Due Date:</td><td style="padding: 8px 0;">${new Date(task.due_date).toLocaleDateString()}</td></tr>` : ''}
                    </table>
                    <a href="http://localhost:5173/my-dashboard" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px;">
                        View My Tasks
                    </a>
                </div>
                <div style="padding: 15px; background: #f9fafb; text-align: center; border-radius: 0 0 10px 10px;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px;">MyNeta Campaign Management</p>
                </div>
            </div>
        `
    })
};

// Send email function
const sendEmail = async (to, template) => {
    if (!config.smtp.user || !config.smtp.pass) {
        console.log('📧 Email not sent (SMTP not configured):', template.subject);
        return { success: false, reason: 'SMTP not configured' };
    }

    try {
        const mailOptions = {
            from: `"MyNeta Campaign" <${config.smtp.user}>`,
            to,
            subject: template.subject,
            html: template.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('📧 Email error:', error.message);
        return { success: false, error: error.message };
    }
};

// Notification functions
const notifyAdminNewComplaint = async (complaint, voterName) => {
    const adminEmail = config.smtp.adminEmail || config.smtp.user;
    if (!adminEmail) return;
    return sendEmail(adminEmail, templates.newComplaint(complaint, voterName));
};

const notifyAdminVolunteerRegistration = async (volunteer) => {
    const adminEmail = config.smtp.adminEmail || config.smtp.user;
    if (!adminEmail) return;
    return sendEmail(adminEmail, templates.volunteerRegistration(volunteer));
};

const notifyVoterComplaintResolved = async (complaint, voterEmail) => {
    if (!voterEmail) return;
    return sendEmail(voterEmail, templates.complaintResolved(complaint));
};

const notifyVolunteerTaskAssigned = async (task, volunteerEmail) => {
    if (!volunteerEmail) return;
    return sendEmail(volunteerEmail, templates.taskAssigned(task));
};

module.exports = {
    sendEmail,
    templates,
    notifyAdminNewComplaint,
    notifyAdminVolunteerRegistration,
    notifyVoterComplaintResolved,
    notifyVolunteerTaskAssigned
};
