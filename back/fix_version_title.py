import re

file_path = r'c:\SSAFY\GONGTONG\S14P11B205\back\infra\src\main\resources\db\migration\V20260202013118__insert_cover_letter_test_data.sql'

# Read file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Count occurrences  
count_upper = content.count("'V1'")
count_lower = content.count("'v1'")

print(f"Before:")
print(f"  Uppercase 'V1': {count_upper}")
print(f"  Lowercase 'v1': {count_lower}")

# Replace ALL 'V1' with 'v1'
new_content = content.replace("'V1'", "'v1'")

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\nAfter:")
print(f"  All 'V1' replaced with 'v1'")
print(f"  Total replacements: {count_upper}")
