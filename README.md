StayEase 🏡
Your Home Away From Home

StayEase is a full-stack web application inspired by platforms like Airbnb, where users can explore, create, and manage property listings with an intuitive and modern interface.
It provides a seamless experience for discovering stays, viewing detailed property information, and managing listings efficiently.

🔗 Live Demo: StayEase Live App
🔗 GitHub Repository: StayEase GitHub Repository

✨ Features
🏠 Browse all available property listings
📍 View detailed information for each listing
🖼️ Upload and display listing images
🔐 User authentication & authorization
➕ Add new listings
✏️ Edit existing listings
❌ Delete listings
🌐 Responsive UI for desktop and mobile
⚡ Smooth user experience with clean design
🛠️ Tech Stack
Frontend
HTML
CSS
JavaScript
Bootstrap / EJS
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
Authentication
Passport.js

🚀 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/The-nithub/StayEase.git
cd StayEase
2️⃣ Install dependencies
npm install
3️⃣ Create a .env file

Add the following environment variables:

ATLASDB_URL=your_mongodb_url
SECRET=your_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_secret
4️⃣ Run the project
node app.js

or

npm start
📂 Project Structure
StayEase/
│
├── models/          # Database schemas
├── routes/          # Express routes
├── views/           # EJS templates
├── public/          # Static assets
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── app.js           # Main server file
└── package.json
🔐 Authentication & Authorization

StayEase uses secure authentication and authorization mechanisms to ensure that:

Only logged-in users can create listings
Only owners can edit or delete their listings
Protected routes are secured using middleware
Cloud & Deployment
Cloudinary (Image Storage)
Render (Deployment)
