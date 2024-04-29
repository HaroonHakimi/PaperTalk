import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import os from "os";
import { Readable } from "stream";

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-east-2",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.getObject(params);

      const tempDir = os.tmpdir(); // Get the system's temporary directory
      const file_name = `${tempDir}/haroon${Date.now().toString()}.pdf`;

      if (obj.Body instanceof Readable) { // Ensure it's a ReadableStream
        const file = fs.createWriteStream(file_name);
        obj.Body.pipe(file);
        file.on("finish", () => {
          return resolve(file_name);
        });
      } else {
        reject(new Error("Body is not a readable stream"));
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}



// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");