# Beakonek

Beakonek is a mobile safety app concept that helps people stay connected during emergencies, especially earthquakes.

It is designed to make two things easier:

- Keeping your account secure with one-time passcodes (OTP).
- Help loved ones stay informed through location sharing features.

## What Problem Beakonek Solves

During stressful events, people often struggle to:

- Quickly check if family members are safe.
- Share location and well-being updates in a reliable way.

Beakonek aims to solve this with a simple mobile experience focused on trust, speed, and safety.

## Who This Is For

- Students and families who want a simple safety companion app.
- Communities preparing for natural disasters.
- Teams building disaster-readiness solutions as a school or hackathon project.

## What the App Can Do Today

- Sign up and log in using OTP verification.
- Store and manage emergency contacts/relatives.
- Update user location data using GPS.

## How It Works 

1. A user signs up using their mobile number, and is asked to enter an OTP to verify their number.
2. Once verified, the app allows access to key features like contact management and location updates.
3. When an earthquake happens in your area, Beakonek sends an SMS to your contacts and informs them about the disaster. 


## Privacy and Safety Notes

- This project is currently in development/demo mode.
- OTP only works for GLOBE users.


### Tech Stack

- Backend: FastAPI, Supabase Python SDK, Pydantic, APScheduler
- Frontend: Expo, React Native, TypeScript, Expo Router, NativeWind

### Setup

1. Install backend dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the project root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PHIL_SMS_API=your_philsms_token_optional
```

3. Start backend:

```bash
uvicorn backend.apiserver:app --reload
```

4. Start frontend:

```bash
cd frontend
npm install
npm run start
```

## Current API Base URL (Local)

`http://127.0.0.1:8000`

## License

This project is licensed under the terms in the `LICENSE` file.
