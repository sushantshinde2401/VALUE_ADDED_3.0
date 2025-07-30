from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import io
import qrcode
import base64
from werkzeug.utils import secure_filename
import datetime
import uuid

# Optional Google Drive imports
try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseUpload
    GOOGLE_DRIVE_AVAILABLE = True
except ImportError:
    GOOGLE_DRIVE_AVAILABLE = False

app = Flask(__name__)
CORS(app)

# Configuration
SCOPES = ['https://www.googleapis.com/auth/drive.file']
UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_FOLDER, exist_ok=True)

def get_drive_service():
    """Get Google Drive service if credentials are available"""
    if not GOOGLE_DRIVE_AVAILABLE:
        raise Exception("Google Drive API libraries not available")
        
    creds = None
    try:
        # Try service account first (no OAuth required)
        if os.path.exists('service-account.json'):
            print("[INFO] Using service account authentication")
            from google.oauth2 import service_account
            creds = service_account.Credentials.from_service_account_file(
                'service-account.json', scopes=SCOPES)
            print("[OK] Service account credentials loaded")
            return build('drive', 'v3', credentials=creds)
        
        # Fallback to OAuth flow
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
            print("[OK] Using existing token.json")
        else:
            if not os.path.exists('credentials.json'):
                raise Exception("credentials.json not found")
            print("[WARNING] No token.json found, starting OAuth flow...")
            print("[INFO] If you get 'access blocked' error, add yourself as test user in Google Cloud Console")
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
            with open('token.json', 'w') as token:
                token.write(creds.to_json())
            print("[OK] New token.json created")
        
        # Check if credentials are valid
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("[INFO] Refreshing expired credentials...")
                try:
                    from google.auth.transport.requests import Request
                    creds.refresh(Request())
                    with open('token.json', 'w') as token:
                        token.write(creds.to_json())
                    print("[OK] Credentials refreshed")
                except Exception as refresh_error:
                    print(f"[ERROR] Failed to refresh credentials: {str(refresh_error)}")
                    print("[INFO] Removing invalid token, will need to re-authenticate")
                    if os.path.exists('token.json'):
                        os.remove('token.json')
                    # Start fresh OAuth flow
                    if not os.path.exists('credentials.json'):
                        raise Exception("credentials.json not found")
                    print("[WARNING] Starting fresh OAuth flow...")
                    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
                    creds = flow.run_local_server(port=0)
                    with open('token.json', 'w') as token:
                        token.write(creds.to_json())
                    print("[OK] New token.json created")
            else:
                raise Exception("Invalid credentials")
                
        return build('drive', 'v3', credentials=creds)
    except Exception as e:
        print(f"[ERROR] Error in get_drive_service: {str(e)}")
        raise

def upload_to_drive(file_bytes, filename):
    """Upload to Google Drive and return shareable link"""
    try:
        print(f"[INFO] Starting upload for: {filename} ({len(file_bytes)} bytes)")
        
        # Check if Google Drive is available and credentials exist
        if not GOOGLE_DRIVE_AVAILABLE:
            raise Exception("Google Drive API libraries not available")
            
        if not (os.path.exists('credentials.json') or os.path.exists('token.json')):
            raise Exception("Google Drive credentials not found")
        
        # Upload to Google Drive
        service = get_drive_service()

        file_metadata = {
            'name': filename,
            'mimeType': 'application/pdf'
        }
        media = MediaIoBaseUpload(io.BytesIO(file_bytes), mimetype='application/pdf')
        
        print("[INFO] Uploading to Google Drive...")
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        file_id = file.get('id')
        
        if not file_id:
            raise Exception("Failed to get file ID from Google Drive")
        
        print(f"[OK] File uploaded with ID: {file_id}")

        # Make file shareable
        print("[INFO] Making file publicly accessible...")
        service.permissions().create(
            fileId=file_id,
            body={'type': 'anyone', 'role': 'reader'}
        ).execute()
        
        drive_link = f"https://drive.google.com/file/d/{file_id}/view?usp=sharing"
        print(f"[OK] File is now shareable: {drive_link}")
        return drive_link
        
    except Exception as e:
        print(f"[ERROR] Error in upload_to_drive: {str(e)}")
        raise

