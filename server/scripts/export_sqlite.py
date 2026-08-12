import sqlite3
import json
import os

DB_PATH = r'c:\Users\manas\PycharmProjects\Event_managementplatform\instance\eventops.db'
OUTPUT_PATH = r'c:\Users\manas\Desktop\eventmanagement mern\server\scripts\data.json'

def export_db():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    tables = [
        'user', 'event', 'registration', 'venue', 'speaker',
        'sponsorship', 'incident', 'notification', 'reminder', 'feedback'
    ]

    data = {}

    for table in tables:
        try:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            data[table] = [dict(row) for row in rows]
            print(f"Exported {len(rows)} records from {table}")
        except sqlite3.OperationalError as e:
            print(f"Skipping {table}: {e}")

    with open(OUTPUT_PATH, 'w') as f:
        json.dump(data, f, indent=4, default=str)
    
    print(f"\nData successfully exported to {OUTPUT_PATH}")

if __name__ == '__main__':
    export_db()
