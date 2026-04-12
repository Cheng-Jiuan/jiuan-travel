# -*- coding: utf-8 -*-
"""
把 trip-detail-data.js 輸出成 Notion 可用的 CSV + Markdown
修正版：正確保留段落在對應 h2 之下
"""
import json, re, os

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
SRC = os.path.join(ROOT_DIR, 'trip-detail-data.js')
TRIPS_SRC = os.path.join(ROOT_DIR, 'trips-data.js')
OUT_DIR = os.path.join(ROOT_DIR, 'notion_export')
os.makedirs(OUT_DIR, exist_ok=True)

# ── 讀取解析 trip-detail-data.js ──────────────────────────────
with open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()

def find_matching_brace(s, start):
    depth = 0; i = start; in_str = False; str_char = ''
    while i < len(s):
        c = s[i]
        if in_str:
            if c == '\\': i += 2; continue
            if c == str_char: in_str = False
        else:
            if c in ('"', "'"): in_str = True; str_char = c
            elif c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0: return i
        i += 1
    return -1

def find_matching_bracket(s, start):
    depth = 0; i = start; in_str = False; str_char = ''
    while i < len(s):
        c = s[i]
        if in_str:
            if c == '\\': i += 2; continue
            if c == str_char: in_str = False
        else:
            if c in ('"', "'"): in_str = True; str_char = c
            elif c == '[': depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0: return i
        i += 1
    return -1

def extract_quoted(s, pos=0):
    """從 pos 開始抽出第一個引號字串的內容"""
    m = re.search(r"['\"]" , s[pos:])
    if not m: return '', pos
    q = m.group(0)
    start = pos + m.start() + 1
    result = []
    i = start
    while i < len(s):
        c = s[i]
        if c == '\\': result.append(s[i+1]); i += 2; continue
        if c == q: break
        result.append(c)
        i += 1
    return ''.join(result), i + 1

match = re.search(r'var TRIP_DETAILS\s*=\s*\{', content)
obj_start = match.end() - 1
obj_end = find_matching_brace(content, obj_start)
inner = content[obj_start+1:obj_end]

def extract_top_level_keys(s):
    results = []
    i = 0
    key_pattern = re.compile(r"\s*(?:'([^']+)'|\"([^\"]+)\"|([\w\u4e00-\u9fff\uff00-\uffef\u3000-\u303f]+))\s*:\s*\{")
    while i < len(s):
        m = key_pattern.match(s, i)
        if m:
            key = m.group(1) or m.group(2) or m.group(3)
            brace_start = m.end() - 1
            brace_end = find_matching_brace(s, brace_start)
            if brace_end != -1:
                results.append((key, s[brace_start:brace_end+1]))
                i = brace_end + 1
                while i < len(s) and s[i] in ' ,\t\n\r': i += 1
                continue
        i += 1
    return results

raw_trips = extract_top_level_keys(inner)
print(f'Found {len(raw_trips)} trips')

# ── trips-data.js meta ────────────────────────────────────────
with open(TRIPS_SRC, 'r', encoding='utf-8') as f:
    trips_js = f.read()
json_match = re.search(r'var TRIPS_DATA\s*=\s*(\[.*?\]);', trips_js, re.DOTALL)
trips_meta = {}
if json_match:
    try:
        for t in json.loads(json_match.group(1)):
            trips_meta[t['id']] = t
    except: pass

