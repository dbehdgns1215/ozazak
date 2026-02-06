import re

file_path1 = r'c:\SSAFY\GONGTONG\S14P11B205\back\infra\src\main\resources\db\migration\V20260202011117__insert_cover_letter_test_data.sql'

# Read file 1
try:
    with open(file_path1, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count occurrences  
    count_upper = content.count("'V1'")
    count_lower = content.count("'v1'")
    
    print(f"File 1 (V20260202011117):")
    print(f"  Before - Uppercase 'V1': {count_upper}, Lowercase 'v1': {count_lower}")
    
    # Replace ALL 'V1' with 'v1'
    if count_upper > 0:
        new_content = content.replace("'V1'", "'v1'")
        
        # Write back
        with open(file_path1, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  After - Replaced {count_upper} occurrences")
    else:
        print(f"  No changes needed")
except Exception as e:
    print(f"File 1: {e}")

print("\n✅ All files processed!")
