#!/ usr/bin/env python3
"""
공고 URL에서 기업 로고 이미지 크롤링
- CSV의 URL 컬럼에서 공고 페이지 접속
- 기업 로고 이미지 다운로드
- 기업명.png 형식으로 저장
"""

import csv
import os
import random
import sys
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote
import argparse
import json
from pathlib import Path

# Windows 콘솔 인코딩 문제 해결
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# User-Agent 풀
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
]


class LogoCrawler:
    def __init__(self, output_dir: str = "company_logos", min_delay: float = 1.0, max_delay: float = 3.0):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.session = requests.Session()
        
        # 체크포인트 파일
        self.checkpoint_file = self.output_dir / "_checkpoint.json"
        self.completed_urls = self._load_checkpoint()
        
        # 로고 URL 저장 (기업명 -> 로고URL)
        self.logo_urls = {}
        self.logo_csv_file = self.output_dir / "logo_urls.csv"
        
        # 통계
        self.stats = {
            "total": 0,
            "success": 0,
            "skipped": 0,  # 이미 완료된 것
            "failed": 0,
            "no_logo": 0,
        }
    
    def _load_checkpoint(self) -> set:
        """체크포인트 로드"""
        if self.checkpoint_file.exists():
            try:
                with open(self.checkpoint_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return set(data.get("completed_urls", []))
            except:
                pass
        return set()
    
    def _save_checkpoint(self):
        """체크포인트 저장"""
        with open(self.checkpoint_file, "w", encoding="utf-8") as f:
            json.dump({"completed_urls": list(self.completed_urls)}, f, ensure_ascii=False)
    
    def _save_logo_urls_csv(self):
        """로고 URL 목록을 CSV로 저장"""
        with open(self.logo_csv_file, "w", encoding="utf-8", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["기업명", "로고URL", "파일명"])
            for company_name, logo_url in self.logo_urls.items():
                safe_name = self._sanitize_filename(company_name)
                ext = self._get_extension_from_url(logo_url)
                filename = f"{safe_name}{ext}"
                writer.writerow([company_name, logo_url, filename])
    
    def _get_headers(self) -> dict:
        """랜덤 헤더 생성"""
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Referer": "https://jasoseol.com/",
        }
    
    def _safe_delay(self):
        """안전한 딜레이"""
        delay = random.uniform(self.min_delay, self.max_delay)
        time.sleep(delay)
    
    def _sanitize_filename(self, name: str) -> str:
        """파일명에 사용할 수 없는 문자 제거"""
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            name = name.replace(char, '_')
        return name.strip()
    
    def _get_extension_from_url(self, url: str) -> str:
        """URL에서 확장자 추출"""
        parsed = urlparse(url)
        path = unquote(parsed.path)
        
        # webp, png, jpg, jpeg, gif 등
        if ".webp" in path:
            return ".webp"
        elif ".png" in path:
            return ".png"
        elif ".jpg" in path or ".jpeg" in path:
            return ".jpg"
        elif ".gif" in path:
            return ".gif"
        else:
            return ".png"  # 기본값
    
    def fetch_page(self, url: str) -> BeautifulSoup | None:
        """페이지 HTML 가져오기"""
        try:
            response = self.session.get(url, headers=self._get_headers(), timeout=30)
            
            if response.status_code == 429:
                print(f"  ⚠️ Rate limit (429) - 2분 대기...")
                time.sleep(120)
                return self.fetch_page(url)
            
            if response.status_code == 403:
                print(f"  ⚠️ Forbidden (403) - 5분 대기...")
                time.sleep(300)
                return self.fetch_page(url)
            
            if response.status_code != 200:
                print(f"  ❌ HTTP {response.status_code}")
                return None
            
            return BeautifulSoup(response.text, "html.parser")
        
        except Exception as e:
            print(f"  ❌ 요청 실패: {e}")
            return None
    
    def download_image(self, img_url: str, save_path: Path) -> bool:
        """이미지 다운로드"""
        try:
            headers = self._get_headers()
            headers["Accept"] = "image/webp,image/apng,image/*,*/*;q=0.8"
            
            response = self.session.get(img_url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                with open(save_path, "wb") as f:
                    f.write(response.content)
                return True
            else:
                print(f"  ❌ 이미지 다운로드 실패: HTTP {response.status_code}")
                return False
        
        except Exception as e:
            print(f"  ❌ 이미지 다운로드 실패: {e}")
            return False
    
    def extract_logo_info(self, soup: BeautifulSoup) -> tuple[str | None, str | None]:
        """
        페이지에서 로고 이미지 URL과 기업명 추출
        
        로고: <div class="w-[36px] h-[36px]..."><img src="..." alt="기업명 기업 아이콘"></div>
        기업명: <h2 class="ml-3 header6 text-gray-900">기업명</h2>
        """
        company_name = None
        logo_url = None
        
        # 기업명 추출 - h2 태그에서
        h2 = soup.select_one("h2.header6.text-gray-900, h2.ml-3.header6")
        if h2:
            company_name = h2.get_text(strip=True)
        
        # 로고 이미지 추출 - 36x36 div 내부의 img
        logo_div = soup.select_one('div.w-\\[36px\\].h-\\[36px\\]')
        if logo_div:
            img = logo_div.select_one("img")
            if img:
                logo_url = img.get("src") or img.get("data-src")
        
        # 대체 방법: alt에 "기업 아이콘"이 포함된 img
        if not logo_url:
            imgs = soup.select("img[alt*='기업 아이콘']")
            if imgs:
                logo_url = imgs[0].get("src") or imgs[0].get("data-src")
                # 기업명도 alt에서 추출 가능
                if not company_name:
                    alt = imgs[0].get("alt", "")
                    if "기업 아이콘" in alt:
                        company_name = alt.replace("기업 아이콘", "").strip()
        
        return company_name, logo_url
    
    def process_url(self, url: str, row_company_name: str = None) -> bool:
        """
        단일 URL 처리
        
        Args:
            url: 공고 페이지 URL
            row_company_name: CSV에서 읽은 기업명 (백업용)
        """
        # 이미 처리된 URL 스킵
        if url in self.completed_urls:
            self.stats["skipped"] += 1
            return True
        
        print(f"  📥 {url}")
        
        # 페이지 가져오기
        soup = self.fetch_page(url)
        if not soup:
            self.stats["failed"] += 1
            return False
        
        # 로고 정보 추출
        company_name, logo_url = self.extract_logo_info(soup)
        
        # 기업명이 없으면 CSV의 기업명 사용
        if not company_name and row_company_name:
            company_name = row_company_name
        
        if not company_name:
            print(f"    ⚠️ 기업명 추출 실패")
            self.stats["failed"] += 1
            return False
        
        if not logo_url:
            print(f"    ⚠️ 로고 없음: {company_name}")
            self.stats["no_logo"] += 1
            self.completed_urls.add(url)
            return False
        
        # 이미 다운로드한 기업인지 확인
        safe_name = self._sanitize_filename(company_name)
        ext = self._get_extension_from_url(logo_url)
        save_path = self.output_dir / f"{safe_name}{ext}"
        
        # 로고 URL 저장 (이미 존재하든 아니든 저장)
        self.logo_urls[company_name] = logo_url
        
        if save_path.exists():
            print(f"    ✅ 이미 존재: {safe_name}{ext}")
            self.completed_urls.add(url)
            return True
        
        # 이미지 다운로드
        if self.download_image(logo_url, save_path):
            print(f"    ✅ 저장: {safe_name}{ext}")
            self.stats["success"] += 1
            self.completed_urls.add(url)
            return True
        else:
            self.stats["failed"] += 1
            return False
    
    def crawl_from_csv(self, csv_path: str):
        """CSV 파일에서 URL 읽어서 크롤링"""
        print(f"\n📂 CSV 파일: {csv_path}")
        print(f"📁 저장 폴더: {self.output_dir.absolute()}")
        print(f"⏱️ 딜레이: {self.min_delay}~{self.max_delay}초")
        print(f"✅ 이미 완료된 URL: {len(self.completed_urls)}개")
        print("-" * 60)
        
        # CSV 읽기
        urls_to_process = []
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                url = row.get("URL", "").strip()
                company_name = row.get("기업명", "").strip()
                if url:
                    urls_to_process.append((url, company_name))
        
        self.stats["total"] = len(urls_to_process)
        print(f"📊 총 {self.stats['total']}개 URL 발견\n")
        
        # 중복 제거 (같은 기업 여러 공고)
        unique_companies = {}
        for url, company_name in urls_to_process:
            if company_name and company_name not in unique_companies:
                unique_companies[company_name] = url
        
        print(f"🏢 고유 기업 수: {len(unique_companies)}개\n")
        
        # 크롤링
        for i, (company_name, url) in enumerate(unique_companies.items(), 1):
            print(f"[{i}/{len(unique_companies)}] {company_name}")
            
            self.process_url(url, company_name)
            
            # 체크포인트 저장 (10개마다)
            if i % 10 == 0:
                self._save_checkpoint()
                print(f"\n💾 체크포인트 저장 ({len(self.completed_urls)}개 완료)")
                print(f"   성공: {self.stats['success']}, 실패: {self.stats['failed']}, 로고없음: {self.stats['no_logo']}\n")
            
            # 딜레이
            if i < len(unique_companies):
                self._safe_delay()
        
        # 최종 체크포인트 저장
        self._save_checkpoint()
        
        # 로고 URL CSV 저장
        self._save_logo_urls_csv()
        
        # 결과 출력
        print("\n" + "=" * 60)
        print("📊 크롤링 완료!")
        print(f"   총 기업: {len(unique_companies)}개")
        print(f"   성공: {self.stats['success']}개")
        print(f"   스킵(이미완료): {self.stats['skipped']}개")
        print(f"   로고없음: {self.stats['no_logo']}개")
        print(f"   실패: {self.stats['failed']}개")
        print(f"\n📁 저장 위치: {self.output_dir.absolute()}")
        print(f"📄 로고 URL 목록: {self.logo_csv_file.absolute()}")


def main():
    parser = argparse.ArgumentParser(description="공고 URL에서 기업 로고 이미지 크롤링")
    parser.add_argument("csv_path", help="CSV 파일 경로 (URL 컬럼 포함)")
    parser.add_argument("-o", "--output", default="company_logos", help="로고 저장 폴더 (기본: company_logos)")
    parser.add_argument("--delay", nargs=2, type=float, default=[1.0, 3.0], 
                        metavar=("MIN", "MAX"), help="요청 딜레이 범위 (기본: 1.0 3.0)")
    parser.add_argument("--reset", action="store_true", help="체크포인트 초기화 후 처음부터 시작")
    
    args = parser.parse_args()
    
    # 체크포인트 초기화
    if args.reset:
        checkpoint_path = Path(args.output) / "_checkpoint.json"
        if checkpoint_path.exists():
            checkpoint_path.unlink()
            print("🔄 체크포인트 초기화됨")
    
    # 크롤러 실행
    crawler = LogoCrawler(
        output_dir=args.output,
        min_delay=args.delay[0],
        max_delay=args.delay[1]
    )
    
    crawler.crawl_from_csv(args.csv_path)


if __name__ == "__main__":
    main()
