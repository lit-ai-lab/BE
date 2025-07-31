import json
from typing import List, Dict

# 경기권 시 리스트
GYEONGGI_CITIES = {
    "수원시", "고양시", "용인시", "화성시", "성남시", "의정부시", "안양시",
    "부천시", "광명시", "평택시", "동두천시", "안산시", "과천시", "구리시",
    "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "파주시",
    "이천시", "안성시", "김포시", "광주시", "양주시", "포천시", "여주시"
}
#강원
GANGWON_CITIES = {
    "강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시",
    "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군",
    "평창군", "홍천군", "화천군", "횡성군"
}
CHUNGBUK_CITIES = {
    "제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군",
    "옥천군", "음성군", "증평군", "진천군"
}
CHUNGNAM_CITIES = {
    "계룡시", "공주시", "논산시", "당진시", "보령시", "서산시", "아산시",
    "천안시", "금산군", "부여군", "서천군", "예산군", "청양군", "태안군",
    "홍성군"
}
JEONBUK_CITIES = {
    "군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군",
    "무주군", "부안군", "수창군", "완주군", "임실군", "장수군", "진안군"
}
JEONNAM_CITIES = {
    "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군",
    "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군",
    "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군",
    "신안군"
}
GYEONBUK_CITIES = {
    "경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시",
    "영주시", "영천시", "포항시", "고령군", "봉화군", "성주군", "영덕군",
    "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군",
    "칠곡군"
}
GYEONNAM_CITIES = {
    "창원시", "거제시", "김해시", "밀양시", "사천시", "양산시", "진주시",
    "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군",
    "하동군", "함안군", "함양군", "합천군"
}

def filter_and_extract_multi_v2(
    input_path: str,
    output_path: str,
    keywords: List[str]
):
    """
    - input_path  : 원본 JSON 파일 경로
    - output_path : 생성될 JSON 파일 경로
    - keywords    : "key" 필드에서 찾고자 하는 임의의 단어들
    """
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    result: List[Dict[str, str]] = []
    seen = set()  # 중복 제거용

    for entry in data:
        agency_val = entry.get("감사실시기관")
        if not agency_val:
            continue

        #  경기권 시 필터링
        if agency_val in GYEONGGI_CITIES:
            state = "경기"

        elif agency_val in CHUNGBUK_CITIES:
            state = "충청북도"

        elif agency_val in CHUNGNAM_CITIES:
            state = "충청남도"
        
        elif agency_val in JEONBUK_CITIES:
            state = "전북"

        elif agency_val in JEONNAM_CITIES:
            state = "전라남도"

        elif agency_val in GYEONBUK_CITIES:
            state = "경상북도"

        elif agency_val in GYEONNAM_CITIES:
            state = "경상남도"
            
        elif agency_val in GANGWON_CITIES:
            state = "강원"    

        else:
            # 그렇지 않으면 key 기반 매칭
            key_val = entry.get("key", "")
            if not key_val or "-" not in key_val:
                continue
            prefix = key_val.split("-", 1)[0]
            state = None
            for kw in keywords:
                if prefix.startswith(kw):
                    state = kw
                    break

        # state가 결정되지 않았으면 스킵
        if not state:
            continue

        record = (state, agency_val)
        if record in seen:
            continue
        seen.add(record)

        result.append({
            "state": state,
            "agency": agency_val
        })

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    input_file  = "pap2025_41989_false_auto_v2.json"
    output_file = "filtered_multi_v2.json"
    keywords    = [
        "서울", "부산", "대구", "인천", "광주", "경기", "대전", "울산",
        "세종", "강원", "충청북도", "충청남도", "전북", "전라남도",
        "경상북도", "경상남도", "제주"
    ]

    filter_and_extract_multi_v2(input_file, output_file, keywords)
    print(f"가공된 항목을 '{output_file}'에 저장했습니다.")
