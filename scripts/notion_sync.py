#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Notion → 網站資料同步腳本。"""
import json
import os
import re
from datetime import datetime
import requests


def load_dotenv(dotenv_path=None):
    path = dotenv_path or os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            key = key.strip()
            value = value.strip()
            if not key or key in os.environ:
                continue
            if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
                value = value[1:-1]
            os.environ[key] = value


def require_env(name):
    value = os.environ.get(name, '').strip()
    if value:
        return value
    raise SystemExit(f'缺少環境變數：{name}')


load_dotenv()
NOTION_TOKEN = require_env('NOTION_TOKEN')
DATABASE_ID = require_env('NOTION_DATABASE_ID')
WEBSITE_DIR = os.environ.get(
    'JIUAN_TRAVEL_WEBSITE_DIR',
    os.path.dirname(os.path.dirname(__file__))
)
OUTPUT_TRIPS_DATA = os.path.join(WEBSITE_DIR, 'trips-data.js')
OUTPUT_TRIP_DETAILS = os.path.join(WEBSITE_DIR, 'trip-detail-data.js')
OUTPUT_TRIPS_DIR = os.path.join(WEBSITE_DIR, 'trips')
DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
HEADERS = {
    'Authorization': f'Bearer {NOTION_TOKEN}',
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
}
DEBUG_BLOCKS = False


def get_text(items):
    return ''.join(x.get('plain_text', '') for x in (items or []))
def prop(props, key):
    return props.get(key, {})
def prop_title(props, key='名稱'):
    return get_text(prop(props, key).get('title', []))
def prop_rich(props, key):
    return get_text(prop(props, key).get('rich_text', []))
def prop_select(props, key):
    v = prop(props, key).get('select')
    return v.get('name', '') if v else ''

def prop_multi(props, key):
    return [x.get('name', '') for x in prop(props, key).get('multi_select', []) if x.get('name')]
def prop_option_text(props, key):
    return prop_select(props, key) or ', '.join(prop_multi(props, key))
def prop_number(props, key):
    return prop(props, key).get('number')
def prop_checkbox(props, key):
    return bool(prop(props, key).get('checkbox', False))
def prop_url(props, key):
    return prop(props, key).get('url', '') or ''

def prop_date(props, key='日期'):

    v = prop(props, key).get('date')
    return ((v or {}).get('start', '') or '', (v or {}).get('end', '') or '')

def parse_date(text):

    if not text:
        return None
    try:
        return datetime.fromisoformat(text.replace('Z', '+00:00'))
    except ValueError:
        return None

def infer_days(start, end):

    s, e = parse_date(start), parse_date(end)
    return (e.date() - s.date()).days + 1 if s and e else None

def section_id(text):

    slug = re.sub(r'[^\w\u4e00-\u9fff]+', '-', text or '').strip('-').lower()
    return 'sec-' + (slug[:40] or 'section')

def get_children(block_id):

    url = f'https://api.notion.com/v1/blocks/{block_id}/children'
    blocks, cursor = [], None
    while True:
        params = {'page_size': 100}
        if cursor:
            params['start_cursor'] = cursor
        res = requests.get(url, headers=HEADERS, params=params)
        res.raise_for_status()
        data = res.json()
        blocks.extend(data.get('results', []))
        if not data.get('has_more'):
            return blocks
        cursor = data.get('next_cursor')

def get_pages():

    url = f'https://api.notion.com/v1/databases/{DATABASE_ID}/query'
    payload = {}
    res = requests.post(url, headers=HEADERS, json=payload)
    if not res.ok:
        print('Notion query failed:')
        print(res.text)
    res.raise_for_status()
    return res.json().get('results', [])

def faq_answer(children):

    out = []
    for c in children:
        ctype = c.get('type')
        if ctype in ('paragraph', 'bulleted_list_item', 'numbered_list_item', 'quote'):
            text = get_text(c.get(ctype, {}).get('rich_text', [])).strip()
            if text:
                out.append(text)
    return '\n'.join(out)

def table_rows(block):

    rows = []
    for row in get_children(block['id']):
        if row.get('type') != 'table_row':
            continue
        cells = row['table_row'].get('cells', [])
        if len(cells) < 2:
            continue
        label, value = get_text(cells[0]).strip(), get_text(cells[1]).strip()
        if label or value:
            rows.append({'label': label, 'value': value})
    return rows