# ── 解析 sections 陣列（順序正確版）──────────────────────────
def parse_sections(val_js):
    """找出 sections: [ ... ] 並逐一解析每個 section 物件"""
    m = re.search(r'sections:\s*\[', val_js)
    if not m: return []
    arr_start = m.end() - 1
    arr_end = find_matching_bracket(val_js, arr_start)
    arr_str = val_js[arr_start+1:arr_end]

    sections = []
    i = 0
    while i < len(arr_str):
        # 找下一個 { 開始的 section 物件
        brace = arr_str.find('{', i)
        if brace == -1: break
        brace_end = find_matching_brace(arr_str, brace)
        if brace_end == -1: break
        sec_str = arr_str[brace:brace_end+1]

        # 取 type
        tm = re.search(r"type:'([^']+)'", sec_str)
        if not tm:
            i = brace_end + 1; continue
        stype = tm.group(1)
        sec = {'type': stype}

        if stype == 'h2':
            sec['id']   = (re.search(r"id:'([^']*)'" , sec_str) or re.search(r'id:"([^"]*)"', sec_str) or type('', (object,), {'group': lambda s,n: ''})()).group(1) if re.search(r"id:'([^']*)'" , sec_str) else ''
            sec['text'] = (re.search(r"text:'((?:[^'\\]|\\.)*)'", sec_str) or type('', (object,), {'group': lambda s,n: ''})()).group(1) if re.search(r"text:'((?:[^'\\]|\\.)*)'" , sec_str) else ''
        elif stype in ('p', 'blockquote'):
            m2 = re.search(r"text:'((?:[^'\\]|\\.)*)'", sec_str, re.DOTALL)
            sec['text'] = m2.group(1) if m2 else ''
        elif stype == 'ul':
            bm = re.search(r'items:\s*\[', sec_str)
            items = []
            if bm:
                ab = bm.end() - 1
                ae = find_matching_bracket(sec_str, ab)
                items_str = sec_str[ab+1:ae]
                for im in re.finditer(r"'((?:[^'\\]|\\.)*)'", items_str):
                    items.append(im.group(1))
            sec['items'] = items
        elif stype == 'callout':
            vm = re.search(r"variant:'([^']*)'" , sec_str)
            titlem = re.search(r"title:'((?:[^'\\]|\\.)*)'", sec_str)
            bodym  = re.search(r"body:'((?:[^'\\]|\\.)*)'", sec_str, re.DOTALL)
            sec['variant'] = vm.group(1) if vm else 'sky'
            sec['title']   = titlem.group(1) if titlem else ''
            sec['body']    = bodym.group(1) if bodym else ''
        elif stype == 'route':
            titlem = re.search(r"title:'((?:[^'\\]|\\.)*)'", sec_str)
            bm = re.search(r'steps:\s*\[', sec_str)
            steps = []
            if bm:
                ab = bm.end() - 1
                ae = find_matching_bracket(sec_str, ab)
                steps_str = sec_str[ab+1:ae]
                for sm in re.finditer(r"'((?:[^'\\]|\\.)*)'", steps_str):
                    steps.append(sm.group(1))
            sec['title'] = titlem.group(1) if titlem else ''
            sec['steps'] = steps
        elif stype == 'infoBox':
            titlem = re.search(r"title:'((?:[^'\\]|\\.)*)'", sec_str)
            bm = re.search(r'rows:\s*\[', sec_str)
            rows = []
            if bm:
                ab = bm.end() - 1
                ae = find_matching_bracket(sec_str, ab)
                rows_str = sec_str[ab+1:ae]
                for rm in re.finditer(r"label:'((?:[^'\\]|\\.)*)'.*?value:'((?:[^'\\]|\\.)*)'" , rows_str, re.DOTALL):
                    rows.append({'label': rm.group(1), 'value': rm.group(2)})
            sec['title'] = titlem.group(1) if titlem else ''
            sec['rows']  = rows
        elif stype == 'faq':
            bm = re.search(r'items:\s*\[', sec_str)
            items = []
            if bm:
                ab = bm.end() - 1
                ae = find_matching_bracket(sec_str, ab)
                faq_str = sec_str[ab+1:ae]
                for qm in re.finditer(r"q:'((?:[^'\\]|\\.)*)'.*?a:'((?:[^'\\]|\\.)*)'" , faq_str, re.DOTALL):
                    items.append({'q': qm.group(1), 'a': qm.group(2)})
            sec['items'] = items

        sections.append(sec)
        i = brace_end + 1
    return sections

