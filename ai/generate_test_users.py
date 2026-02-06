"""
테스트 유저 데이터 생성 스크립트
BCrypt 암호화를 사용하여 20명의 테스트 유저 생성
"""
import bcrypt
from datetime import datetime

# 테스트 유저 데이터 (20명)
TEST_USERS = [
    {"name": "김철수", "email": "chulsoo.kim@test.com", "password": "test1234!"},
    {"name": "이영희", "email": "younghee.lee@test.com", "password": "test1234!"},
    {"name": "박민수", "email": "minsu.park@test.com", "password": "test1234!"},
    {"name": "정수진", "email": "sujin.jung@test.com", "password": "test1234!"},
    {"name": "최동욱", "email": "dongwook.choi@test.com", "password": "test1234!"},
    {"name": "강민지", "email": "minji.kang@test.com", "password": "test1234!"},
    {"name": "윤서준", "email": "seojun.yoon@test.com", "password": "test1234!"},
    {"name": "한지우", "email": "jiwoo.han@test.com", "password": "test1234!"},
    {"name": "임도현", "email": "dohyun.im@test.com", "password": "test1234!"},
    {"name": "조예은", "email": "yeeun.jo@test.com", "password": "test1234!"},
    {"name": "배준호", "email": "junho.bae@test.com", "password": "test1234!"},
    {"name": "신아름", "email": "areum.shin@test.com", "password": "test1234!"},
    {"name": "홍서연", "email": "seoyeon.hong@test.com", "password": "test1234!"},
    {"name": "송태양", "email": "taeyang.song@test.com", "password": "test1234!"},
    {"name": "안지훈", "email": "jihoon.an@test.com", "password": "test1234!"},
    {"name": "류채원", "email": "chaewon.ryu@test.com", "password": "test1234!"},
    {"name": "오지호", "email": "jiho.oh@test.com", "password": "test1234!"},
    {"name": "서은채", "email": "eunchae.seo@test.com", "password": "test1234!"},
    {"name": "권현우", "email": "hyunwoo.kwon@test.com", "password": "test1234!"},
    {"name": "남다은", "email": "daeun.nam@test.com", "password": "test1234!"},
]

OUTPUT_SQL = "test_users.sql"


def encrypt_password(raw_password: str) -> str:
    """BCrypt로 비밀번호 암호화 (Spring Security와 동일한 방식)"""
    # bcrypt.hashpw는 bytes를 요구
    hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
    # bytes를 문자열로 디코딩
    return hashed.decode('utf-8')


def escape_sql_string(text: str) -> str:
    """SQL 문자열 이스케이프 처리"""
    if not text:
        return "''"
    # 작은따옴표를 두 개로 치환 (SQL escape)
    escaped = text.replace("'", "''")
    return f"'{escaped}'"


def generate_user_sql():
    """테스트 유저 INSERT SQL 생성"""
    sql_list = []
    
    for user in TEST_USERS:
        # BCrypt로 비밀번호 암호화
        hashed_password = encrypt_password(user['password'])
        
        name = escape_sql_string(user['name'])
        email = escape_sql_string(user['email'])
        password = escape_sql_string(hashed_password)
        img = escape_sql_string('default_img.png')
        role_code = 1  # ROLE_USER
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        sql = (
            f"INSERT INTO account (email, password, name, img, role_code, created_at, updated_at) "
            f"VALUES ({email}, {password}, {name}, {img}, {role_code}, '{created_at}', '{created_at}');\n"
        )
        sql_list.append(sql)
    
    return sql_list


def main():
    """메인 함수: SQL 파일 생성"""
    print("Generating test user SQL...")
    
    user_sql_list = generate_user_sql()
    
    # SQL 파일 생성
    with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
        f.write("-- ========================================\n")
        f.write("-- Test User Data\n")
        f.write(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("-- Password for all users: test1234!\n")
        f.write("-- ========================================\n\n")
        
        f.writelines(user_sql_list)
    
    print(f"✅ SQL file generated successfully!")
    print(f"📁 File location: {OUTPUT_SQL}")
    print(f"👥 Total users: {len(TEST_USERS)}")
    print(f"\n🔑 All users share the same password: test1234!")
    print(f"\n📧 Sample login:")
    print(f"   Email: {TEST_USERS[0]['email']}")
    print(f"   Password: test1234!")


if __name__ == "__main__":
    main()
