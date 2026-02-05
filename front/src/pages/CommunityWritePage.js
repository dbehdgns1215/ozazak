import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import BlockEditor from '../components/editor/BlockEditor';
import Toast from '../components/ui/Toast'; // Import Toast
import CustomAlert from '../components/CustomAlert';
import { blocksToMarkdown, markdownToBlocks } from '../components/editor/serialize';
import { createCommunityPost, getTilDetail, updateTIL, createTIL } from '../api/community';
import { ArrowLeft, Save } from 'lucide-react';

const CommunityWritePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isTilMode = location.pathname.includes('/til/write') || new URLSearchParams(location.search).get('type') === 'til';

    // Default to 1 (TIL) if in TIL mode, otherwise 2 (Free Board)
    const [communityCode, setCommunityCode] = useState(isTilMode ? 1 : 2);
    const [title, setTitle] = useState('');

    // Tag State
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ visible: true, message, type });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    const [blocks, setBlocks] = useState([
        { id: crypto.randomUUID(), type: 'paragraph', text: '' }
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { tilId } = useParams();
    const isEditMode = !!tilId;

    // Fetch Data for Edit
    useEffect(() => {
        if (isEditMode) {
            const fetchData = async () => {
                try {
                    const response = await getTilDetail(tilId);
                    const data = response?.data || response;

                    if (data) {
                        setTitle(data.title);
                        setCommunityCode(data.communityCode || (isTilMode ? 1 : 2));

                        // Set Content
                        if (data.content) {
                            const parsedBlocks = markdownToBlocks(data.content);
                            setBlocks(parsedBlocks);
                        }

                        // Set Tags
                        if (data.tags && Array.isArray(data.tags)) {
                            setTags(data.tags);
                        }
                    }
                } catch (error) {
                    console.error("Failed to load post for editing", error);
                    showToast("게시글 정보를 불러오는데 실패했습니다.", "error");
                    // Optionally navigate back
                    // navigate(-1);
                }
            };
            fetchData();
        }
    }, [tilId, isEditMode, isTilMode]);

    // Real-time Content Length Warning
    const [prevLength, setPrevLength] = useState(0);
    const markdown = blocksToMarkdown(blocks);

    useEffect(() => {
        const currentLength = markdown.length;
        if (prevLength <= 10000 && currentLength > 10000) {
            showToast("본문은 최대 10,000자까지 입력 가능합니다.", "error");
        }
        setPrevLength(currentLength);
    }, [markdown]);

    const handleCommunityChange = (e) => {
        setCommunityCode(Number(e.target.value));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag) {
                if (tags.includes(newTag)) {
                    showToast("이미 등록된 태그입니다.", "error"); // Use Toast
                    setTagInput('');
                    return;
                }
                if (newTag.length > 50) {
                    showToast("태그는 최대 50자까지 입력 가능합니다.", "error");
                    return;
                }
                setTags([...tags, newTag]);
                setTagInput('');
            }
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1)); // Remove last tag if backspace on empty input
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        // Validate title
        if (!title.trim()) {
            showToast("제목을 입력해주세요.", "error");
            return;
        }

        if (title.trim().length < 5) {
            showToast("제목은 최소 5자 이상이어야 합니다.", "error");
            return;
        }

        if (title.length > 100) {
            showToast("제목은 최대 100자까지 입력 가능합니다.", "error");
            return;
        }

        // Validate content
        const serializedContent = blocksToMarkdown(blocks);
        if (!serializedContent.trim()) {
            showToast("본문을 작성해주세요.", "error");
            return;
        }

        if (serializedContent.length > 10000) {
            showToast("본문은 최대 10,000자까지 입력 가능합니다.", "error");
            return;
        }



        // Validate tags policy: tags only allowed for TIL (communityCode === 1)
        if (communityCode !== 1 && tags.length > 0) {
            showToast("태그는 TIL 게시판에서만 사용할 수 있습니다.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                communityCode: communityCode,
                title: title.trim(),
                content: serializedContent,
                tags: communityCode === 1 ? tags : []
            };

            if (isEditMode) {
                await updateTIL(tilId, payload);
                showAlert("수정 완료", "게시글이 성공적으로 수정되었습니다.", "success", () => {
                    navigate(isTilMode ? '/til' : '/community', { replace: true });
                });
            } else {
                console.log(`[CommunityWritePage] Creating Post (Code: ${communityCode})`, payload);
                await createCommunityPost(payload);
                showAlert("작성 완료", "게시글이 성공적으로 등록되었습니다!", "success", () => {
                    navigate(isTilMode ? '/til' : '/community', { replace: true });
                });
            }

        } catch (error) {
            console.error("Failed to save post", error);

            // Handle specific error responses
            if (error.response?.status === 401) {
                showToast("로그인이 필요합니다.", "error");
            } else if (error.response?.status === 403) {
                showToast(`권한이 없습니다. ${error.response?.data?.message || ''}`, "error");
            } else if (error.response?.status === 400) {
                showToast(error.response?.data?.message || "입력 정보를 확인해주세요.", "error");
            } else {
                showToast("게시글 저장에 실패했습니다. 다시 시도해주세요.", "error");
            }
            setIsSubmitting(false);
        }
    };

    // Live Preview Generation (moved up for Effect)
    // const markdown = blocksToMarkdown(blocks); // Moved up

    // Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null
    });

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertState({ isOpen: true, title, message, type, onConfirm });
    };

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden relative">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={closeToast}
            />

            <CustomAlert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={alertState.onConfirm}
            />

            {/* Top Bar */}
            <header className="h-16 flex items-center justify-between px-6 bg-white shrink-0 z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors py-2"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">나가기</span>
                </button>
                <div className="flex items-center gap-4">
                    {isTilMode ? (
                        <div className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            TIL 작성
                        </div>
                    ) : (
                        <select
                            className="px-3 py-2 rounded-md text-sm outline-none bg-slate-50 hover:bg-slate-100 text-slate-900 font-medium transition-colors cursor-pointer"
                            value={communityCode}
                            onChange={handleCommunityChange}
                        >
                            {/* <option value={1}>TIL</option> - Removed from Community Write */}
                            <option value={2}>자유게시판</option>
                            <option value={2}>취업후기</option>
                            <option value={3}>자소서 첨삭</option>
                            <option value={4}>스터디 모집</option>
                            <option value={5}>질문 & 답변</option>
                        </select>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-md transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100 font-bold"
                    >
                        {isSubmitting ? '등록 중...' : '출간하기'}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Editor (Blocks) */}
                <div className="w-1/2 flex flex-col h-full bg-white relative">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 pb-32">
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            className="text-4xl font-bold w-full bg-transparent outline-none placeholder-gray-300 mb-2 text-slate-900"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                        />
                        <p className={`text-sm mb-6 ${title.length < 5 ? 'text-red-400' : title.length > 90 ? 'text-orange-400' : 'text-slate-400'}`}>
                            {title.length}/100자 {title.length < 5 && '(최소 5자 필요)'}
                        </p>

                        <div className="w-16 h-1.5 bg-slate-900 mb-8 rounded-full"></div>

                        {communityCode === 1 && (
                            <div className="mb-8 flex flex-wrap items-center gap-2">
                                {tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-indigo-900 transition-colors">
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder={tags.length === 0 ? "태그를 입력하세요 (스페이스바로 등록)" : ""}
                                    className="min-w-[120px] flex-1 text-base bg-white focus:bg-slate-50 outline-none py-2 px-2 rounded-lg transition-colors font-mono text-slate-700 placeholder-gray-400"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                />
                            </div>
                        )}

                        <BlockEditor blocks={blocks} setBlocks={setBlocks} showToast={showToast} />
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="w-1/2 h-full overflow-y-auto bg-slate-50 p-12 text-slate-900 border-l border-slate-100">
                    <h1 className="text-4xl font-bold mb-8 break-words text-slate-900 border-b border-slate-200 pb-4">
                        {title || <span className="text-gray-300">제목 없음</span>}
                    </h1>
                    <MarkdownPreview markdown={markdown} />
                </div>
            </div>
        </div>
    );
};

export default CommunityWritePage;
