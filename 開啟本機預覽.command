#!/bin/bash
# 雙擊此檔可在本機用 HTTP 預覽（不要用 file:// 直接開 html）
cd "$(dirname "$0")"
PORT=9341
echo ""
echo "  請在瀏覽器開啟： http://127.0.0.1:${PORT}/index.html"
echo "  關閉此視窗或按 Ctrl+C 會停止伺服器。"
echo ""
exec python3 -m http.server "$PORT"
