
#!/bin/bash

# set -e  # Exit on any error

# echo "📦 [1] 프론트엔드 빌드 시작"
# cd frontend/FE

# # Check if node_modules exists to skip install if possible
# if [ ! -d "node_modules" ]; then
#     echo "📦 npm install 실행 중..."
#     npm install
# else
#     echo "📦 node_modules가 이미 존재합니다. 설치를 건너뜁니다."
# fi

# # Vite 빌드
# echo "⚙️ npm run build 실행 중..."
# npm run build

# 빌드 완료 후 루트로 돌아감
# cd ../..

echo "🚀 FastAPI 서버 시작 (포트 8000)"
exec uvicorn main:app --host 0.0.0.0 --port 8000
