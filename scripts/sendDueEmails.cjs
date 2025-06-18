// scripts/sendDueEmails.cjs
require('dotenv').config();
const dbConnect = require('../src/lib/dbConnect').default;
const Rent = require('../src/models/Rent').default;
const { sendEmail } = require('../src/lib/mailer');
const User = require('../src/models/User').default;

async function sendDueNotifications() {
  await dbConnect();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rents = await Rent.find({
  status: 'confirmed',
    books: {
      $elemMatch: {
        returned: false,
        dueDate: { $lte: new Date() }
      }
    }
  }).populate('userId');


  console.log(`🔍 Found ${rents.length} rent(s) to notify`);

  for (const rent of rents) {
    for (const book of rent.books) {
      const dueDate = new Date(book.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      let emailType = '';
      if (dueDate.getTime() === today.getTime()) {
        emailType = 'due today';
      } else if (dueDate < today) {
        emailType = 'overdue';
      } else {
        continue;
      }

      await sendEmail({
        to: rent.userId.email,
        subject: `Book ${emailType}: ${book.title}`,
        html: `
          <p>Hello ${rent.userId.name || 'User'},</p>
          <p>Your book <strong>${book.title}</strong> is <strong>${emailType}</strong>.</p>
          <p>Due Date: ${dueDate.toDateString()}</p>
          <p>Please return or extend it as soon as possible.</p>
        `,
      });

      console.log(`📧 Email sent to ${rent.userId.email} for "${book.title}" (${emailType})`);
    }
  }


  console.log('✅ All due/overdue emails processed.');
  process.exit(0);
}

sendDueNotifications().catch((err) => {
  console.error('❌ Error sending emails:', err);
  process.exit(1);
});
