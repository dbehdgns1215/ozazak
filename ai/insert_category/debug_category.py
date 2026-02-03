
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": "localhost",
    "database": "ozazak",
    "user": "b205admin",
    "password": "b205admin", 
    "port": "5432"
}

def main():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("🔌 Connected to DB")
        
        # Check Total Count
        cur.execute("SELECT count(*) FROM category")
        count = cur.fetchone()[0]
        print(f"📊 Total Categories: {count}")
        
        # Check Sample Data
        cur.execute("SELECT id, name, parent_id, CASE WHEN embedding IS NULL THEN 'NULL' ELSE 'EXISTS' END FROM category LIMIT 10")
        rows = cur.fetchall()
        print("\n🔍 Sample Data (First 10):")
        for row in rows:
            print(f"ID: {row[0]}, Name: {row[1]}, Parent: {row[2]}, Embedding: {row[3]}")
        
        # Check Depth Distribution
        cur.execute("SELECT id, name, parent_id FROM category")
        all_cats = cur.fetchall()
        
        cat_map = {row[0]: {'name': row[1], 'parent_id': row[2]} for row in all_cats}
        depth_counts = {}
        
        for cat_id, data in cat_map.items():
            depth = 1
            curr = data
            while curr['parent_id'] is not None:
                depth += 1
                pid = curr['parent_id']
                if pid in cat_map:
                    curr = cat_map[pid]
                else:
                    break # Broken link
            
            depth_counts[depth] = depth_counts.get(depth, 0) + 1
        
        print("\n📊 Depth Distribution:")
        for d, c in sorted(depth_counts.items()):
            print(f"Depth {d}: {c} categories")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'cur' in locals(): cur.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    main()
