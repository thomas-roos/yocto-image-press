import subprocess
import json
import boto3
import os
import time

s3 = boto3.client('s3')

def handler(event, context):
    bucket_name = os.environ['BUCKET_NAME']
    golden_image = "aws-greengrass-test-image-raspberrypi5.rpi-sdimg"
    custom_image = "aws-greengrass-test-image-raspberrypi5.rpi-sdimg-modified"
    local_path = '/tmp/image'

    try:
        # Download the file from S3
        start_time = time.time()
        s3.download_file(bucket_name, golden_image, local_path)
        end_time = time.time()
        download_time = end_time - start_time
        print(f"Download time: {download_time} seconds")
        
        # Execute a command
        start_time = time.time()
        command = '/usr/bin/bash -c "/function/poky/scripts/wic cp /function/lambda_function.py /tmp/image:2/"'
        result = subprocess.run(command, capture_output=True, text=True, shell=True)
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"Execution time: {execution_time} seconds")
        
        print("result.stdout:" + result.stdout)

        # Check for errors
        if result.returncode != 0:
            return {
                'statusCode': 500,
                'body': f"Error: {result.stderr}"
            }

        # Upload the modified file back to S3
        start_time = time.time()
        s3.upload_file(local_path, bucket_name, custom_image)
        end_time = time.time()
        upload_time = end_time - start_time
        print(f"Upload time: {upload_time} seconds")

        print(f"Successfully modified and uploaded {custom_image} back to {bucket_name}")

        # Return the output of the binary
        return {
            'statusCode': 200,
            'body': result.stdout,
            'timings': {
                'download_time': download_time,
                'execution_time': execution_time,
                'upload_time': upload_time
            }
        }

    except Exception as e:
        print(e)
        raise e 
        
def main():
    # Example event to simulate the Lambda input
    event = {
        "parameters": ["param1", "param2"]
    }
    
    # Simulated context (not used in this example)
    context = {}
    
    # Call the Lambda handler
    response = lambda_handler(event, context)
    
    # Print the response
    print(json.dumps(response, indent=2))

if __name__ == "__main__":
    main()