def expand_blocks(blocks):

    expanded = []
    for block in blocks:
        btype = block.get('type')
        if block.get('has_children') and btype in ('callout', 'column_list', 'column', 'synced_block'):
            if btype == 'callout':
                text = get_text(block.get('callout', {}).get('rich_text', [])).strip()
                if text:
                    expanded.append(block)
            children = get_children(block['id'])
            expanded.extend(expand_blocks(children))
        else:
            expanded.append(block)
    return expanded

def debug_blocks(page_id):

    if not DEBUG_BLOCKS:
        return
    blocks = get_children(page_id)
    types = [b.get('type') for b in blocks]
    print('Top-level blocks:', types)
    flat = expand_blocks(blocks)
    flat_types = [b.get('type') for b in flat]
    print('Flattened blocks:', flat_types)

def md_inline_to_html(text):
    if not text:
        return ''
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__(.+?)__', r'<strong>\1</strong>', text)
    return text

def notion_file_url(file_obj):
    if not file_obj:
        return ''
    if file_obj.get('type') == 'external':
        return ((file_obj.get('external') or {}).get('url', '') or '').strip()
    if file_obj.get('type') == 'file':
        return ((file_obj.get('file') or {}).get('url', '') or '').strip()
    return ''

def parse_local_image_meta(text):
    text = (text or '').strip()
    m = re.match(r'^local\s*:\s*(.+)$', text, re.IGNORECASE)
    if not m:
        return None
    body = m.group(1).strip()
    parts = [p.strip() for p in body.split('|')]
    src = ''
    caption = ''
    if parts:
        src = parts[0].strip()
    for part in parts[1:]:
        cm = re.match(r'^caption\s*:\s*(.*)$', part, re.IGNORECASE)
        if cm:
            caption = cm.group(1).strip()
    if src.startswith('/'):
        src = src[1:]
    return {'src': src, 'caption': caption} if src else None

def image_block_item(block):
    data = block.get('image', {})
    caption_text = get_text(data.get('caption', [])).strip()
    return parse_local_image_meta(caption_text)

def parse_markdown_sections(text):
    toc, sections = [], []
    paragraph = []
    items = []
    table_lines = []
    quote_lines = []
    def flush_paragraph():
        if paragraph:
            sections.append({'type': 'p', 'text': md_inline_to_html(' '.join(paragraph).strip())})
            paragraph.clear()
    def flush_items():
        if items:
            sections.append({'type': 'ul', 'items': items[:]})
            items.clear()
    def flush_quote():
        if quote_lines:
            text = md_inline_to_html('\n'.join(quote_lines).strip())
            if text.startswith('⚠️') or text.startswith('❗') or text.startswith('🔶'):
                sections.append({'type': 'callout', 'variant': 'amber', 'title': '', 'body': text})
            else:
                sections.append({'type': 'blockquote', 'text': md_inline_to_html(text)})
            quote_lines.clear()
    def flush_table():
        if table_lines:
            rows = []
            for line in table_lines:
                parts = [p.strip() for p in line.strip('|').split('|')]
                if parts:
                    rows.append(parts)
            if len(rows) >= 2:
                headers = rows[0]
                body_rows = [r for r in rows[2:] if any(c for c in r)] if len(rows) > 2 else []
                info_rows = []
                for r in body_rows:
                    if len(r) >= 2:
                        info_rows.append({'label': md_inline_to_html(r[0]), 'value': md_inline_to_html(r[1])})
                if info_rows:
                    title = md_inline_to_html(headers[0] if headers else '')
                    sections.append({'type': 'infoBox', 'title': title, 'rows': info_rows})
            table_lines.clear()
    for line in (text or '').splitlines():
        raw = line.rstrip()
        stripped = raw.strip()
        if not stripped:
            flush_table()
            flush_quote()
            flush_items()
            flush_paragraph()
            continue
        if re.match(r'^-{3,}$', stripped):
            flush_table()
            flush_quote()
            flush_items()
            flush_paragraph()
            continue
        if stripped.startswith('>'):
            flush_table()
            flush_items()
            flush_paragraph()
            content = stripped.lstrip('>').strip()
            if content:
                quote_lines.append(content)
            continue
        if '|' in stripped and stripped.startswith('|') and stripped.endswith('|'):
            flush_quote()
            flush_items()
            flush_paragraph()
            table_lines.append(stripped)
            continue
        flush_table()
        flush_quote()
        m = re.match(r'^(#{1,6})\s+(.+)$', stripped)
        if m:
            flush_items()
            flush_paragraph()
            title = m.group(2).strip()
            if title:
                sid = section_id(title)
                toc.append({'id': sid, 'title': title})
                sections.append({'type': 'h2', 'id': sid, 'text': md_inline_to_html(title)})
            continue
        m = re.match(r'^[-*]\s+(.+)$', stripped)
        if m:
            flush_paragraph()
            item = m.group(1).strip()
            if item:
                items.append(md_inline_to_html(item))
            continue
        m = re.match(r'^\d+\.\s+(.+)$', stripped)
        if m:
            flush_paragraph()
            item = m.group(1).strip()
            if item:
                items.append(md_inline_to_html(item))
            continue
        paragraph.append(stripped)
    flush_table()
    flush_quote()
    flush_items()
    flush_paragraph()
    return toc, sections

