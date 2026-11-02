import os
import re
import ast

def parse_sql_file(sql_path):
    with open(sql_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Split into statements
    statements = content.split(";\n")
    print(f"Total statements: {len(statements)}")
    
    tables_data = {}
    
    for stmt in statements:
        stmt = stmt.strip()
        idx = stmt.find("INSERT INTO")
        if idx == -1:
            continue
        stmt = stmt[idx:]
        
        # Match table name and columns
        m = re.match(r"INSERT INTO `?(\w+)`?\s*\((.*?)\)\s*VALUES\s*(.*)", stmt, re.DOTALL | re.IGNORECASE)
        if not m:
            continue
        
        table_name = m.group(1)
        raw_cols = m.group(2)
        raw_vals = m.group(3).strip()
        
        columns = [c.strip().strip("`").strip() for c in raw_cols.split(",")]
        
        # Parse values: rows are like (val1, val2, ...), (val1, val2, ...)
        rows = []
        # A simple state machine to split row tuples safely
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
                    # check for '' inside string (SQL escape)
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
            
        print(f"Table '{table_name}': {len(columns)} cols, {len(rows)} rows")
        
        # Convert each row to dict
        def parse_sql_val(v):
            v = v.strip()
            if v.upper() == "NULL":
                return None
            if (v.startswith("'") and v.endswith("'")) or (v.startswith('"') and v.endswith('"')):
                # unescape
                inner = v[1:-1]
                inner = inner.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\r", "\r").replace("\\\\", "\\")
                return inner
            # try int
            try:
                return int(v)
            except ValueError:
                pass
            # try float
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
            else:
                print(f"  Warning: col count mismatch for {table_name}: expected {len(columns)}, got {len(r)}")
        
        tables_data[table_name] = dict_rows

    return tables_data

if __name__ == "__main__":
    sql_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "smart_demo.sql")
    data = parse_sql_file(sql_file)
    for t, rows in data.items():
        print(f"==> {t}: {len(rows)} records parsed successfully")
        if rows:
            print(f"    Sample: {rows[0]}")
