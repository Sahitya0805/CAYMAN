#!/usr/bin/env python3
"""
Test Suite: Verify that BOTH Contact Page & Youth Academy Form submissions
are accurately recorded and stored in the Microsoft Excel (.xlsx) database.
"""

import os
import sys
import json
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPORTS_DIR = os.path.join(ROOT_DIR, "exports")
CONTENT_DIR = os.path.join(ROOT_DIR, "content")
ENQUIRIES_JSON = os.path.join(CONTENT_DIR, "enquiries.json")
STANDALONE_XLSX = os.path.join(EXPORTS_DIR, "CSK_Contact_Enquiries_Database.xlsx")
MASTER_XLSX = os.path.join(EXPORTS_DIR, "Cayman_Super_Kings_Complete_Database.xlsx")

def read_xlsx_rows(xlsx_path, target_sheet_name="sheet1.xml"):
    """Reads all cell text values from an OpenXML sheet."""
    if not os.path.exists(xlsx_path):
        raise FileNotFoundError(f"File not found: {xlsx_path}")
    
    rows = []
    with zipfile.ZipFile(xlsx_path, 'r') as zf:
        sheet_files = [f for f in zf.namelist() if f.startswith("xl/worksheets/sheet") and f.endswith(".xml")]
        sheet_to_read = f"xl/worksheets/{target_sheet_name}" if f"xl/worksheets/{target_sheet_name}" in sheet_files else sheet_files[0]
        
        xml_data = zf.read(sheet_to_read)
        root = ET.fromstring(xml_data)
        
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        sheet_data = root.find('main:sheetData', ns)
        if sheet_data is None:
            sheet_data = root.find('sheetData')
            
        for row in sheet_data:
            current_row = []
            for cell in row:
                t_elem = cell.find('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                if t_elem is None:
                    t_elem = cell.find('.//t')
                text = t_elem.text if t_elem is not None else ""
                current_row.append(text)
            rows.append(current_row)
            
    return rows

def run_test():
    print("=" * 70)
    print("VERIFICATION: CONTACT PAGE & YOUTH ACADEMY -> EXCEL (.XLSX) PIPELINE")
    print("=" * 70)

    now_utc = datetime.now(timezone.utc).isoformat()
    now_formatted = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")

    # 1. Contact Form Submission Payload
    contact_sub = {
        "timestamp": now_utc,
        "dateFormatted": now_formatted,
        "name": "Michael Campbell (Contact Page Submission)",
        "email": "michael.campbell@candw.ky",
        "subject": "Senior Squad Trials & Corporate Partnership",
        "message": "Enquiry submitted via contact.html regarding 2026/27 premier league trials and sponsor packages.",
        "status": "Verified Contact Page Submission",
        "assigned": "Rahul Garg (Club Captain)"
    }

    # 2. Youth Academy Registration Form Payload
    youth_sub = {
        "timestamp": now_utc,
        "dateFormatted": now_formatted,
        "name": "David Miller (Youth Parent)",
        "email": "david.miller@caymanparent.ky",
        "subject": "Youth Academy Enrollment - Leo Miller, Age 11",
        "message": "[YOUTH ACADEMY ENROLLMENT]\n• Parent/Guardian: David Miller\n• Child Info & Age: Leo Miller, Age 11\n• Phone / WhatsApp: +1 (345) 925-8844\n• Email: david.miller@caymanparent.ky\n• Experience Level: Intermediate\n• Training Ground: Smith Road Oval, George Town",
        "status": "Verified Youth Academy Enrollment",
        "assigned": "Academy Coordinator"
    }

    print("\n[1] Submitting Contact Page Entry:")
    print(f"    Name: {contact_sub['name']}")
    print(f"    Subject: {contact_sub['subject']}")

    print("\n[2] Submitting Youth Academy Registration Entry:")
    print(f"    Parent: {youth_sub['name']}")
    print(f"    Subject: {youth_sub['subject']}")

    # Load existing JSON
    enquiries = []
    if os.path.exists(ENQUIRIES_JSON):
        with open(ENQUIRIES_JSON, 'r', encoding='utf-8') as f:
            try:
                enquiries = json.load(f)
            except Exception:
                enquiries = []

    # Filter out previous test submissions with the same test emails
    enquiries = [e for e in enquiries if e.get('email') not in (contact_sub['email'], youth_sub['email'])]

    # Prepend both verified test submissions
    enquiries.insert(0, youth_sub)
    enquiries.insert(0, contact_sub)

    with open(ENQUIRIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(enquiries, f, indent=2)

    print(f"\n[3] Saved both entries to: {ENQUIRIES_JSON}")

    # Run generator script
    print("\n[4] Running Excel Generator (scripts/generate_excel_export.py)...")
    generator_script = os.path.join(ROOT_DIR, "scripts", "generate_excel_export.py")
    res = os.system(f"\"{sys.executable}\" \"{generator_script}\"")
    assert res == 0, "generate_excel_export.py failed!"

    # Inspect Standalone Enquiries Excel
    print(f"\n[5] Inspecting Standalone Excel File: {STANDALONE_XLSX}")
    rows = read_xlsx_rows(STANDALONE_XLSX, "sheet1.xml")
    print(f"    Total Rows in Excel: {len(rows)}")
    print(f"    Columns: {rows[0]}")

    contact_found = False
    youth_found = False

    for idx, r in enumerate(rows[1:], start=1):
        row_str = " | ".join(r)
        if contact_sub['email'] in row_str:
            contact_found = True
            print(f"\n    [✔] Row {idx} Confirmed (Contact Page):")
            print(f"        Name: {r[2]}")
            print(f"        Email: {r[3]}")
            print(f"        Subject: {r[4]}")
            print(f"        Status: {r[6]}")
        if youth_sub['email'] in row_str:
            youth_found = True
            print(f"\n    [✔] Row {idx} Confirmed (Youth Academy):")
            print(f"        Name: {r[2]}")
            print(f"        Email: {r[3]}")
            print(f"        Subject: {r[4]}")
            print(f"        Status: {r[6]}")

    assert contact_found, "Contact submission not found in Excel!"
    assert youth_found, "Youth submission not found in Excel!"

    # Inspect Master Workbook
    print(f"\n[6] Inspecting Master Excel Workbook: {MASTER_XLSX}")
    master_rows = read_xlsx_rows(MASTER_XLSX, "sheet1.xml")
    print(f"    Master Sheet 'Contact_Enquiries' Total Rows: {len(master_rows)}")

    contact_master = any(contact_sub['email'] in " | ".join(r) for r in master_rows)
    youth_master = any(youth_sub['email'] in " | ".join(r) for r in master_rows)

    assert contact_master, "Contact submission missing in Master Excel!"
    assert youth_master, "Youth submission missing in Master Excel!"

    print("\n" + "=" * 70)
    print("SUCCESS: BOTH CONTACT PAGE & YOUTH ACADEMY ENTRIES STORED PROPERLY IN EXCEL!")
    print("=" * 70)

if __name__ == "__main__":
    run_test()
