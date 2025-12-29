// Database Seeder - Creates sample data for testing
const bcrypt = require('bcrypt');
const { User, Voter, Complaint, Event } = require('./models');

async function seedDatabase() {
    console.log('🌱 Seeding database...\n');

    try {
        // Clear existing data (except users)
        await Voter.destroy({ where: {} });
        await Complaint.destroy({ where: {} });
        await Event.destroy({ where: {} });

        // Create sample voters
        const voters = await Voter.bulkCreate([
            { name: 'Rahul Patil', address: 'A-101, Shivajinagar, Pune', booth: 'Booth-1', phone: '9876543210', category: 'supporter', city: 'Pune', section: 'Ward 11' },
            { name: 'Sneha Kulkarni', address: 'B-202, Kothrud, Pune', booth: 'Booth-2', phone: '9876501234', category: 'neutral', city: 'Pune', section: 'Ward 11' },
            { name: 'Amit Deshmukh', address: 'C-303, Aundh, Pune', booth: 'Booth-1', phone: '9876512345', category: 'supporter', city: 'Pune', section: 'Ward 11' },
            { name: 'Priya Sharma', address: 'D-404, Baner, Pune', booth: 'Booth-3', phone: '9876523456', category: 'opponent', city: 'Pune', section: 'Ward 11' },
            { name: 'Vijay Jadhav', address: 'E-505, Deccan, Pune', booth: 'Booth-2', phone: '9876534567', category: 'supporter', city: 'Pune', section: 'Ward 11' },
            { name: 'Anita Pawar', address: 'F-606, Camp, Pune', booth: 'Booth-1', phone: '9876545678', category: 'neutral', city: 'Pune', section: 'Ward 11' },
            { name: 'Suresh Gaikwad', address: 'G-707, Model Colony, Pune', booth: 'Booth-3', phone: '9876556789', category: 'supporter', city: 'Pune', section: 'Ward 11' },
            { name: 'Meena Bhosale', address: 'H-808, Swargate, Pune', booth: 'Booth-2', phone: '9876567890', category: 'supporter', city: 'Pune', section: 'Ward 11' },
            { name: 'Prakash More', address: 'I-909, Hadapsar, Pune', booth: 'Booth-1', phone: '9876578901', category: 'neutral', city: 'Pune', section: 'Ward 11' },
            { name: 'Kavita Thakur', address: 'J-101, Viman Nagar, Pune', booth: 'Booth-3', phone: '9876589012', category: 'opponent', city: 'Pune', section: 'Ward 11' }
        ]);
        console.log(`✅ Created ${voters.length} voters`);

        // Create sample complaints
        const complaints = await Complaint.bulkCreate([
            { voter_id: voters[0].id, issue: 'Street light not working near A-block', status: 'pending', priority: 'medium' },
            { voter_id: voters[1].id, issue: 'Water supply irregular in morning hours', status: 'in_progress', priority: 'high' },
            { voter_id: voters[2].id, issue: 'Garbage not collected for 3 days', status: 'resolved', priority: 'medium' },
            { voter_id: voters[3].id, issue: 'Road potholes causing accidents', status: 'pending', priority: 'high' },
            { voter_id: voters[4].id, issue: 'Drainage overflow during rains', status: 'in_progress', priority: 'high' }
        ]);
        console.log(`✅ Created ${complaints.length} complaints`);

        // Create sample events
        const events = await Event.bulkCreate([
            {
                title: 'Ward Meeting - Shivajinagar',
                description: 'Public meeting to discuss local infrastructure issues and development plans',
                event_date: new Date('2025-01-05'),
                location: 'Community Hall, Shivajinagar',
                event_type: 'meeting',
                status: 'scheduled'
            },
            {
                title: 'Door-to-Door Campaign',
                description: 'Campaign team visiting households in Kothrud area',
                event_date: new Date('2025-01-10'),
                location: 'Kothrud, Pune',
                event_type: 'campaign',
                status: 'scheduled'
            },
            {
                title: 'Youth Rally',
                description: 'Rally focusing on employment and education issues',
                event_date: new Date('2025-01-15'),
                location: 'Deccan Gymkhana Ground',
                event_type: 'rally',
                status: 'scheduled'
            }
        ]);
        console.log(`✅ Created ${events.length} events`);

        // Summary
        console.log('\n📊 Database Summary:');
        console.log(`   Users: ${await User.count()}`);
        console.log(`   Voters: ${await Voter.count()}`);
        console.log(`   Complaints: ${await Complaint.count()}`);
        console.log(`   Events: ${await Event.count()}`);

        console.log('\n✨ Database seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}

seedDatabase();
