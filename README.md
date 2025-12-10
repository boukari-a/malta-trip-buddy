# Malta Trip Buddy 🏝️

A beautiful tourism recommendation web application for discovering the best places to visit in Malta. Built with FastAPI, MongoDB Atlas, and React.

![Malta Trip Buddy](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-green)

## 🌟 Features

- ✅ **Beautiful Malta-themed UI** - Ocean blue gradients and smooth animations
- ✅ **User Authentication** - JWT-based secure login and registration
- ✅ **MongoDB Atlas Integration** - Cloud database storage
- ✅ **Places Database** - Pre-seeded with Malta's top tourist locations
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Modern Tech Stack** - FastAPI backend + React frontend

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign Up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - For cloning the repository

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd malta-trip-buddy
```

### 2. Backend Setup

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\Activate.ps1

# Install dependencies with compatible versions
pip install -r requirements.txt
pip uninstall passlib bcrypt -y
pip install passlib==1.7.4 bcrypt==3.2.2
```

### 3. Configure MongoDB Atlas

1. **Create Cluster** in [MongoDB Atlas](https://cloud.mongodb.com)
2. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
3. **Configure Network Access**:
   - Go to "Network Access"
   - Add IP: "Allow Access from Anywhere" (0.0.0.0/0)
4. **Create Database User**:
   - Go to "Database Access"
   - Create user with admin privileges

### 4. Environment Configuration

Create `.env` file in the root directory:

```env
MONGO_URL=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_DB=malta_trip_buddy
JWT_SECRET=your-random-secret-key-here
JWT_ALGORITHM=HS256
```

**Important:** Replace `youruser`, `yourpass`, and cluster address with your actual MongoDB Atlas credentials!

### 5. Seed Database

```powershell
python seed_places.py
```

Expected output: `Inserted 4 places`

### 6. Start Backend

```powershell
uvicorn app.main:app --reload
```

Backend will run at: http://127.0.0.1:8000

### 7. Frontend Setup

Open a **NEW terminal**:

```powershell
cd frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

### 8. Test the Application!

1. Open http://localhost:5173
2. Click **"Create one"** to register
3. Enter email and password
4. See success animation!
5. Login and explore the dashboard

## 📂 Project Structure

```
malta-trip-buddy/
├── app/                      # Backend application
│   ├── routes/              # API endpoints
│   │   ├── auth.py         # Authentication routes
│   │   ├── users.py        # User routes
│   │   └── places.py       # Places routes
│   ├── models/             # Database models
│   ├── schemas/            # Pydantic schemas
│   ├── utils/              # Utility functions
│   ├── config.py           # Configuration
│   ├── database.py         # MongoDB connection
│   └── main.py             # FastAPI app
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── Login.jsx      # Login page
│   │   ├── Register.jsx   # Registration page
│   │   └── api.js         # API client
│   └── package.json
├── .env                    # Environment variables (create this)
├── .env.example           # Environment template
├── requirements.txt       # Python dependencies
├── seed_places.py        # Database seeder
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** 0.95.2 - Modern Python web framework
- **Motor** 3.1.1 - Async MongoDB driver
- **PyMongo** 4.4.0 - MongoDB Python driver
- **Pydantic** 1.10 - Data validation
- **Passlib** 1.7.4 - Password hashing
- **Python-Jose** 3.3.0 - JWT handling

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.2.2 - Build tool
- **Axios** 1.13.2 - HTTP client

### Database
- **MongoDB Atlas** - Cloud database

## 🎨 UI Features

- **Login Page** - Malta-themed with animated logo
- **Registration Page** - Multi-step validation
- **Dashboard** - Feature cards showing upcoming functionality
- **Color Palette**:
  - Primary Blue: #0077be (Mediterranean Sea)
  - Secondary Blue: #00a8cc (Bright Ocean)
  - Accent Orange: #f4a261 (Malta Sunset)

## 📚 Documentation

- **START_HERE.md** - Complete setup guide for beginners
- **MONGODB_ATLAS_SETUP.md** - Detailed MongoDB setup
- **REGISTRATION_COMPLETE.md** - Registration system docs
- **FIXES_NEEDED.md** - Known issues and solutions
- **QUICKSTART.md** - Quick reference guide

## 🐛 Troubleshooting

### bcrypt Compatibility Error
```powershell
pip uninstall passlib bcrypt -y
pip install passlib==1.7.4 bcrypt==3.2.2
```

### MongoDB Connection Failed
- Check `.env` file has correct connection string
- Verify Network Access in MongoDB Atlas (allow 0.0.0.0/0)
- Ensure database user exists with correct password
- Wait 1-2 minutes for Atlas changes to propagate

### CORS Error
CORS is already configured in `app/main.py`. If you see CORS errors, restart the backend.

### Virtual Environment Not Activating
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🔐 Security Notes

- ❗ Never commit `.env` file (already in `.gitignore`)
- ❗ Change `JWT_SECRET` to a random string in production
- ❗ Use specific IP addresses in MongoDB Atlas for production
- ❗ Enable HTTPS in production
- ❗ Use environment-specific databases (dev/staging/prod)

## 🎯 Next Steps

- [ ] Implement places listing page
- [ ] Add recommendation algorithm
- [ ] Build trip planning features
- [ ] Add favorites/bookmarks
- [ ] Integrate interactive maps
- [ ] Add user profiles and preferences
- [ ] Implement social features (reviews, ratings)

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users
- `GET /users/me` - Get current user

### Places
- `GET /places/` - Get all places

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - API documentation (ReDoc)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- FastAPI for the amazing web framework
- React team for the UI library
- MongoDB Atlas for cloud database
- Malta Tourism Authority for inspiration

---

**Need help?** Check the documentation files or open an issue!

Built with ❤️ for Malta tourism
