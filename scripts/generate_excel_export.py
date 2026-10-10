#!/usr/bin/env python3
"""
Generate complete Microsoft Excel (.xlsx) and CSV exports for Cayman Super Kings data.
"""

import json
import os
import csv
import io
import zipfile
import html
import xml.sax.saxutils as saxutils

def escape_xml(s):
    if s is None:
        return ""
    return saxutils.escape(str(s))

def create_xlsx(sheets_data, output_filepath):
    """
    Creates a standard OpenXML (.xlsx) file without external dependencies.
    sheets_data: dict of { sheet_name: [ [row1_col1, row1_col2...], [row2_col1, ...] ] }
    """
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        # [Content_Types].xml
        content_types = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                         '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
                         '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
                         '<Default Extension="xml" ContentType="application/xml"/>',
                         '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>']
        for i in range(1, len(sheets_data) + 1):
            content_types.append(f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')
        content_types.append('<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>')
        content_types.append('</Types>')
        zf.writestr('[Content_Types].xml', ''.join(content_types))

        # _rels/.rels
        rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
                '  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>\n'
                '</Relationships>')
        zf.writestr('_rels/.rels', rels)

        # xl/_rels/workbook.xml.rels
        wb_rels = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',
                   '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n']
        for i in range(1, len(sheets_data) + 1):
            wb_rels.append(f'  <Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>\n')
        wb_rels.append(f'  <Relationship Id="rId{len(sheets_data)+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>\n')
        wb_rels.append('</Relationships>')
        zf.writestr('xl/_rels/workbook.xml.rels', ''.join(wb_rels))

        # xl/workbook.xml
        wb = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',
              '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\n',
              '  <sheets>\n']
        for i, (sheet_name, _) in enumerate(sheets_data.items(), start=1):
            clean_name = sheet_name[:31]
            wb.append(f'    <sheet name="{escape_xml(clean_name)}" sheetId="{i}" r:id="rId{i}"/>\n')
        wb.append('  </sheets>\n</workbook>')
        zf.writestr('xl/workbook.xml', ''.join(wb))

        # xl/styles.xml (Professional CSK Navy & Gold themed header styling)
        styles = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                  '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n'
                  '  <fonts count="2">\n'
                  '    <font><name val="Calibri"/><sz val="11"/></font>\n'
                  '    <font><b/><color rgb="FFFFFFFF"/><name val="Calibri"/><sz val="11"/></font>\n'
                  '  </fonts>\n'
                  '  <fills count="3">\n'
                  '    <fill><patternFill fillType="none"/></fill>\n'
                  '    <fill><patternFill fillType="gray125"/></fill>\n'
                  '    <fill><patternFill fillType="solid"><fgColor rgb="FF09152B"/></patternFill></fill>\n'
                  '  </fills>\n'
                  '  <borders count="1">\n'
                  '    <border><left/><right/><top/><bottom/></border>\n'
                  '  </borders>\n'
                  '  <cellStyleXfs count="1">\n'
                  '    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>\n'
                  '  </cellStyleXfs>\n'
                  '  <cellXfs count="2">\n'
                  '    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>\n'
                  '    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>\n'
                  '  </cellXfs>\n'
                  '</styleSheet>')
        zf.writestr('xl/styles.xml', styles)

        # Worksheets
        for sheet_idx, (sheet_name, rows) in enumerate(sheets_data.items(), start=1):
            ws = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',
                  '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n',
                  '  <sheetData>\n']
            for r_idx, row in enumerate(rows, start=1):
                ws.append(f'    <row r="{r_idx}">\n')
                for c_idx, cell in enumerate(row, start=1):
                    # Convert col index to letters (A, B, C...)
                    col_letter = ""
                    c = c_idx
                    while c > 0:
                        c, remainder = divmod(c - 1, 26)
                        col_letter = chr(65 + remainder) + col_letter
                    cell_ref = f"{col_letter}{r_idx}"
                    style_attr = ' s="1"' if r_idx == 1 else ''
                    val_str = escape_xml(str(cell if cell is not None else ""))
                    ws.append(f'      <c r="{cell_ref}" t="inlineStr"{style_attr}><is><t>{val_str}</t></is></c>\n')
                ws.append('    </row>\n')
            ws.append('  </sheetData>\n</worksheet>')
            zf.writestr(f'xl/worksheets/sheet{sheet_idx}.xml', ''.join(ws))

    os.makedirs(os.path.dirname(output_filepath), exist_ok=True)
    with open(output_filepath, 'wb') as f:
        f.write(buf.getvalue())

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    exports_dir = os.path.join(root, 'exports')
    os.makedirs(exports_dir, exist_ok=True)

    # 1. Load Squad Data
    with open(os.path.join(root, 'content', 'squad.json'), 'r') as f:
        squad_data = json.load(f)
    
    # Priority sorting
    squad_data.sort(key=lambda x: x.get('priority', 99))

    squad_headers = [
        "Priority Order", "ID", "Full Name", "Display Name", "Role / Designation",
        "Badge", "Primary Category", "Secondary Categories", "Jersey #",
        "Age", "Birthday", "Batting Style", "Bowling Style",
        "Cayman National Experience", "Player Description", "Leadership / Background Note",
        "Photo Asset Path", "Drive Photo Folder"
    ]
    squad_rows = [squad_headers]
    for p in squad_data:
        squad_rows.append([
            p.get("priority", ""),
            p.get("id", ""),
            p.get("name_full", ""),
            p.get("name_display", ""),
            p.get("role", ""),
            p.get("badge", ""),
            p.get("group", ""),
            ", ".join(p.get("groups", [])),
            p.get("jersey_display", ""),
            p.get("age", ""),
            p.get("birthday", ""),
            p.get("battingStyle", ""),
            p.get("bowlingStyle", ""),
            p.get("national_team_experience", ""),
            p.get("description", ""),
            p.get("didYouKnow", ""),
            p.get("photo", ""),
            p.get("photo_drive", "")
        ])

    # 2. Load Matches Data
    with open(os.path.join(root, 'content', 'fixtures.json'), 'r') as f:
        matches_data = json.load(f)

    matches_headers = [
        "Match ID", "Slug", "Competition", "Format", "Season",
        "Opponent Team", "Opponent Code", "Venue", "Date", "Time",
        "CSK Score", "CSK Overs", "Opponent Score", "Opponent Overs",
        "Official Result", "CSK Won?", "Player of the Match", "Match Summary",
        "Official League Scorecard URL"
    ]
    matches_rows = [matches_headers]
    for m in matches_data:
        matches_rows.append([
            m.get("id", ""),
            m.get("slug", ""),
            m.get("competition", ""),
            m.get("format", ""),
            m.get("season", ""),
            m.get("opponent", ""),
            m.get("opponent_short", ""),
            m.get("venue", ""),
            m.get("date", ""),
            m.get("time", ""),
            m.get("score_csk", ""),
            m.get("overs_csk", ""),
            m.get("score_opp", ""),
            m.get("overs_opp", ""),
            m.get("result_text", ""),
            "YES" if m.get("is_csk_win") else "NO",
            m.get("player_of_match", ""),
            m.get("summary", ""),
            m.get("cricclubs_url", "")
        ])

    # 3. Load News Data
    with open(os.path.join(root, 'content', 'news.json'), 'r') as f:
        news_data = json.load(f)

    news_headers = ["Article ID", "Slug", "Category", "Title", "Date", "Author", "Read Time", "Excerpt"]
    news_rows = [news_headers]
    for n in news_data:
        news_rows.append([
            n.get("id", ""),
            n.get("slug", ""),
            n.get("category", ""),
            n.get("title", ""),
            n.get("date", ""),
            n.get("author", ""),
            n.get("read_time", ""),
            n.get("excerpt", "")
        ])

    # 4. Load About / Timeline / Leadership Data
    with open(os.path.join(root, 'content', 'about.json'), 'r') as f:
        about_data = json.load(f)

    timeline_headers = ["Year / Era", "Milestone Tag", "Title", "Historical Details"]
    timeline_rows = [timeline_headers]
    for t in about_data.get("timeline", []):
        timeline_rows.append([
            t.get("year", ""),
            t.get("tag", ""),
            t.get("title", ""),
            t.get("description", "")
        ])

    # 5. Enquiries Format Template & Database
    enquiries_headers = [
        "Submission Timestamp (UTC)",
        "Cayman Local Date & Time",
        "Sender Full Name",
        "Sender Email Address",
        "Enquiry Category / Subject",
        "Message Body / Inquiry Details",
        "Follow-up Status",
        "Assigned Official / Committee Member"
    ]
    enquiries_rows = [
        enquiries_headers,
        [
            "2026-10-10T11:45:00Z",
            "10/10/2026, 6:45:00 AM",
            "Marcus Campbell",
            "marcus@example.ky",
            "Corporate Sponsorship & Brand Partnership",
            "Looking to discuss CSK corporate jersey sponsorship for the 2026/27 Super League season.",
            "In Review",
            "Rahul Garg (Club Captain)"
        ],
        [
            "2026-10-10T10:30:00Z",
            "10/10/2026, 5:30:00 AM",
            "Dave Robinson",
            "dave.r@example.ky",
            "Youth Academy Registration (Ages 10–18)",
            "Interested in enrolling two youth players (under-15) for weekly coaching sessions.",
            "Pending",
            "Majin Paul (Team Manager)"
        ],
        [
            "2026-10-09T18:15:00Z",
            "09/10/2026, 1:15:00 PM",
            "Sarah Jenkins",
            "sarah.j@caymanports.ky",
            "General Club Enquiry",
            "Inquiry regarding upcoming tournament schedule at Jimmy Powell Oval and match ticketing.",
            "Contacted",
            "Christopher Balraj (Co-Founder)"
        ]
    ]

    # Write individual CSV files
    with open(os.path.join(exports_dir, 'CSK_Squad_Players.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(squad_rows)

    with open(os.path.join(exports_dir, 'CSK_Matches_Results.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(matches_rows)

    with open(os.path.join(exports_dir, 'CSK_News_Articles.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(news_rows)

    with open(os.path.join(exports_dir, 'CSK_Club_Heritage_Timeline.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(timeline_rows)

    with open(os.path.join(exports_dir, 'CSK_Contact_Enquiries_Template.csv'), 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(enquiries_rows)

    # Standalone Contact Enquiries Excel Sheet (.xlsx)
    contact_xlsx = os.path.join(exports_dir, 'CSK_Contact_Enquiries_Database.xlsx')
    create_xlsx({"Contact_Enquiries": enquiries_rows}, contact_xlsx)

    # Write Master Microsoft Excel Workbook (.xlsx)
    master_xlsx = os.path.join(exports_dir, 'Cayman_Super_Kings_Complete_Database.xlsx')
    sheets_dict = {
        "Contact_Enquiries": enquiries_rows,
        "Squad_Players": squad_rows,
        "Matches_Fixtures": matches_rows,
        "News_Articles": news_rows,
        "Timeline_Honours": timeline_rows
    }
    create_xlsx(sheets_dict, master_xlsx)

    print(f"Successfully generated all Excel and CSV files in {exports_dir}")

if __name__ == "__main__":
    main()
