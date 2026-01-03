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

// Base layout for all email templates
const baseLayout = (title, content, color = '#f97316') => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 20px;">
        <div style="background-color: white; border-radius: 12px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, ${color}, ${color}dd); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">MyNeta</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Campaign Management System</p>
            </div>
            
            <div style="padding: 30px; color: #374151; line-height: 1.6;">
                <h2 style="color: ${color}; margin-top: 0; font-size: 20px;">${title}</h2>
                ${content}
            </div>
            
            <div style="padding: 20px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    This is an automated message from MyNeta Campaign System.<br>
                    &copy; ${new Date().getFullYear()} MyNeta Team. All rights reserved.
                </p>
            </div>
        </div>
    </div>
`;

// Email templates
const templates = {
    newComplaint: (complaint, voterName) => ({
        subject: `🚨 New Complaint: ${complaint.issue.substring(0, 50)}...`,
        html: baseLayout('New Complaint Received', `
            <p>A new complaint has been filed by <strong>${voterName}</strong>.</p>
            <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #9a3412;">Issue Details:</p>
                <p style="margin: 10px 0 0 0;">${complaint.issue}</p>
            </div>
            <p><strong>Priority:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${complaint.priority === 'high' ? '#dc2626' : '#f97316'}">${complaint.priority || 'Medium'}</span></p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${config.corsOrigin}/complaints" style="background-color: #f97316; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View in Dashboard</a>
            </div>
        `)
    }),

    voterApproved: (voterName) => ({
        subject: '🎉 Welcome to MyNeta! Your Voter Account is Active',
        html: baseLayout('Account Approved!', `
            <p>Hello <strong>${voterName}</strong>,</p>
            <p>Fantastic news! Your voter registration has been reviewed and approved by the administrator.</p>
            <p>You can now log in to the MyNeta platform to submit complaints, track issues in your area, and stay updated with campaign events.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${config.corsOrigin}/login" style="background-color: #f97316; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log In Now</a>
            </div>
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">If you have any questions, feel free to reply to this email.</p>
        `)
    }),

    volunteerApproved: (volunteerName) => ({
        subject: '🚀 You are now an Official MyNeta Volunteer!',
        html: baseLayout('Welcome to the Team!', `
            <p>Hello <strong>${volunteerName}</strong>,</p>
            <p>Congratulations! Your application to become a MyNeta volunteer has been <strong>approved</strong>.</p>
            <p>We are thrilled to have you on board. You can now access your volunteer dashboard to view assigned tasks, help resolve voter complaints, and manage campaign activities.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${config.corsOrigin}/login" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Dashboard</a>
            </div>
        `, '#2563eb')
    }),

    complaintResolved: (complaint, voterEmail) => ({
        subject: `✅ Your Complaint Has Been Resolved`,
        html: baseLayout('Complaint Resolved!', `
            <p>Dear Citizen,</p>
            <p>We are pleased to inform you that your complaint regarding <strong>"${complaint.issue.substring(0, 50)}..."</strong> has been resolved.</p>
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #166534;">Resolution Notes:</p>
                <p style="margin: 10px 0 0 0;">${complaint.resolution_notes || 'The issue has been successfully addressed by our team.'}</p>
            </div>
            ${complaint.resolution_photo ? `
                <p><strong>Proof of Resolution:</strong></p>
                <div style="border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                    <img src="http://localhost:5000${complaint.resolution_photo}" alt="Resolution proof" style="max-width: 100%; display: block;">
                </div>
            ` : ''}
            <p style="margin-top: 20px;">Thank you for your patience and for helping us make our community better.</p>
        `, '#10b981')
    }),

    taskAssigned: (task, volunteerEmail) => ({
        subject: `📋 New Task: ${task.title}`,
        html: baseLayout('New Task Assigned', `
            <p>You have been assigned a new task: <strong>${task.title}</strong></p>
            <p style="color: #6b7280;">${task.description || 'No additional details provided.'}</p>
            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Priority:</strong> ${task.priority.toUpperCase()}</p>
                ${task.due_date ? `<p style="margin: 10px 0 0 0;"><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>` : ''}
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${config.corsOrigin}/my-dashboard" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Task Details</a>
            </div>
        `, '#2563eb')
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
    return sendEmail(adminEmail, {
        subject: `👋 New Volunteer Application: ${volunteer.name}`,
        html: baseLayout('New Volunteer Registration', `
            <p>A new volunteer application is awaiting review.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Name</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${volunteer.name}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${volunteer.email}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${volunteer.mobile}</td></tr>
            </table>
            <div style="text-align: center; margin-top: 20px;">
                <a href="${config.corsOrigin}/admin" style="background-color: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Go to Admin Panel</a>
            </div>
        `, '#10b981')
    });
};

const notifyVoterComplaintResolved = async (complaint, voterEmail) => {
    if (!voterEmail) return;
    return sendEmail(voterEmail, templates.complaintResolved(complaint));
};

const notifyVolunteerTaskAssigned = async (task, volunteerEmail) => {
    if (!volunteerEmail) return;
    return sendEmail(volunteerEmail, templates.taskAssigned(task));
};

const notifyVoterApproved = async (voterName, voterEmail) => {
    if (!voterEmail) return;
    return sendEmail(voterEmail, templates.voterApproved(voterName));
};

const notifyVolunteerApproved = async (volunteerName, volunteerEmail) => {
    if (!volunteerEmail) return;
    return sendEmail(volunteerEmail, templates.volunteerApproved(volunteerName));
};

module.exports = {
    sendEmail,
    templates,
    notifyAdminNewComplaint,
    notifyAdminVolunteerRegistration,
    notifyVoterComplaintResolved,
    notifyVolunteerTaskAssigned,
    notifyVoterApproved,
    notifyVolunteerApproved
};
