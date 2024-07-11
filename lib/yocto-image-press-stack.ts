import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class YoctoImagePressStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Create S3 bucket
    const bucket = new s3.Bucket(this, 'MyBucket');

    // Upload a file to the S3 bucket
    new s3_deployment.BucketDeployment(this, 'DeployFile', {
      sources: [s3_deployment.Source.asset(path.join(__dirname, '../data'))],
      destinationBucket: bucket,
    });

    // Layer containing wic tools
    const lambdaLayer = new lambda.LayerVersion(this, 'MyLayer', {
       code: lambda.Code.fromDockerBuild(path.join(__dirname, '../layer'))
    });

    // Lambda function to create the image
    const myFunction = new lambda.Function(this, 'MyFunction', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../function')),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      handler: 'lambda_function.lambda_handler',
      memorySize: 10240,
      ephemeralStorageSize: cdk.Size.mebibytes(10240),
      timeout: cdk.Duration.seconds(600),
      runtime: lambda.Runtime.FROM_IMAGE,
      layers: [lambdaLayer], // Attach the layer to the Lambda function
    });

    // Grant the Lambda function read permissions to the S3 bucket
    bucket.grantReadWrite(myFunction);
  }
}
