#!/bin/bash
set -e

# --- 强制 UTF-8 ---
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

# --- Hexo 生成 ---
echo "[1/3] Hexo 静态文件生成中..."
hexo clean > /dev/null
hexo generate > /dev/null

# --- Cloudflare 配置 ---
ACCOUNT_ID="f432b72044248ec655af0e4562bd8023"
API_TOKEN="Wrk4VK84STiesgbdceMlKy3uqqVt4nOUI9QaHsT5"  # 必须修改！
PROJECT_NAME="kapmif-blog-$(date +%Y%m%d%H%M%S)"  # 动态名称

# --- 删除历史项目（可选）---
echo "[2/3] 清理历史项目..."
curl -sS -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/kapmif-blog*" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" || true

# --- 创建项目 ---
echo "[3/3] 创建新项目: $PROJECT_NAME..."
response=$(curl -sS -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$PROJECT_NAME\",\"production_branch\":\"main\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

http_status=$(echo "$response" | grep 'HTTP_STATUS:' | cut -d':' -f2)
if [[ "$http_status" -ne 200 ]]; then
  echo "!!! 创建失败 !!!"
  echo "响应状态码: $http_status"
  echo "原始响应: $response"
  exit 1
fi

# --- 部署 ---
echo "y" | npx wrangler pages deploy ./public \
  --project-name="$PROJECT_NAME" \
  --branch=main
