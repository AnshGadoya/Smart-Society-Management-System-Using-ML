import os
import re
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(env_path)

def parse_sql_file(sql_path):
    with open(sql_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    statements = content.split(";\n")
    tables_data = {}

    for stmt in statements:
        stmt = stmt.strip()
        idx = stmt.find("INSERT INTO")
        if idx == -1:
            continue
        stmt = stmt[idx:]

        m = re.match(r"INSERT INTO `?(\w+)`?\s*\((.*?)\)\s*VALUES\s*(.*)", stmt, re.DOTALL | re.IGNORECASE)
        if not m:
            continue

        table_name = m.group(1)
        raw_cols = m.group(2)
        raw_vals = m.group(3).strip()

        columns = [c.strip().strip("`").strip() for c in raw_cols.split(",")]

        rows = []
        current_row = []
        in_string = False
        quote_char = None
        escape = False
        in_row = False
        current_val = []

        i = 0
        while i < len(raw_vals):
            ch = raw_vals[i]

            if escape:
                current_val.append(ch)
                escape = False
                i += 1
                continue

            if ch == "\\":
                escape = True
                current_val.append(ch)
                i += 1
                continue

            if in_string:
                if ch == quote_char:
                    if i + 1 < len(raw_vals) and raw_vals[i+1] == quote_char:
                        current_val.append(ch)
                        i += 2
                        continue
                    in_string = False
                current_val.append(ch)
            else:
                if ch in ("'", '"'):
                    in_string = True
                    quote_char = ch
                    current_val.append(ch)
                elif ch == "(":
                    in_row = True
                    current_row = []
                    current_val = []
                elif ch == ")":
                    if in_row:
                        val_str = "".join(current_val).strip()
                        current_row.append(val_str)
                        current_val = []
                        rows.append(current_row)
                        in_row = False
                elif ch == ",":
                    if in_row:
                        val_str = "".join(current_val).strip()
                        current_row.append(val_str)
                        current_val = []
                else:
                    if in_row:
                        current_val.append(ch)
            i += 1

        def parse_sql_val(v):
            v = v.strip()
            if v.upper() == "NULL":
                return None
            if (v.startswith("'") and v.endswith("'")) or (v.startswith('"') and v.endswith('"')):
                inner = v[1:-1]
                inner = inner.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", "\r").replace("\\\\", "\\")
                return inner
            try:
                return int(v)
            except ValueError:
                pass
            try:
                return float(v)
            except ValueError:
                pass
            return v

        dict_rows = []
        for r in rows:
            if len(r) == len(columns):
                row_dict = {}
                for col, val in zip(columns, r):
                    row_dict[col] = parse_sql_val(val)
                dict_rows.append(row_dict)

        tables_data[table_name] = dict_rows

    return tables_data


def migrate_to_mongodb(mongo_uri=None, db_name="smart_demo", drop_existing=True):
    uri = mongo_uri or os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
    if not uri:
        raise ValueError("MongoDB URI is not provided. Set MONGO_URI in backend/.env or pass it as an argument.")

    print(f"Connecting to MongoDB Atlas...")
    client = MongoClient(uri)
    db = client.get_default_database() if client.get_default_database() is not None else client[db_name]
    print(f"Connected successfully to database: '{db.name}'")

    sql_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "smart_demo.sql")
    print(f"Reading and parsing SQL dump from: {sql_file}")
    data = parse_sql_file(sql_file)

    counters = {}

    for table, records in data.items():
        if table == "alembic_version":
            continue  # Not needed in MongoDB

        coll = db[table]
        if drop_existing:
            coll.drop()

        if records:
            # Clean and insert records
            for r in records:
                # Find max id if numeric
                if "id" in r and isinstance(r["id"], int):
                    counters[table] = max(counters.get(table, 0), r["id"])

            coll.insert_many(records)
            print(f"  [OK] Inserted {len(records)} documents into collection '{table}'")
        else:
            print(f"  [--] Collection '{table}' has 0 records")

    # Save sequence counters for auto-incrementing IDs in new inserts
    counters_coll = db["_counters"]
    if drop_existing:
        counters_coll.drop()

    for coll_name, max_id in counters.items():
        counters_coll.update_one(
            {"_id": coll_name},
            {"$set": {"seq": max_id}},
            upsert=True
        )
    print(f"  [OK] Initialized ID counters: {counters}")

    # Create key indexes
    print("Creating indexes...")
    if "blocks" in db.list_collection_names():
        db.blocks.create_index("id", unique=True)
    if "housing_units" in db.list_collection_names():
        db.housing_units.create_index("id", unique=True)
        db.housing_units.create_index("block_id")
    if "housing_members" in db.list_collection_names():
        db.housing_members.create_index("id", unique=True)
        db.housing_members.create_index("member_id", unique=True)
        db.housing_members.create_index("unit_id")
    if "login" in db.list_collection_names():
        db.login.create_index("email", unique=True)
        db.login.create_index("member_id")
    if "complaint" in db.list_collection_names():
        db.complaint.create_index("id", unique=True)
        db.complaint.create_index("complaint_id", unique=True)
    if "notice" in db.list_collection_names():
        db.notice.create_index("id", unique=True)
        db.notice.create_index("notice_id", unique=True)
    if "staff" in db.list_collection_names():
        db.staff.create_index("staff_id", unique=True)
    if "visitor" in db.list_collection_names():
        db.visitor.create_index("id", unique=True)
        db.visitor.create_index("code", unique=True)
    if "face_visitors" in db.list_collection_names():
        db.face_visitors.create_index("id", unique=True)
        db.face_visitors.create_index("visitor_id", unique=True)

    print("Migration from MySQL SQL dump to MongoDB Atlas completed successfully!")
    return True

if __name__ == "__main__":
    import sys
    uri = sys.argv[1] if len(sys.argv) > 1 else None
    migrate_to_mongodb(uri)
