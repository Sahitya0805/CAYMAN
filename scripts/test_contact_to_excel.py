#!/usr/bin/env python3
"""
Test Suite: Verify that contact page enquiries are stored in Microsoft Excel (.xlsx) files.
"""

import os
import sys
import json
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

# Setup paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPORTS_DIR = os.path.join(ROOT_DIR, "exports")
CONTENT_DIR = os.path.join(ROOT_DIR, "content")
ENQUIRIES_JSON = os.path.join(CONTENT_DIR, "enquiries.json")
STANDALONE_XLSX = os.path.join(EXPORTS_DIR, "CSK_Contact_Enquiries_Database.xlsx")
MASTER_XLSX = os.path.join(EXPORTS_DIR, "Cayman_Super_Kings_Complete_Database.xlsx")

def read_xlsx_cells(xlsx_path, sheet_filename="sheet1.xml"):
    """Reads all cell text values from an openxml sheet without dependencies."""
    if not os.path.exists(xlsx_path):
        raise FileNotFoundError(f"Excel file not found: {xlsx_path}")
    
    rows_data = []
    with zipfile.ZipFile(xlsx_path, 'r') as zf:
        # Check sheet files
        sheet_names = [f for f in zf.namelist() if f.startswith("xl/worksheets/sheet") and f.endswith(".xml")]
        target_sheet = f"xl/worksheets/{sheet_filename}" if f"xl/worksheets/{sheet_filename}" in sheet_names else sheet_names[0]
        
        xml_content = zf.read(target_sheet)
        root = ET.fromstring(xml_content)
        
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        sheet_data = root.find('main:sheetData', ns)
        if sheet_data is None:
            sheet_data = root.find('sheetData')
            
        for row in sheet_data:
            current_row = []
            for cell in row:
                # Value can be inlineStr -> is -> t
                t_elem = cell.find('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                if t_elem is None:
                    t_elem = cell.find('.//t')
                text = t_elem.text if t_elem is not None else ""
                current_row.append(text)
            rows_data.append(current_row)
            
    return rows_data

def test_contact_form_storage():
    print("=" * 60)
    print("TEST: CONTACT PAGE ENQUIRY -> EXCEL (.XLSX) STORAGE PIPELINE")
    print("=" * 60)

    # 1. Define sample contact submission as submitted from contact.html form
    timestamp = datetime.now(timezone.utc).isoformat()
    test_submission = {
        "timestamp": timestamp,
        "dateFormatted": datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p"),
        "name": "Sahil Singh (Player Trial Enquiry)",
        "email": "sahil.singh.test@caymansuperkings.ky",
        "subject": "Senior Squad Trials & Recruitment",
        "message": "Testing automated verification that contact page enquiries are accurately saved in Excel (.xlsx) database.",
        "status": "Verified Website Submission"
    }

    print(f"\n[1] Generated Test Enquiry Submission:")
    print(json.dumps(test_submission, indent=2))

    # 2. Add submission to content/enquiries.json (simulating API / backend handler)
    enquiries = []
    if os.path.exists(ENQUIRIES_JSON):
        with open(ENQUIRIES_JSON, 'r', encoding='utf-8') as f:
            try:
                enquiries = json.load(f)
            except Exception:
                enquiries = []
                
    enquiries.insert(0, test_submission)
    with open(ENQUIRIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(enquiries, f, indent=2)
    print(f"\n[2] Wrote submission to: {ENQUIRIES_JSON}")

    # 3. Run Excel Generator
    print("\n[3] Executing generate_excel_export.py...")
    script_path = os.path.join(ROOT_DIR, "scripts", "generate_excel_export.py")
    res = os.system(f"\"{sys.executable}\" \"{script_path}\"")
    assert res == 0, "Failed to execute generate_excel_export.py"

    # 4. Inspect standalone Excel file: exports/CSK_Contact_Enquiries_Database.xlsx
    print(f"\n[4] Inspecting {STANDALONE_XLSX}...")
    rows = read_xlsx_cells(STANDALONE_XLSX, "sheet1.xml")
    print(f"Total Rows in Sheet: {len(rows)}")
    print(f"Header Row: {rows[0]}")

    # Verify test row is present
    found = False
    for i, row in enumerate(rows[1:], start=1):
        row_str = " | ".join(row)
        if test_submission["name"] in row_str and test_submission["email"] in row_str:
            found = True
            print(f"\n>>> MATCH CONFIRMED AT ROW {i}:")
            print(f"    Timestamp: {row[0]}")
            print(f"    Cayman Date: {row[1]}")
            print(f"    Name: {row[2]}")
            print(f"    Email: {row[3]}")
            print(f"    Subject: {row[4]}")
            print(f"    Message: {row[5]}")
            print(f"    Status: {row[6]}")
            break

    assert found, "Test submission was NOT found in CSK_Contact_Enquiries_Database.xlsx!"
    print("\n[✔] PASSED: Standalone Excel database contains the contact submission.")

    # 5. Inspect Master Database: exports/Cayman_Super_Kings_Complete_Database.xlsx
    print(f"\n[5] Inspecting {MASTER_XLSX} (Sheet 1: Contact_Enquiries)...")
    master_rows = read_xlsx_cells(MASTER_XLSX, "sheet1.xml")
    master_found = False
    for i, row in enumerate(master_rows[1:], start=1):
        row_str = " | ".join(row)
        if test_submission["name"] in row_str and test_submission["email"] in row_str:
            master_found = True
            break
            
    assert master_found, "Test submission was NOT found in Cayman_Super_Kings_Complete_Database.xlsx!"
    print("[✔] PASSED: Master Excel database contains the contact submission.")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED: Data given in contact form is safely stored in Excel (.xlsx)!")
    print("=" * 60)

if __name__ == "__main__":
    test_contact_form_storage()
