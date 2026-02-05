from langsmith import Client
import json
import os
from dotenv import load_dotenv

load_dotenv()

try:
    client = Client()
    run_id = "019c2f05-080e-7633-aef1-5cd020b21b2e"
    print(f"Fetching run: {run_id}...")
    
    run = client.read_run(run_id)
    
    print("\n=== INPUTS ===")
    print(json.dumps(run.inputs, indent=2, ensure_ascii=False))
    
    print("\n=== OUTPUTS ===")
    print(json.dumps(run.outputs, indent=2, ensure_ascii=False))
    
    if run.error:
        print("\n=== ERROR ===")
        print(run.error)
        
except Exception as e:
    print(f"Error fetching trace: {e}")
