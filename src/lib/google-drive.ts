import { PassThrough } from 'stream';
import { google } from 'googleapis';
import path from 'path';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.DRIVE_REFRESH_TOKEN
});

const drive = google.drive({ 
  version: 'v3', 
  auth: oauth2Client 
});

export const fileIdToLink = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

export const folderIdToLink = (folderId: string): string => {
  return `https://drive.google.com/drive/folders/${folderId}`;
};

export const extractLinkDrive = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const driveId = urlObj.searchParams.get('id') || urlObj.pathname.split('/').pop();
    return driveId || null;
  } catch (error) {
    console.error('Error extracting Drive ID:', error);
    throw new Error('Invalid URL');
  }
};

export async function SaveOneFileToDrive(
  file: File | Buffer,
  fileName: string,
  mimeType?: string,
  folderId = '1_MwmGF73Vs3SjiCEEdXv3Pp9b8xoknPu'
): Promise<string> {
  try {
    // Handle buffer conversion based on input type
    let buffer: Buffer;
    let fileType: string;
    let originalName: string;

    if (file instanceof Buffer) {
      buffer = file;
      fileType = mimeType || 'application/octet-stream';
      originalName = fileName;
    } else {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      fileType = file.type;
      originalName = file.name;
    }

    const bufferStream = new PassThrough();
    bufferStream.end(buffer);

    const fileExtension = path.extname(originalName) || '';

    const fileMetadata = {
      name: `${fileName}${fileExtension}`,
      parents: [folderId],
    };

    const media = {
      mimeType: fileType,
      body: bufferStream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    if (!response.data.id) {
      throw new Error('Failed to retrieve file ID');
    }

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return fileIdToLink(response.data.id);
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to upload file to Google Drive');
  }
} 