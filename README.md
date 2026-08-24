# ColoneD.github.io

개인 소개 사이트. <https://choigs.github.io/ColoneD.github.io/>

## 구성

```
index.html        한 페이지 (Hero → 소개 → 경력 → 기술 → 푸터)
css/style.css     스타일 (CSS 커스텀 속성으로 라이트/다크 테마)
js/main.js        테마 토글, 스크롤 스파이, 등장 애니메이션
assets/img/       프로필 이미지, 파비콘
```

빌드 과정이 없습니다. `index.html` 을 그대로 열어도 동작하고,
GitHub Pages 가 저장소를 그대로 서빙합니다.

로컬에서 확인할 때:

```sh
python3 -m http.server 8000
# http://127.0.0.1:8000
```

## 메모

- 프레임워크 없음. 외부 요청은 [Pretendard](https://github.com/orioncactus/pretendard) 폰트 CDN 하나뿐입니다.
- 테마는 처음에는 OS 설정을 따르고, 헤더의 토글로 바꾸면 `localStorage` 에 기억됩니다.
- 프로필 이미지는 `gwangseon.png` 가 원본이고, 실제로 쓰는 건 440px 로 줄인
  `gwangseon-440.webp` (PNG 대체본 포함) 입니다. 원본을 바꿨다면 다시 만들어 주세요.

  ```sh
  sips -Z 440 assets/img/gwangseon.png --out assets/img/gwangseon-440.png
  cwebp -q 82 -alpha_q 100 -m 6 assets/img/gwangseon-440.png -o assets/img/gwangseon-440.webp
  ```
