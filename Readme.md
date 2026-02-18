# Lokal Assessment 

## Steps to Setup : 

### Step 1 : 
```
cd backend 
```

### Step 2 : 
```
Add the following in the SMTP_PASS in the .env PASS = iigh zqhm zsvs scik
(Note : I have not deleted so that it becomes easier for setup)
```

### Step 3 : Now run the Backend
```
cd backend
npm install
npm run dev
```

### Step 4 : Now run the FrontEnd
```
cd frontend
npm install
npm run dev
```

```
Now the server is upplease lead on to the url : http://localhost:5173
```

## Basic Flow of the Assessment : 
```
Type the email and then → click "Send OTP"
    → POST /api/send-otp
    → The backend generates 6-digit code
    → Nodemailer library sends email to inbox
    → frontend is redirected to OTP screen

User recieves an email in the inbox of the email installed, enter the 6-digit code
    → POST /api/verify-otp
    → The backend server validates: expiry, attempts, code
    → WHen the response is success → Session screen with live timer

User clicks Logout
    → analytics event is called 
    → The user is redirected back to the logout screen
```