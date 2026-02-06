import bcrypt
print(bcrypt.hashpw(b'test1234!', bcrypt.gensalt()).decode())
