const db = require('./models');
const { User, Voter, Complaint, Event, Task, sequelize } = db;
const bcrypt = require('bcrypt');

async function seed() {
    try {
        // Disable foreign key checks for dropping tables
        await sequelize.query('PRAGMA foreign_keys = OFF');
        await sequelize.sync({ force: true });
        await sequelize.query('PRAGMA foreign_keys = ON');
        console.log('Database synced (force: true)');

        const password_hash = await bcrypt.hash('Demo@1234', 10);
        const admin_hash = await bcrypt.hash('Vedish0101', 10);
        const sahil_hash = await bcrypt.hash('Sahil@6055', 10);
        const voter_hash = await bcrypt.hash('Voter@1234', 10);

        // Create Admin
        const subhash = await User.create({
            name: 'Subhash',
            email: 'subhash@myneta.app',
            password_hash: admin_hash,
            role: 'admin',
            is_approved: true,
            area: 'Headquarters'
        });

        // Create Volunteers
        const volunteersData = [
            { name: 'Sahil Kulkarni', email: 'sahil@myneta.app', area: 'Kothrud', mobile: '9000000001' },
            { name: 'Priya Sharma', email: 'priya@myneta.app', area: 'Shivajinagar', mobile: '9000000002' },
            { name: 'Rahul Mehta', email: 'rahul@myneta.app', area: 'Hadapsar', mobile: '9000000003' }
        ];

        const volunteers = [];
        for (const v of volunteersData) {
            const vol = await User.create({
                name: v.name,
                email: v.email,
                password_hash: sahil_hash,
                role: 'volunteer',
                is_approved: true,
                area: v.area,
                mobile: v.mobile
            });
            volunteers.push(vol);
        }

        // Create Voters with Accounts
        const votersData = [
            { name: 'Sunita Deshpande', email: 'sunita@example.com', phone: '9876543210', booth: 'Booth 42', ward_no: '12', address: 'Ram Bagh Colony', category: 'supporter' },
            { name: 'Kamla Bai', email: 'kamla@example.com', phone: '9876543211', booth: 'Booth 45', ward_no: '04', address: 'Arandavana, Ward 4', category: 'neutral' },
            { name: 'Aryan Ghait', email: 'aryan@example.com', phone: '9876543212', booth: 'Booth 42', ward_no: '12', address: 'Kothrud, Pune', category: 'supporter' },
            { name: 'Rajesh Tiwari', email: 'rajesh@example.com', phone: '9876543213', booth: 'Booth 47', ward_no: '08', address: 'Shivaji Nagar', category: 'opponent' },
            { name: 'Amit Saxena', email: 'amit@example.com', phone: '9876543214', booth: 'Booth 42', ward_no: '12', address: 'Ideal Colony', category: 'supporter' },
            { name: 'Megha Patwardhan', email: 'megha@example.com', phone: '9876543215', booth: 'Booth 50', ward_no: '15', address: 'Dahanukar Colony', category: 'neutral' },
            { name: 'Sanjay Gupta', email: 'sanjay@example.com', phone: '9876543216', booth: 'Booth 55', ward_no: '21', address: 'Karve Nagar', category: 'supporter' },
            { name: 'Leela Dsouza', email: 'leela@example.com', phone: '9876543217', booth: 'Booth 42', ward_no: '12', address: 'Kothrud Depot', category: 'supporter' }
        ];

        const voterRecords = [];
        for (const v of votersData) {
            const user = await User.create({
                name: v.name,
                email: v.email,
                mobile: v.phone,
                password_hash: voter_hash,
                role: 'voter',
                is_approved: true,
                area: v.booth
            });

            const voter = await Voter.create({
                name: v.name,
                address: v.address,
                booth: v.booth,
                ward_no: v.ward_no,
                phone: v.phone,
                category: v.category,
                email: v.email,
                user_id: user.id
            });
            voterRecords.push({ ...v, id: voter.id });
        }

        // Create Events
        const eventsData = [
            {
                title: 'Community Meeting - Ram Bagh',
                description: 'Monthly meeting to discuss local infrastructure improvements and grievance redressal.',
                event_date: new Date(Date.now() + 86400000 * 2), // 2 days from now
                location: 'Community Hall, Ram Bagh',
                event_type: 'meeting',
                status: 'scheduled'
            },
            {
                title: 'Election Awareness Rally',
                description: 'Gathering to encourage youth participation in upcoming local elections.',
                event_date: new Date(Date.now() + 86400000 * 5), // 5 days from now
                location: 'Saras Baug Main Gate',
                event_type: 'rally',
                status: 'scheduled'
            },
            {
                title: 'Digital Literacy Workshop',
                description: 'Teaching senior citizens how to use government portals and MyNeta app.',
                event_date: new Date(Date.now() + 86400000 * 10), // 10 days from now
                location: 'Kothrud Ward Office',
                event_type: 'other',
                status: 'scheduled'
            },
            {
                title: 'Cleanliness Drive',
                description: 'Voluntary drive to clean Mutha river banks.',
                event_date: new Date(Date.now() - 86400000 * 3), // 3 days ago
                location: 'River Bed, Deccan',
                event_type: 'campaign',
                status: 'completed'
            }
        ];

        for (const e of eventsData) {
            await Event.create(e);
        }

        // Create Complaints
        const complaintsData = [
            {
                voter_name: 'Sunita Deshpande',
                issue: 'Open drainage line causing foul smell and health hazard near Plot 14.',
                status: 'pending',
                priority: 'high'
            },
            {
                voter_name: 'Kamla Bai',
                issue: 'Irregular water supply timings for the last 2 weeks.',
                status: 'in_progress',
                assigned_volunteer: volunteers[0].id,
                priority: 'high'
            },
            {
                voter_name: 'Aryan Ghait',
                issue: 'Potholes on the main road are dangerous for two-wheelers.',
                status: 'pending',
                priority: 'medium'
            },
            {
                voter_name: 'Rajesh Tiwari',
                issue: 'Street light near electric pole #45 is flickering.',
                status: 'resolved',
                assigned_volunteer: volunteers[1].id,
                resolution_notes: 'Replaced the LED bulb and fixed loose wiring.',
                resolved_at: new Date(),
                approved_by_admin: true,
                priority: 'low'
            },
            {
                voter_name: 'Sanjay Gupta',
                issue: 'Garbage collection truck hasn’t visited the lane in 3 days.',
                status: 'pending',
                priority: 'medium'
            }
        ];

        for (const c of complaintsData) {
            const v = await Voter.findOne({ where: { name: c.voter_name } });
            await Complaint.create({
                voter_id: v.id,
                issue: c.issue,
                status: c.status,
                priority: c.priority,
                assigned_volunteer: c.assigned_volunteer,
                resolution_notes: c.resolution_notes,
                resolved_at: c.resolved_at,
                approved_by_admin: c.approved_by_admin
            });
        }

        // Create Tasks for Volunteers
        const tasksData = [
            {
                title: 'Voter List Verification',
                description: 'Door-to-door verification of voter names in Booth 42.',
                status: 'in_progress',
                priority: 'high',
                assigned_to: volunteers[0].id,
                due_date: new Date(Date.now() + 86400000 * 3)
            },
            {
                title: 'Booth Committee Formation',
                description: 'Identify 5 active supporters for Booth 45 committee.',
                status: 'pending',
                priority: 'medium',
                assigned_to: volunteers[1].id,
                due_date: new Date(Date.now() + 86400000 * 7)
            },
            {
                title: 'Document Collection - Complaint #102',
                description: 'Collect signed application for the water supply issue from Kamla Bai.',
                status: 'completed',
                priority: 'high',
                assigned_to: volunteers[0].id,
                due_date: new Date(Date.now() - 86400000)
            },
            {
                title: 'Distribute PAMPHLETS',
                description: 'Distribute awareness pamphlets at Kothrud Depot.',
                status: 'pending',
                priority: 'low',
                assigned_to: volunteers[2].id,
                due_date: new Date(Date.now() + 86400000)
            }
        ];

        for (const t of tasksData) {
            await Task.create({
                ...t,
                assigned_by: subhash.id
            });
        }

        console.log('Database seeded successfully with presentation-ready data!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();


