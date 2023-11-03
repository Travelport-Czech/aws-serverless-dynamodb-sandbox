import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getConfig } from '../config';

const checkBucketExists = async (bucket: string) => {
  const client = new S3Client();
  const options = {
    Bucket: bucket,
  };

  try {
    console.info(`Checking bucket ${config.s3.deploymentBucket}...`);
    await client.send(new HeadBucketCommand(options));
  } catch (error) {
    // @ts-ignore
    if (error['$metadata'].httpStatusCode !== 404) {
      throw error;
    }

    console.info(
      `Bucket ${config.s3.deploymentBucket} does not exist, creating...`,
    );
    const client = new S3Client();
    const options = {
      Bucket: config.s3.deploymentBucket,
    };
    await client.send(new CreateBucketCommand(options));
  }
};

const config = getConfig();

checkBucketExists(config.s3.deploymentBucket).catch((error: any) => {
  console.error(error);
  process.exit(1);
});
