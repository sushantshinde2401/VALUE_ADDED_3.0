# Certificate Management System - Backend

## Environment Setup

This backend uses environment variables for secure configuration management. Follow these steps to set up your environment:

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific configuration:
   ```bash
   # Flask Configuration
   FLASK_HOST=0.0.0.0
   FLASK_PORT=5000
   FLASK_DEBUG=True

   # Google Drive API Configuration
   GOOGLE_DRIVE_CREDENTIALS_FILE=credentials.json
   GOOGLE_DRIVE_TOKEN_FILE=token.json
   GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE=service-account.json
   GOOGLE_DRIVE_SCOPES=https://www.googleapis.com/auth/drive.file

   # File Storage Configuration
   UPLOAD_FOLDER=uploads
   STATIC_FOLDER=static

   # QR Code Configuration
   QR_VERSION=1
   QR_BOX_SIZE=10
   QR_BORDER=4

   # Security Configuration
   MAX_FILE_SIZE=50000000  # 50MB in bytes
   ALLOWED_EXTENSIONS=pdf,jpg,jpeg,png,doc,docx

   # Application Configuration
   APP_NAME=Certificate Management System
   BASE_URL=http://localhost:5000
   ```

### 3. Google Drive API Setup

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Drive API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it

3. **Create Credentials:**
   
   **Option A: OAuth 2.0 (Recommended for development)**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Desktop application"
   - Download the JSON file and save as `credentials.json` in the backend folder

   **Option B: Service Account (Recommended for production)**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Download the JSON file and save as `service-account.json` in the backend folder

### 4. Security Notes

- **Never commit sensitive files to version control:**
  - `credentials.json`
  - `token.json`
  - `service-account.json`
  - `.env`

- **For production deployment:**
  - Use environment variables instead of `.env` file
  - Use service account authentication
  - Set `FLASK_DEBUG=False`
  - Use a proper WSGI server (gunicorn, uwsgi)

### 5. Running the Server

```bash
python upload_qr.py
```

The server will start on the configured host and port (default: http://localhost:5000)

## API Endpoints

### POST /upload
Upload a file and get a shareable link with QR code.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (pdf, jpg, jpeg, png, doc, docx)

**Response:**
```json
{
  "success": true,
  "drive_link": "https://drive.google.com/file/d/...",
  "qr_image": "base64_encoded_qr_code",
  "filename": "uploaded_file.pdf",
  "storage_type": "google_drive"
}
```

### GET /files/<filename>
Serve uploaded files from local storage.

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_HOST` | Flask server host | `0.0.0.0` |
| `FLASK_PORT` | Flask server port | `5000` |
| `FLASK_DEBUG` | Enable debug mode | `True` |
| `GOOGLE_DRIVE_CREDENTIALS_FILE` | OAuth credentials file | `credentials.json` |
| `GOOGLE_DRIVE_TOKEN_FILE` | OAuth token file | `token.json` |
| `GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE` | Service account file | `service-account.json` |
| `GOOGLE_DRIVE_SCOPES` | Google Drive API scopes | `https://www.googleapis.com/auth/drive.file` |
| `UPLOAD_FOLDER` | Local upload directory | `uploads` |
| `STATIC_FOLDER` | Static files directory | `static` |
| `MAX_FILE_SIZE` | Maximum file size in bytes | `50000000` (50MB) |
| `ALLOWED_EXTENSIONS` | Allowed file extensions | `pdf,jpg,jpeg,png,doc,docx` |
| `QR_VERSION` | QR code version | `1` |
| `QR_BOX_SIZE` | QR code box size | `10` |
| `QR_BORDER` | QR code border size | `4` |
| `APP_NAME` | Application name | `Certificate Management System` |
| `BASE_URL` | Base URL for the application | `http://localhost:5000` |

## Troubleshooting

1. **Google Drive authentication issues:**
   - Ensure you've added yourself as a test user in Google Cloud Console
   - Check that the Google Drive API is enabled
   - Verify credentials.json is in the correct location

2. **File upload issues:**
   - Check file size limits
   - Verify file extension is allowed
   - Ensure upload directory has write permissions

3. **Environment variable issues:**
   - Verify .env file exists and is properly formatted
   - Check that python-dotenv is installed
   - Ensure no spaces around the = sign in .env file
