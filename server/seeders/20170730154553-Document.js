module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Documents', [{
      title: 'How to eat an elephant',
      content: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries',
      userId: 1,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'The second coming',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 2,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Eating an elephant',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 2,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Just in the creep',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 4,
      access: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Letting you down',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 3,
      access: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Creating a document',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 3,
      access: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'My dream date was awesome',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 4,
      access: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'How I wrote a medium in five seconds',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 1,
      access: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'It can be used by an unmarried woman',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 5,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Lady is the female equivalent',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 5,
      access: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Titles for sale online start from as little',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 4,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'A vassal could be a lord of the manor',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 6,
      access: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'to whom he paid homage and swore fealty',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 6,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'in the British Isles, a general title for a prince',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 6,
      access: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'who pledged his loyalty and service to his superior',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 3,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'count in countries without viscounts',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 2,
      access: 'privare',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'What is a lord in England?',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 1,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'English Titles Lord and Lady Titles Buy A Title',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 3,
      access: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'How much does it cost to buy a title',
      content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
      userId: 4,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Documents', null, {});
  }
};
