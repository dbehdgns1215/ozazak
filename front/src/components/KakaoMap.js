import { useEffect, useRef, useState } from 'react';

const KakaoMap = ({ address, companyName }) => {
    const mapContainer = useRef(null);
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const mapInstance = useRef(null);

    // 주소 정제 함수
    const sanitizeAddress = (addr) => {
        if (!addr) return '';

        // 층수, 호수 등 상세 정보 제거
        // 예: "서울 마포구 마포대로 163, 11~14층" → "서울 마포구 마포대로 163"
        let sanitized = addr;

        // 1. 쉼표 이후의 모든 내용 제거 (층수, 호수 정보)
        sanitized = sanitized.split(',')[0].trim();

        // 2. 괄호 안의 내용 제거 (건물명, 동/호수)
        sanitized = sanitized.replace(/\([^)]*\)/g, '').trim();

        // 3. 추가적인 상세 정보 패턴 제거
        sanitized = sanitized.replace(/\d+~\d+층/g, ''); // 11~14층
        sanitized = sanitized.replace(/\d+층/g, ''); // 3층
        sanitized = sanitized.replace(/\d+호/g, ''); // 301호
        sanitized = sanitized.replace(/[A-Z]-?\d+동?/g, ''); // A동, B-101

        // 4. 연속된 공백 제거
        sanitized = sanitized.replace(/\s+/g, ' ').trim();

        console.log('📍 원본 주소:', addr);
        console.log('📍 정제된 주소:', sanitized);

        return sanitized;
    };

    useEffect(() => {
        if (!address) {
            setStatus('error');
            setErrorMessage('주소 정보가 없습니다.');
            return;
        }

        const initMap = () => {
            console.log('🗺️ Kakao Map 초기화 시작');
            console.log('회사명:', companyName);

            // Kakao SDK가 로드되었는지 확인
            if (!window.kakao || !window.kakao.maps) {
                console.error('❌ Kakao SDK not loaded');
                setStatus('error');
                setErrorMessage('지도를 불러올 수 없습니다.');
                return;
            }

            const kakao = window.kakao;
            console.log('✅ Kakao SDK 사용 가능');

            // Geocoder 사용을 위해 kakao.maps.load 호출
            kakao.maps.load(() => {
                console.log('✅ Kakao maps.load 완료');

                if (!mapContainer.current) {
                    console.error('❌ Map container는 null입니다');
                    setStatus('error');
                    setErrorMessage('지도 컨테이너를 찾을 수 없습니다.');
                    return;
                }

                // 주소 정제
                const sanitizedAddress = sanitizeAddress(address);

                // Geocoder 생성
                const geocoder = new kakao.maps.services.Geocoder();

                // 주소로 좌표 검색
                geocoder.addressSearch(sanitizedAddress, (result, status) => {
                    console.log('Geocoder 응답 상태:', status);
                    console.log('Geocoder 결과:', result);

                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        console.log('✅ 좌표 변환 성공:', result[0].y, result[0].x);

                        if (!mapContainer.current) {
                            console.error('❌ Map container disappeared');
                            setStatus('error');
                            setErrorMessage('지도 컨테이너를 찾을 수 없습니다.');
                            return;
                        }

                        // 지도 생성
                        const map = new kakao.maps.Map(mapContainer.current, {
                            center: coords,
                            level: 3,
                        });
                        mapInstance.current = map;
                        console.log('✅ 지도 생성 성공');

                        // 마커 생성
                        const marker = new kakao.maps.Marker({
                            map: map,
                            position: coords,
                        });

                        // 인포윈도우
                        const infowindow = new kakao.maps.InfoWindow({
                            content: `<div style="padding:5px;font-size:12px;color:#000;">${companyName}</div>`,
                        });
                        infowindow.open(map, marker);

                        setStatus('success');
                        console.log('✅ 지도 렌더링 완료');

                    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                        console.error('❌ 주소 검색 결과 없음');
                        setStatus('error');
                        setErrorMessage('검색 결과가 없습니다.');
                    } else if (status === kakao.maps.services.Status.ERROR) {
                        console.error('❌ 주소 검색 중 오류');
                        setStatus('error');
                        setErrorMessage('주소 검색 중 오류가 발생했습니다.');
                    } else {
                        console.error('❌ 알 수 없는 상태:', status);
                        setStatus('error');
                        setErrorMessage('주소를 찾을 수 없습니다.');
                    }
                });
            });
        };

        // 약간의 지연 후 초기화
        const timer = setTimeout(() => {
            initMap();
        }, 300);

        return () => {
            clearTimeout(timer);
            if (mapInstance.current) {
                mapInstance.current = null;
            }
        };
    }, [address, companyName]);

    return (
        <div
            ref={mapContainer}
            className="w-full h-48 rounded-xl border border-slate-700 bg-slate-900 relative"
            style={{ minHeight: '192px', minWidth: '100%' }}
        >
            {/* 로딩 오버레이 */}
            {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90 rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        <span className="text-sm text-slate-400">지도 로딩 중...</span>
                    </div>
                </div>
            )}

            {/* 에러 오버레이 */}
            {status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90 rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-red-400 text-2xl">⚠️</span>
                        <span className="text-sm text-slate-400">{errorMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KakaoMap;
