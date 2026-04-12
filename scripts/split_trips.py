# -*- coding: utf-8 -*-
import re, json, os

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
src = os.path.join(ROOT_DIR, 'trip-detail-data.js')
out_dir = os.path.join(ROOT_DIR, 'trips')

with open(src, 'r', encoding='utf-8') as f:
    content = f.read()

def find_matching_brace(s, start):
    depth = 0
    i = start
    in_str = False
    str_char = ''
    while i < len(s):
        c = s[i]
        if in_str:
            if c == '\\': i += 2; continue
            if c == str_char: in_str = False
        else:
            if c in ('"', "'"):
                in_str = True; str_char = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0: return i
        i += 1
    return -1

# Find the outer TRIP_DETAILS object
match = re.search(r'var TRIP_DETAILS\s*=\s*\{', content)
obj_start = match.end() - 1
obj_end = find_matching_brace(content, obj_start)
inner = content[obj_start+1:obj_end]

# Only match TOP-LEVEL keys: lines starting with optional whitespace then a key
# We detect them by scanning manually at depth=0 of the inner content
def extract_top_level_keys(s):
    results = []
    i = 0
    depth = 0
    in_str = False
    str_char = ''
    key_pattern = re.compile(r"\s*(?:'([^']+)'|\"([^\"]+)\"|([\w\u4e00-\u9fff\uff00-\uffef\u3000-\u303f\u2e80-\u2eff]+))\s*:\s*\{")
    
    while i < len(s):
        # At depth 0, try to match a key
        if depth == 0:
            m = key_pattern.match(s, i)
            if m:
                key = m.group(1) or m.group(2) or m.group(3)
                brace_start = m.end() - 1
                brace_end = find_matching_brace(s, brace_start)
                if brace_end != -1:
                    value = s[brace_start:brace_end+1]
                    results.append((key, value))
                    i = brace_end + 1
                    # skip comma and whitespace
                    while i < len(s) and s[i] in ' ,\t\n\r': i += 1
                    continue
        i += 1
    return results

trips = extract_top_level_keys(inner)
print(f'Found {len(trips)} trips:')
for key, val in trips:
    print(f'  {key} ({len(val)} chars)')

# Clean old guide.json.js files
for f in os.listdir(out_dir):
    os.remove(os.path.join(out_dir, f))

print('\nWriting individual JS files...')
for key, val_str in trips:
    fname = os.path.join(out_dir, key + '.js')
    with open(fname, 'w', encoding='utf-8') as f:
        f.write('/* Trip data: ' + key + ' */\n')
        f.write('if (!window.TRIP_DETAILS) window.TRIP_DETAILS = {};\n')
        # handle keys with dash
        if '-' in key or ' ' in key:
            f.write('window.TRIP_DETAILS[\'' + key + '\'] = ' + val_str + ';\n')
        else:
            f.write('window.TRIP_DETAILS.' + key + ' = ' + val_str + ';\n')
    print(f'  Written: {key}.js')

print(f'\nDone. {len(trips)} files written to {out_dir}')
