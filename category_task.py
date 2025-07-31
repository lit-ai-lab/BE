import json
from collections import defaultdict

# === 1. 파일 경로 설정 ===
INPUT_FILE = "pap2025_41989_false_auto_v2.json"
OUTPUT_FILE = "category_tasks_a.json"

# === 2. 기준이 되는 category 목록 ===
categories = [
    "01 세입(지방세)",
    "02 세입(지방세외수입)",
    "03 예산 편성 및 지출",
    "04 계약",
    "05 보조금",
    "06 기금",
    "07 국고금/시도군 금고금",
    "08 국공유재산",
    "09 유가증권",
    "10 기획관리",
    "11 인사조직",
    "12 문서관리",
    "13 협조보고",
    "14 규제감독",
    "15 민원 및 인허가"
]

# === 3. 분야별 업무를 저장할 dict (중복 방지를 위해 set 사용) ===
category_to_tasks = defaultdict(set)

# === 4. 데이터 로드 및 매핑 처리 ===
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    audit_data = json.load(f)

for item in audit_data:
    category = item.get("auto_분야")
    task = item.get("auto_업무")

    # 유효한 분야가 아니면 '기타'로 분류
    if task:
        if category in categories:
            category_to_tasks[category].add(task)
        else:
            category_to_tasks["기타"].add(task)

# === 5. 최종 JSON 변환 (set → list) ===
result = {
    category: sorted(list(tasks))
    for category, tasks in category_to_tasks.items()
}

# === 6. 저장 ===
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"✅ 분야별 업무 JSON 저장 완료: {OUTPUT_FILE}")