def blocks_to_sections(blocks):

    blocks = expand_blocks(blocks)
    toc, sections, i = [], [], 0
    while i < len(blocks):
        b = blocks[i]
        t = b.get('type')
        if t in ('heading_1', 'heading_2', 'heading_3'):
            text = get_text(b[t].get('rich_text', [])).strip()
            if text:
                sid = section_id(text)
                toc.append({'id': sid, 'title': text})
                sections.append({'type': 'h2', 'id': sid, 'text': md_inline_to_html(text)})
            i += 1
        elif t == 'paragraph':
            text = get_text(b['paragraph'].get('rich_text', [])).strip()
            if text:
                sections.append({'type': 'p', 'text': md_inline_to_html(text)})
            i += 1
        elif t in ('bulleted_list_item', 'numbered_list_item'):
            items = []
            while i < len(blocks) and blocks[i].get('type') in ('bulleted_list_item', 'numbered_list_item'):
                cur = blocks[i]
                text = get_text(cur[cur['type']].get('rich_text', [])).strip()
                if text:
                    items.append(md_inline_to_html(text))
                i += 1
            if items:
                sections.append({'type': 'ul', 'items': items})
        elif t == 'callout':
            data = b['callout']
            text = get_text(data.get('rich_text', [])).strip()
            emoji = (data.get('icon') or {}).get('emoji', '')
            if text:
                sections.append({'type': 'callout', 'variant': 'amber' if emoji in ['⚠️', '🔶', '❗'] else 'sky', 'title': '', 'body': md_inline_to_html(text)})
            i += 1
        elif t == 'quote':
            text = get_text(b['quote'].get('rich_text', [])).strip()
            if text:
                sections.append({'type': 'blockquote', 'text': md_inline_to_html(text)})
            i += 1
        elif t == 'toggle':
            items = []
            while i < len(blocks) and blocks[i].get('type') == 'toggle':
                cur = blocks[i]
                q = get_text(cur['toggle'].get('rich_text', [])).strip()
                if q:
                    items.append({'q': md_inline_to_html(q), 'a': md_inline_to_html(faq_answer(get_children(cur['id'])))})
                i += 1
            if items:
                sections.append({'type': 'faq', 'items': items})
        elif t == 'table':
            rows = table_rows(b)
            if rows:
                sections.append({'type': 'infoBox', 'title': '', 'rows': rows})
            i += 1
        elif t == 'image':
            items = []
            while i < len(blocks) and blocks[i].get('type') == 'image':
                item = image_block_item(blocks[i])
                if item:
                    items.append(item)
                i += 1
            if items:
                sections.append({'type': 'photos', 'items': items})
        elif t == 'embed':
            src = ''
            caption = ''
            if i + 1 < len(blocks) and blocks[i + 1].get('type') == 'paragraph':
                next_text = get_text(blocks[i + 1]['paragraph'].get('rich_text', [])).strip()
                meta = parse_local_image_meta(next_text)
                if meta:
                    src = meta['src']
                    caption = meta['caption']
                    i += 1
            if src:
                sections.append({
                    'type': 'photos',
                    'items': [{'src': src, 'caption': caption}]
                })
            i += 1
        elif t == 'code':
            data = b.get('code', {})
            text = get_text(data.get('rich_text', [])).strip()
            if text:
                md_toc, md_sections = parse_markdown_sections(text)
                toc.extend(md_toc)
                sections.extend(md_sections)
            i += 1
        else:
            i += 1
    return toc, sections

