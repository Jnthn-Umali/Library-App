📚 Library App
This is a Library Management System built with Next.js, supporting admin, staff, and user dashboards. It includes features such as book rentals, return tracking, email reminders, analytics, and role-based access.

🚀 Getting Started
Clone the repo and install dependencies:

bash
Copy
Edit
git clone https://github.com/Jnthn-Umali/Library-App.git
cd Library-App
npm install
Run the development server:

bash
Copy
Edit
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to see the app.

⚙️ Environment Variables
Create a .env.local file and add the following:

env
Copy
Edit

MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password

✨ Features
📖 User Dashboard: Browse, rent books, view due dates

🛠️ Staff Dashboard: Manage inventory, confirm rentals, mark returns

🧑‍💼 Admin Dashboard: Manage users, view logs, analytics

🛎️ Automated Email Notifications for due and overdue books

📊 Real-time statistics and logs

🔒 Role-based session handling

📁 Folder Structure
bash
Copy
Edit
src/
├── app/             # App routes (Next.js App Router)
│   └── dashboard/   # User/Admin/Staff dashboards
├── lib/             # Utilities (e.g., mailer, dbConnect)
├── models/          # Mongoose models
├── scripts/         # Server-side scripts (e.g., email reminders)
📨 Sending Due Emails (Manual Script)
Run this to send reminders:

bash
Copy
Edit
node scripts/sendDueEmails.cjs
📦 Tech Stack
Frontend: React, Next.js App Router

Backend: Node.js, Express-style APIs

Database: MongoDB + Mongoose

Mail: Nodemailer + Gmail SMTP
