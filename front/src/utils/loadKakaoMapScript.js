export const loadKakaoMapScript = () => {
    return new Promise((resolve, reject) => {
        // 이미 로드되었으면 바로 resolve
        if (window.kakao && window.kakao.maps) {
            console.log('✅ Kakao SDK 이미 로드됨');
            resolve(window.kakao);
            return;
        }

        // index.html에서 로드되기를 기다림 (최대 5초)
        let attempts = 0;
        const maxAttempts = 50; // 5초 (100ms * 50)

        const checkKakao = setInterval(() => {
            attempts++;

            if (window.kakao && window.kakao.maps) {
                console.log('✅ Kakao SDK 로드 완료');
                clearInterval(checkKakao);
                resolve(window.kakao);
            } else if (attempts >= maxAttempts) {
                console.error('❌ Kakao SDK 로드 타임아웃');
                clearInterval(checkKakao);
                reject(new Error('Kakao SDK 로드 실패: 타임아웃'));
            }
        }, 100);
    });
};
