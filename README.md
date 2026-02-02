# Smart Attendance System (ESP32 + RFID + Google Sheets)
A simple IoT-based attendance system using ESP32 and RFID cards.


## Features
- RFID card scanning
- Google Sheets integration
- Real-time website dashboard
- Daily auto reset


## Tech Stack
- ESP32
- Arduino C++
- Google Apps Script
- HTML / CSS / JavaScript


## Project Structure
arduino/        → ESP32 code  
google-script/  → Apps Script files  
website/        → Frontend dashboard  
docs/           → Images & diagrams


## Setup

1. Upload Arduino code to ESP32.
2. Deploy Google Apps Script as **Web App**.
3. Set Script Properties in Google Apps Script.
4. Replace API URL in `script.js`.
5. Open `index.html` in browser or deploy with GitHub Pages.


## Configuration

Before running the project, you need to set your own configuration values.

### Google Apps Script Properties
Open your Apps Script project and go to **Project Settings → Script Properties**, then add:

FILE_ID   = your_drive_file_id  
FOLDER_ID = your_drive_folder_id  
SPREADSHEET_ID = your_spreadsheet_id  

### Website API URL
In `script.js`, replace:

const API_URL = "YOUR_APPS_SCRIPT_URL";

with your deployed Google Apps Script Web App URL.



## How It Works
When an RFID card is scanned, the ESP32 sends the UID to a Google Apps Script.
The script stores the data in Google Sheets.
The website fetches the sheet data every 2 seconds and updates the table.


## Challenges
- Handling duplicate scans within 60 seconds
- ESP32 WiFi reconnect issues
- Google Script deployment permissions


## Future Improvements
- Add user authentication
- Mobile app version
- Database instead of Google Sheets
