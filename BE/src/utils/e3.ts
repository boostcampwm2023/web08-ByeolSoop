import "dotenv/config";
import { S3, Endpoint } from "aws-sdk";
import { ReadStream, createReadStream } from "fs";

const endpoint = new Endpoint("https://kr.object.ncloudstorage.com");
const region = "kr-standard";
const access_key = process.env.API_ACCESS_KEY;
const secret_key = process.env.API_SECRET_KEY;

const s3 = new S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});

export async function getFileFromS3(fileName: string): Promise<object> {
  const readStream = s3
    .getObject({
      Bucket: "byeolsoop-bucket",
      Key: fileName,
    })
    .createReadStream();

  return readStream;
}

// export async function uploadFileToS3(): Promise<void> {
//   await s3
//     .putObject({
//       Key: key,
//       Body: "파일 데이터",
//       Bucket: "byeolsoop-bucket",
//     })
//     .promise();
// }

// export async function getURLFromS3(fileName: string): Promise<string> {
//   const url: string = await new Promise((r) => {
//     s3.getSignedUrl(fileName, params, async (err, url) => {
//       if (err) {
//         throw err;
//       }
//       r(url.split("?")[0]);
//     });
//   });
//   return url;
// }
