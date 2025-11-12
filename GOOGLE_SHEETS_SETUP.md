# Google Sheets Backend Setup

To use Google Sheets as your backend, you need to create 3 Google Sheets with specific structures.

## Step 1: Create Google Sheets

Create these 3 Google Sheets in your Google Drive:

### 1. Users Sheet
**Name**: `AI-ML-Platform-Users`
**Columns** (Row 1 headers):
```
A: id
B: name  
C: email
D: role
E: company
F: skills
G: createdAt
```

### 2. Jobs Sheet
**Name**: `AI-ML-Platform-Jobs`
**Columns** (Row 1 headers):
```
A: id
B: clientId
C: title
D: description
E: skills
F: budget
G: status
H: createdAt
```

### 3. Applications Sheet
**Name**: `AI-ML-Platform-Applications`
**Columns** (Row 1 headers):
```
A: id
B: jobId
C: freelancerId
D: status
E: createdAt
```

## Step 2: Get Sheet IDs

For each sheet:
1. Open the Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Copy the SHEET_ID_HERE part

## Step 3: Update Configuration

Update the `SHEET_IDS` in `/src/lib/googleSheetsClient.ts`:

```typescript
const SHEET_IDS = {
  USERS: 'your_users_sheet_id_here',
  JOBS: 'your_jobs_sheet_id_here', 
  APPLICATIONS: 'your_applications_sheet_id_here'
};
```

## Step 4: Make Sheets Public

For each sheet:
1. Click "Share" button
2. Change access to "Anyone with the link can view"
3. Click "Done"

## API Key Details

The API key `AIzaSyDlPW0qv_k7ynZPheCD_1hrCHFowXhIv2I` is already configured.

## Features

- ✅ User registration and login
- ✅ Job posting and viewing
- ✅ Application management
- ✅ Simple session management
- ✅ No complex database setup required

## Limitations

- No real password authentication (simplified for demo)
- Basic session management
- Read/append only operations (no updates/deletes)
- Rate limits from Google Sheets API

This is perfect for prototyping and simple applications!