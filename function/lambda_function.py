import subprocess
import json

def lambda_handler(event, context):
    # Construct the command to run the binary with arguments
    command = '''/usr/bin/bash -c 'find / -name poky' '''
    try:
        # Run the binary and capture the output
        result = subprocess.run([command], capture_output=True, text=True, shell=True)
        print("result.stdout:" + result.stdout)

        # Check for errors
        if result.returncode != 0:
            return {
                'statusCode': 500,
                'body': f"Error: {result.stderr}"
            }

        # Return the output of the binary
        return {
            'statusCode': 200,
            'body': result.stdout
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
        
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