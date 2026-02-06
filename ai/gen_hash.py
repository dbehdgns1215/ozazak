import bcrypt

passwords = []
for i in range(20):
    hashed = bcrypt.hashpw(b'test1234!', bcrypt.gensalt())
    passwords.append(hashed.decode())
    print(f"{i+1}. {hashed.decode()}")

with open('hashed_passwords.txt', 'w') as f:
    for i, pwd in enumerate(passwords, 1):
        f.write(f"{i}. {pwd}\n")
