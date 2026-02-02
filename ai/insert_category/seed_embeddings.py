
import psycopg2
import os
import re
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": "localhost",
    "database": "ozazak",
    "user": "b205admin",
    "password": "b205admin", 
    "port": "5432"
}

SQL_FILE = "V4__seed_category_embeddings.sql"

def main():
    if not os.path.exists(SQL_FILE):
        print(f"❌ Error: {SQL_FILE} not found.")
        return

    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        print("🔌 Connected to DB")

        # Check if vectors allow '::vector' syntax or handled by driver
        # Standard psycopg2 executes SQL as is, so Postgres handles casting if extension is loaded.
        
        print(f"📖 Reading {SQL_FILE}...")
        with open(SQL_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
        
        count = 0
        print("🚀 Executing updates...")
        for line in lines:
            line = line.strip()
            if not line or line.startswith("--"):
                continue
            
            if "UPDATE category SET" in line:
                try:
                    cur.execute(line)
                    count += 1
                    if count % 50 == 0:
                        print(f"   Processed {count} updates...")
                except Exception as e:
                    print(f"❌ Error on line: {line[:50]}... : {e}")
                    conn.rollback() 
                    # Continue ? No, better stop or transaction handling
                    # But the file generally has valid SQLs.
                    # If we rollback, we lose previous updates in transaction block if any.
                    # Let's not use single transaction for all if we suspect errors, but here we expect safety.
                    return 

        conn.commit()
        print(f"✅ Seeding Completed! {count} updates executed.")
        
    except Exception as e:
        print(f"❌ Critical Error: {e}")
        if conn: conn.rollback()
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    main()