# ── sections → Markdown ──────────────────────────────────────
def sections_to_md(sections):
    lines = []
    for s in sections:
        t = s.get('type')
        if t == 'h2':
            lines.append(f"\n## {s.get('text','')}\n")
        elif t == 'p':
            lines.append(s.get('text','') + '\n')
        elif t == 'blockquote':
            lines.append(f"> {s.get('text','')}\n")
        elif t == 'ul':
            for item in s.get('items',[]):
                lines.append(f'- {item}')
            lines.append('')
        elif t == 'callout':
            icon = '⚠️' if s.get('variant') == 'amber' else '💡'
            title = s.get('title','')
            body  = s.get('body','')
            lines.append(f"> {icon} **{title}**" if title else f"> {icon}")
            lines.append(f"> {body}\n")
        elif t == 'route':
            lines.append(f"**{s.get('title','')}**")
            for idx, step in enumerate(s.get('steps',[]), 1):
                lines.append(f"{idx}. {step}")
            lines.append('')
        elif t == 'infoBox':
            title = s.get('title','')
            if title: lines.append(f"**{title}**")
            lines.append('| 項目 | 說明 |')
            lines.append('|---|---|')
            for row in s.get('rows',[]):
                lines.append(f"| {row.get('label','')} | {row.get('value','')} |")
            lines.append('')
        elif t == 'faq':
            for item in s.get('items',[]):
                lines.append(f"**Q: {item.get('q','')}**")
                lines.append(f"A: {item.get('a','')}\n")
    return '\n'.join(lines)

# ── 寫 CSV ───────────────────────────────────────────────────
import csv
def get_str(js, key):
    m = re.search(key + r"\s*:\s*'((?:[^'\\]|\\.)*)'" , js, re.DOTALL)
    return m.group(1) if m else ''

csv_path = os.path.join(OUT_DIR, 'notion_trips.csv')
with open(csv_path, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['名稱','eyebrow','lead','年份','天數','標籤','封面圖','狀態','摘要'])
    for key, val_js in raw_trips:
        meta = trips_meta.get(key, {})
        writer.writerow([
            key,
            get_str(val_js, 'eyebrow'),
            get_str(val_js, 'lead'),
            meta.get('year',''),
            meta.get('days',''),
            meta.get('tag',''),
            meta.get('image',''),
            '已發布',
            meta.get('summary','')
        ])
print(f'CSV: {csv_path}')

# ── 寫 Markdown ───────────────────────────────────────────────
md_dir = os.path.join(OUT_DIR, 'markdown')
os.makedirs(md_dir, exist_ok=True)

for key, val_js in raw_trips:
    eyebrow = get_str(val_js, 'eyebrow')
    lead    = get_str(val_js, 'lead')
    sections = parse_sections(val_js)

    md = f'# {key}\n\n'
    if eyebrow: md += f'_{eyebrow}_\n\n'
    if lead: md += f'{lead}\n\n---\n'
    md += sections_to_md(sections)

    # moments
    mm = re.search(r"moments:'((?:[^'\\]|\\.)*)'" , val_js, re.DOTALL)
    if mm: md += f'\n\n---\n> {mm.group(1)}\n'

    fname = os.path.join(md_dir, key.replace('/', '-') + '.md')
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(md)
    print(f'  {key}.md ({len(sections)} sections)')

print(f'\nDone! {len(raw_trips)} markdown files in {md_dir}/')
print('\n匯入 Notion 步驟：')
print('1. 在 Notion 新建 Database，欄位參考 notion_trips.csv 第一列')
print('2. 匯入 CSV：Notion → Import → CSV')
print('3. 每個旅程頁面：複製對應 .md 內容貼入 Notion 頁面')
print('   （Notion 支援直接貼上 Markdown，h2/bullet/blockquote 自動轉換）')