def save_file_locally(file_bytes, filename):
    """Save file locally and return a local URL"""
    try:
        # Generate unique filename to avoid conflicts
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        safe_filename = f"{timestamp}_{unique_id}_{filename}"
        
        file_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        
        print(f"[INFO] Saving file locally: {file_path}")
        with open(file_path, 'wb') as f:
            f.write(file_bytes)
        
        # Create a local URL that can be accessed via the Flask server
        local_url = f"http://localhost:5000/files/{safe_filename}"
        print(f"[OK] File saved locally, accessible at: {local_url}")
        
        return local_url
        
    except Exception as e:
        print(f"[ERROR] Error saving file locally: {str(e)}")
        raise

def generate_qr_base64(link):
    try:
        print(f"[INFO] Generating QR code for: {link}")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(link)
        qr.make(fit=True)
        
        qr_img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        qr_img.save(buffer, format="PNG")
        
        qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        print("[OK] QR code generated successfully")
        return qr_base64
        
    except Exception as e:
        print(f"[ERROR] Error in generate_qr_base64: {str(e)}")
        raise

@app.route('/upload', methods=['POST'])
def upload_pdf():
    print("\n[INFO] New upload request received")
    
    # Check if PDF file is in request
    if 'pdf' not in request.files:
        print("[ERROR] No PDF file found in request")
        return jsonify({"error": "No PDF uploaded"}), 400

    pdf_file = request.files['pdf']
    
    # Check if file is actually selected
    if pdf_file.filename == '':
        print("[ERROR] No file selected")
        return jsonify({"error": "No file selected"}), 400
    
    filename = secure_filename(pdf_file.filename)
    if not filename:
        filename = "certificate.pdf"  # Fallback filename
    
    print(f"[INFO] Processing file: {filename}")
    
    try:
        pdf_bytes = pdf_file.read()
        
        if len(pdf_bytes) == 0:
            print("[ERROR] Empty file received")
            return jsonify({"error": "Empty file received"}), 400
        
        print(f"[INFO] File size: {len(pdf_bytes)} bytes")
        
        # Try to upload to Google Drive first
        try:
            drive_link = upload_to_drive(pdf_bytes, filename)
            
            # Generate QR code for Google Drive link
            qr_image = generate_qr_base64(drive_link)

            print("[SUCCESS] Google Drive upload and QR generation completed successfully\n")
            return jsonify({
                "success": True,
                "drive_link": drive_link,
                "qr_image": qr_image,
                "filename": filename,
                "storage_type": "google_drive"
            })
            
        except Exception as drive_error:
            print(f"[WARNING] Google Drive upload failed: {str(drive_error)}")
            print("[INFO] Falling back to local storage...")
            
            # Fallback to local storage
            local_link = save_file_locally(pdf_bytes, filename)
            qr_image = generate_qr_base64(local_link)
            
            print("[SUCCESS] Local storage and QR generation completed successfully\n")
            return jsonify({
                "success": True,
                "drive_link": local_link,
                "qr_image": qr_image,
                "filename": filename,
                "storage_type": "local",
                "warning": "Uploaded to local storage. QR code may not work on other devices."
            })
        
    except Exception as e:
        error_msg = str(e)
        print(f"[ERROR] Upload failed: {error_msg}\n")
        return jsonify({"error": error_msg}), 500

@app.route('/files/<filename>')
def serve_file(filename):
    """Serve uploaded files from the uploads directory"""
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    print("[INFO] Starting Flask server for Certificate Management System")
    print("[INFO] Server will run on: http://localhost:5000")
    print("[INFO] Upload endpoint: http://localhost:5000/upload")
    print("\n" + "="*50)
    app.run(host='0.0.0.0', port=5000, debug=True)
