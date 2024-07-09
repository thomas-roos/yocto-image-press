import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class YoctoImagePressStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   // Layer contianing wic tools
    const lambdaLayer = new lambda.LayerVersion(this, 'MyLayer', {
       code: lambda.Code.fromDockerBuild(path.join(__dirname, '../layer'))
    });

    // const lambdaHandler = new lambda.Function(this, 'LambdaHandler', {
    //   runtime: lambda.Runtime.PYTHON_3_12,
    //   timeout: cdk.Duration.seconds(30),
    //   memorySize: 1024,
    //   handler: 'src/index-lambda.handler',
    // });

    const myFunction = new lambda.Function(this, 'MyFunction', {
      code: lambda.Code.fromAsset(path.join(__dirname, '../function')),
      handler: 'lambda_function.lambda_handler',
      memorySize: 10240,
      runtime: lambda.Runtime.PYTHON_3_12,
      layers: [lambdaLayer], // Attach the layer to the Lambda function
    });

    // const myFunction = new lambda.Function(this, 'MyFunction', {
      // code: lambda.Code.fromAsset(path.join(__dirname, '../layer')),
      // handler: 'lambda_function.lambda_handler',
      // runtime: lambda.Runtime.PYTHON_3_12,
      // layers: [lambdaLayer], // Attach the layer to the Lambda function
    // });
}
}