import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import BlockEditor from '../components/editor/BlockEditor';
import Toast from '../components/ui/Toast'; // Import Toast
import { blocksToMarkdown } from '../components/editor/serialize';
import { createCommunityPost } from '../api/community';
import { ArrowLeft, Save } from 'lucide-react';

const CommunityWritePage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [communityCode, setCommunityCode] = useState(2); 
    
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
    
    // Block State (Replaces simple markdown string)
    const [blocks, setBlocks] = useState([
        { id: crypto.randomUUID(), type: 'paragraph', text: '' }
    ]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!title.trim()) {
            showToast("제목을 입력해주세요.", "error");
            return;
        }

        const serializedContent = blocksToMarkdown(blocks);
        if (!serializedContent.trim()) {
            showToast("본문을 작성해주세요.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                communityCode: communityCode,
                title: title,
                content: serializedContent,
                tags: communityCode === 1 ? tags : []
            };

            await createCommunityPost(payload);
            
            showToast("게시글이 성공적으로 등록되었습니다!", "success");
            
            // Navigate after short delay to show toast
            setTimeout(() => {
                 navigate('/community');
            }, 1000);
            
        } catch (error) {
            console.error("Failed to create post", error);
            showToast("게시글 등록에 실패했습니다. 다시 시도해주세요.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Live Preview Generation
    const markdown = blocksToMarkdown(blocks);

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden relative">
            <Toast 
                message={toast.message} 
                type={toast.type} 
                isVisible={toast.visible} 
                onClose={closeToast} 
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
                     <select 
                        className="px-3 py-2 rounded-md text-sm outline-none bg-slate-50 hover:bg-slate-100 text-slate-900 font-medium transition-colors cursor-pointer"
                        value={communityCode}
                        onChange={handleCommunityChange}
                    >
                        <option value={1}>TIL</option>
                        <option value={2}>자유게시판</option>
                        <option value={3}>취업후기</option>
                        <option value={4}>자소서 첨삭</option>
                        <option value={5}>스터디 모집</option>
                        <option value={6}>질문 & 답변</option>
                    </select>
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
                            className="text-4xl font-bold w-full bg-transparent outline-none placeholder-gray-300 mb-6 text-slate-900"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                         />
                         
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
