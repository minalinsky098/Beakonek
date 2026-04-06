# Beakonek: A Real-Time Seismic Alert Application through Short Messaging System (SMS)

## Introduction 
  Beakonek is a disaster alert application designed to keep families connected during seismic events. The name is a bilingual portmanteau from the English word “beacon” and the Filipino slang “konek” (connect), which together convey the meaning “be connected.” The application serves as an early warning and communication system that enables stakeholders to take timely and appropriate actions, thereby reducing the potential impact of earthquakes on lives and property.

  By leveraging real-time seismic data from the United States Geological Survey (USGS), Beakonek utilizes Short Messaging System (SMS) technology to deliver alerts. This approach ensures accessibility even in areas with limited internet connectivity. The system not only provides critical information about earthquakes but also helps address the psychological impact of disasters by keeping families informed about their loved ones.

## Objectives
Specifically, the application aims to:
1. Provide real-time alerts by delivering immediate notifications to emergency contacts of users about seismic activities as they occur. 
2. Ensure functionality for users in areas with weak or no internet access by utilizing SMS-based communication. 
3. Deliver location-specific notifications relevant to the user’s geographic location and proximity to earthquake events.


## Scope and Limitation
The scope of the study focuses on the implementation of Beakonek within the Philippines, especially in areas with low connectivity. The system is designed to operate using telecommunications networks such as Globe and DITO, ensuring that emergency contacts of users in affected regions can receive earthquake alerts through SMS-based communication despite limited internet access.

The application depends on data from the United States Geological Survey (USGS), drawn from existing literature, which is not specifically tailored to Philippine seismic conditions. Furthermore, due to financial constraints, iOS and Smart Network users are not supported, as PhilSMS requires a ₱1000 fee for a sender ID, while Apple requires a developer account costing $100 per year.

For evaluation purposes, earthquake alerts are currently simulated rather than based on real seismic events. The initial program that fetches data from the USGS is implemented in Python and runs every two minutes. However, instead of using actual earthquake data, it generates payloads that mimic the same information obtained from the USGS, such as latitude, longitude, earthquake ID, and location. Lastly, the application provides limited customization features, including the inability for users to edit their profiles, such as changing their username or profile picture.


## Technical Stack
### Programming Languages:
1.	TypeScript 
2.	JavaScript 
3.	Python 
4.	Cascading Style Sheets (CSS)
### Frameworks:
1.	React Native 
2.	Expo 
3.	NativeWind 
### Backend Dependencies
1.	APScheduler (v3.11.2) 
2.	FastAPI (v0.135.3) 
3.	Haversine (v2.9.0) 
4.	HTTPX (v0.28.1) 
5.	Pydantic (v2.12.5) 
6.	Python-dotenv (v1.2.2) 
7.	Supabase (v2.28.3) 
8.	Uvicorn

To install the required Python packages, run:
pip install -r requirements.txt
### API Endpoints
1.	/api/v1/logs (GET) 
2.	/api/v1/relatives (GET, POST) 
3.	/api/v1/users (GET, PUT) 
4.	/api/v1/recentearthquakes (GET) 
5.	/api/v1/otp/requests (POST) 
6.	/api/v1/otp/authentications (POST) 
7.	/api/v1/simulate_earthquakes (POST) 
8.	/api/v1/relatives/{relative_id} (PUT, DELETE) 
9.	/api/v1/location (PUT) 
10.	/api/logs/{log_id} (DELETE) 
11.	/api/v1/logout (POST) 

## System Flow
1.	User opens the application. 
2.	User signs up for an account. 
3.	User receives a One-Time Password (OTP) and enters it correctly for verification. 
4.	If the account already exists, the user logs in and completes OTP verification again. 
5.	User grants location permissions. 
6.	The system redirects the user to the home screen. 
7.	The user can then add emergency contacts.

## Installation Guide
1.	Locate and click the APK file. 
2.	Allow permissions for installation when prompted. 
3.	Wait for the installation process to complete. 
4.	Navigate to the home screen and open the application. 

## Recommendations
1.	Integrate data from PHIVOLCS to provide more accurate seismic information. 
2.	Enhance the application’s UI/UX with additional interactive and user-friendly features. 
3.	Expand compatibility to support more SIM networks. 
4.	Integrate SMS functionality for use by NGOs and emergency responders. 
5.	Improve the home screen by adding a log of past earthquakes and dedicated tab for managing contacts.

## Team Contributions
### UI/UX Designer
1. Gerald Arambulo
2. Steven Charl Arcallo
### Frontend Developer
1. Josh Abraham Panoy
2. Keniel De Guzman
### Backend Developer
1. Royce Albolote

## License
This project is licensed under the terms in the `LICENSE` file.
