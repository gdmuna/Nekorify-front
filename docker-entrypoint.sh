#!/bin/sh
set -e

# 用 envsubst 替换 index.html 里的占位符
envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

exec nginx -g "daemon off;"
