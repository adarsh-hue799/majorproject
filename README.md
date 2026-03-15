PMSSS Scholarship Portal
A web application built for the Prime Minister's Special Scholarship Scheme (PMSSS) as part of Smart India Hackathon (SIH). The platform manages the scholarship lifecycle across three user roles: students, SAG Bureau, and Finance Bureau.
---
Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ODM)
Templating: EJS with ejs-mate layouts
Authentication: Passport.js (passport-local + passport-local-mongoose)
File Uploads: Multer + Cloudinary (PDF, JPEG, PNG — max 5MB)
Session: express-session + connect-mongo
Other: method-override, connect-flash, dotenv
---
Features
Student Portal
Register and log in
Upload documents to Cloudinary (Aadhaar, income certificate, marksheets, etc.)
View previously uploaded documents and submission status
View announcements, scholarship info, and application history
SAG Bureau Dashboard
Log in as SAG Bureau role
View and manage student applications
Approve or reject applications
Generate reports, view statistics, give feedback
Finance Bureau Dashboard
Log in as Finance Bureau role
View pending and completed disbursements
Track received applications and total disbursement summary
---
Project Structure
```
SIH_majorProject/
├── app.js                  # Main Express app, all routes
├── cloudConfig.js          # Cloudinary + multer-storage-cloudinary setup
├── middleware.js            # isAuthenticated, saveRedirectUrl
├── models/
│   ├── user.js             # User schema (student / SAG Bureau / Finance Bureau)
│   ├── document.js         # Document schema (userId, type, url)
│   └── application.js      # Application schema (userId, documents, status)
├── views/
│   ├── home.ejs
│   ├── students/           # signup, login, dashboard, upload, etc.
│   ├── sag/                # login, dashboard, manageappln, etc.
│   └── finance/            # login, dashboard, disbursements, etc.
├── public/                 # Static assets
├── init/                   # Seed data scripts
├── package.json
└── .env                    # Environment variables (not committed)
```
---
Getting Started
Prerequisites
Node.js
MongoDB running locally on port `27017`
A Cloudinary account
Installation
```bash
git clone https://github.com/adarsh-hue799/majorproject
cd majorproject
npm install
```
Environment Variables
Create a `.env` file in the root directory:
```
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```
Run the App
```bash
npm start
```
The server starts at `http://localhost:8080`.
---
Routes Overview
Method	Route	Description
GET	`/`	Home page
GET/POST	`/signup`	Student registration
GET/POST	`/login/student`	Student login
GET/POST	`/login/sag`	SAG Bureau login
GET/POST	`/login/finance`	Finance Bureau login
GET/POST	`/login/student/upload`	Upload documents (authenticated)
GET	`/login/student/dashboard`	Student dashboard
GET	`/login/sag/dashboard`	SAG Bureau dashboard
GET	`/login/sag/manageappln`	Manage student applications
POST	`/applications/:id/approve`	Approve an application
POST	`/applications/:id/reject`	Reject an application
GET	`/login/finance/dashboard`	Finance Bureau dashboard
---
User Roles
Defined in the `User` model:
Role	Login URL
`student`	`/login/student`
`SAG Bureau`	`/login/sag`
`Finance Bureau`	`/login/finance`
Each login endpoint checks the user's `role` field and redirects to the correct dashboard.
---
Notes
This project is partially complete and under active development.
MongoDB must be running locally — no Atlas URI is configured by default.
The `.env` file must be set up before running.
