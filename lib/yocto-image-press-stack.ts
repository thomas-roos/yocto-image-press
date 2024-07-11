import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecrAssets from 'aws-cdk-lib/aws-ecr-assets';
import * as path from 'path';

export class YoctoImagePressStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket
    const bucket = new s3.Bucket(this, 'MyBucket');

    // Upload a file to the S3 bucket
    // new s3_deployment.BucketDeployment(this, 'DeployFile', {
      // sources: [s3_deployment.Source.asset(path.join(__dirname, '../data'))],
      // destinationBucket: bucket,
    // });

    // Define Docker containing wic tools
    const dockerImageAsset = new ecrAssets.DockerImageAsset(this, 'MyDockerImageAsset', {
      directory: path.join(__dirname, '../lambda'),
    });

    const myFunction = new lambda.DockerImageFunction(this, 'MyFunction', {
      code: lambda.DockerImageCode.fromEcr(dockerImageAsset.repository,  {
          tagOrDigest: dockerImageAsset.imageTag
      }),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      memorySize: 10240,
      ephemeralStorageSize: cdk.Size.mebibytes(10240),
      timeout: cdk.Duration.seconds(600)
    })

    // Grant the Lambda function read permissions to the S3 bucket
    bucket.grantReadWrite(myFunction);

  }
}
