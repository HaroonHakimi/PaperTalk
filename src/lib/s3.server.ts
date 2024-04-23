import AWS from "aws-sdk";
import fs from 'fs'
import path from "path";

export async function downloadFromS3(file_key: string) {
  try {
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: "us-east-2",
    });

    const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key
    }

    // Download from S3
    const obj = await s3.getObject(params).promise();
    if (!obj.Body) {
      throw new Error("Empty response body from S3");
    }

    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    const file_name = path.join(tmpDir, `pdf-${Date.now()}.pdf`);

    // Write to file
    fs.writeFileSync(file_name, obj.Body as Buffer);
    console.log("File downloaded:", file_name);
    return file_name;

  } catch (error) {
    console.error("Error downloading from S3:", error);
    return null;
  }
}

