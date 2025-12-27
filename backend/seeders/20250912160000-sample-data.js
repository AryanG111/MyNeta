'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Sample voters
    await queryInterface.bulkInsert('Voters', [
      {
        id: 1,
        name: 'Rahul Patil',
        address: 'Shivajinagar, Pune',
        booth: 'Booth-1',
        phone: '9876543210',
        category: 'supporter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Sneha Kulkarni',
        address: 'Kothrud, Pune',
        booth: 'Booth-2',
        phone: '9876501234',
        category: 'neutral',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Amit Deshmukh',
        address: 'Hadapsar, Pune',
        booth: 'Booth-3',
        phone: '9822012345',
        category: 'opponent',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Priya Joshi',
        address: 'Baner, Pune',
        booth: 'Booth-2',
        phone: '9811112233',
        category: 'supporter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Rajesh Kumar',
        address: 'Wakad, Pune',
        booth: 'Booth-4',
        phone: '9876543211',
        category: 'supporter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Sunita Sharma',
        address: 'Aundh, Pune',
        booth: 'Booth-1',
        phone: '9876543212',
        category: 'neutral',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Sample complaints
    await queryInterface.bulkInsert('Complaints', [
      {
        voter_id: 1,
        issue: 'Streetlight not working in our area',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        voter_id: 2,
        issue: 'Water supply issue - irregular timing',
        status: 'in_progress',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        voter_id: 3,
        issue: 'Road potholes need immediate fixing',
        status: 'resolved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        voter_id: 4,
        issue: 'Garbage collection not happening regularly',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        voter_id: 5,
        issue: 'Public transport frequency needs improvement',
        status: 'in_progress',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Sample events
    await queryInterface.bulkInsert('Events', [
      {
        title: 'Ward Meeting - Shivajinagar',
        description: 'Discussion with local residents about development issues',
        event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Shivajinagar Community Hall',
        event_type: 'meeting',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Cleanliness Drive',
        description: 'Swachh Bharat campaign in Kothrud area',
        event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: 'Kothrud Market Area',
        event_type: 'campaign',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Youth Development Program',
        description: 'Skill development workshop for young voters',
        event_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        location: 'Pune Municipal Corporation',
        event_type: 'other',
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
    await queryInterface.bulkDelete('Complaints', null, {});
    await queryInterface.bulkDelete('Voters', null, {});
  }
};