def trip_summary(page):

    props = page.get('properties', {})
    trip_id = prop_title(props, '名稱')
    countries = prop_multi(props, '國家')
    start, end = prop_date(props, '開始日期')
    if not start and not end:
        start, end = prop_date(props, '日期')
    year = prop_number(props, '年份')
    if year is None:
        dt = parse_date(start or end)
        year = dt.year if dt else None
    days = prop_number(props, '天數')
    if days is None:
        days = infer_days(start, end)
    tag = prop_option_text(props, '標籤') or (countries[0] if countries else '')
    return {
        'id': trip_id,
        'name': trip_id,
        'summary': prop_rich(props, '摘要') or prop_rich(props, 'lead'),
        'image': prop_url(props, '封面圖案') or prop_url(props, '封面圖片') or DEFAULT_IMAGE,
        'href': '#',
        'tag': tag,
        'regions': prop_multi(props, '地區'),
        'countries': countries,
        'cities': prop_multi(props, '城市'),
        'year': year,
        'days': days,
        'start': start,
        'end': end,
        'status': prop_select(props, '狀態') or '已發布',
        'featured': prop_checkbox(props, '是否精選'),
    }

def trip_detail(page):

    props = page.get('properties', {})
    trip_id = prop_title(props, '名稱')
    debug_blocks(page['id'])
    toc, sections = blocks_to_sections(get_children(page['id']))
    return trip_id, {
        'guide': {
            'eyebrow': prop_rich(props, 'eyebrow'),
            'lead': prop_rich(props, 'lead') or prop_rich(props, '摘要'),
            'toc': toc,
            'sections': sections,
        },
        'countries': [],
    }

def write_trips_data(trips):

    header = """/**

 * 旅程資料 — 由 notion_sync.py 自動同步產生。

 * featured: true 顯示於首頁精選攻略。

 */

function escapeHtml(s) {

  if (s == null) return '';

  var d = document.createElement('div');

  d.textContent = s;

  return d.innerHTML;

}

function tripDetailUrl(t) {

  if (t.href && t.href !== '#' && t.href.indexOf('trip.html') !== 0) return t.href;

  return 'trip.html?id=' + encodeURIComponent(t.id);

}

function renderTripCardHTML(t) {

  var h = escapeHtml(tripDetailUrl(t));

  var name = escapeHtml(t.name);

  var summary = escapeHtml(t.summary);

  var img = escapeHtml(t.image);

  var tag = escapeHtml(t.tag);

  return (

    '<a href="' + h + '" class="group block rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all">' +
    '<div class="aspect-[3/2] overflow-hidden bg-gray-100">' +
    '<img src="' + img + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">' +
    '</div>' +
    '<div class="p-6">' +
    '<h3 class="font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">' + name + '</h3>' +
    '<p class="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">' + summary + '</p>' +
    '<div class="mt-4 flex gap-2"><span class="text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold">#' + tag + '</span></div>' +
    '</div></a>'

  );

}

"""

    with open(OUTPUT_TRIPS_DATA, 'w', encoding='utf-8') as f:
        f.write(header + 'var TRIPS_DATA = ' + json.dumps(trips, ensure_ascii=False, indent=2) + ';\n')

def write_trip_details(details):

    lines = ['var TRIP_DETAILS = {']
    for trip_id, data in details:
        key = json.dumps(trip_id, ensure_ascii=False)
        lines.append(f'  [{key}]: {json.dumps(data, ensure_ascii=False, indent=2)},')
    lines.append('};')
    with open(OUTPUT_TRIP_DETAILS, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    if os.path.isdir(OUTPUT_TRIPS_DIR):
        for trip_id, data in details:
            with open(os.path.join(OUTPUT_TRIPS_DIR, trip_id + '.js'), 'w', encoding='utf-8') as f:
                key = json.dumps(trip_id, ensure_ascii=False)
                f.write(f'/* Trip data: {trip_id} */\nif (!window.TRIP_DETAILS) window.TRIP_DETAILS = {{}};\nwindow.TRIP_DETAILS[{key}] = {json.dumps(data, ensure_ascii=False, indent=2)};\n')

def main():

    print('Fetching Notion database...')
    pages = get_pages()
    print(f'Found {len(pages)} pages')
    trips, details = [], []
    for page in pages:
        trip_id = prop_title(page.get('properties', {}), '名稱') or page.get('id', '')
        print(f'  Processing: {trip_id}')
        try:
            trips.append(trip_summary(page))
            details.append(trip_detail(page))
        except Exception as e:
            print(f'  ERROR: {e}')
    write_trips_data(trips)
    write_trip_details(details)
    print(f'\nDone! {len(details)} trips synced.')

if __name__ == '__main__':

    main()
