import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    GripVertical, Trash2, Image as ImageIcon, Plus, 
    AlignLeft, AlignCenter, AlignRight, RefreshCw, Type, Maximize2,
    Lock, Unlock
} from 'lucide-react';
import { uploadImage } from '../../api/image';
import { processImage } from '../../utils/imageProcess';
import { SafeImageProcessor } from '../../utils/SafeImageProcessor';
import CustomAlert from '../CustomAlert'; // Import CustomAlert

// --- Image Block Component ---
const ImageBlock = ({ block, onChange, onRemove, showToast, onAddTextBlock }) => {
    const [isResizing, setIsResizing] = useState(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const startDimsRef = useRef({ w: 0, h: 0 });
    const resizeDirRef = useRef(null); // 'e', 's', 'se'

    const updateBlock = (updates) => {
        onChange(block.id, updates);
    };

    const handleResizeStart = (e, dir) => {
        e.preventDefault();
        e.stopPropagation();
        
        const handle = e.currentTarget;
        const container = handle.closest('.group\\/handles') || handle.parentElement.parentElement;
        const img = container?.querySelector('img');

        if (!img) {
            console.error("Resize failed: Image element not found");
            return;
        }

        setIsResizing(true);
        resizeDirRef.current = dir;
        startPosRef.current = { x: e.clientX, y: e.clientY };
        // Capture CURRENT ratio from the actual DOM element at start of drag
        const currentRatio = img.offsetHeight / img.offsetWidth;
        startDimsRef.current = { w: img.offsetWidth, h: img.offsetHeight, ratio: currentRatio };
        
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleResizeMove = (e) => {
        if (!startPosRef.current) return;
        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;
        
        const dir = resizeDirRef.current || 'se';
        let newWidth = startDimsRef.current.w;
        let newHeight = startDimsRef.current.h;

        // Apply Delta based on Direction
        if (dir === 'e' || dir === 'se') {
            newWidth += dx;
        }
        if (dir === 's' || dir === 'se') {
            newHeight += dy;
        }

        if (newWidth < 50) newWidth = 50;
        if (newHeight < 50) newHeight = 50;

        // Ratio Logic (Only applies to Corner resize 'se' AND if locked)
        const keepRatio = block.style?.keepRatio !== false; 

        if (dir === 'se' && keepRatio) {
             // Use the ratio captured at the START of the drag
             // This ensures we scale whatever shape the user currently has, 
             // rather than snapping back to the original image ratio.
             const ratio = startDimsRef.current.ratio;
             newHeight = Math.round(newWidth * ratio);
        } 

        updateBlock({
            style: { ...block.style, width: newWidth, height: newHeight }
        });
    };

    const handleResizeEnd = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
    };

    const handleReplace = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { processedFile } = await processImage(file);
            const res = await uploadImage(processedFile, block.caption || '');
            updateBlock({
                url: res.data.primaryUrl,
                meta: {
                    width: res.data.meta.width,
                    height: res.data.meta.height,
                    mimeType: res.data.meta.mimeType
                }
            });
        } catch (err) {
            showToast("이미지 교체에 실패했습니다.", "error");
        }
        
        // Allow re-selecting the same file
        e.target.value = '';
    };

    const toggleRatio = (e) => {
        e.stopPropagation(); // Prevent drag
        updateBlock({ style: { ...block.style, keepRatio: block.style?.keepRatio === false ? true : false } });
    };

    const alignClass = {
        'left': 'justify-start',
        'center': 'justify-center',
        'right': 'justify-end'
    }[block.style?.align || 'center'];

    // Helper for toolbar buttons to stop propagation
    const preventDrag = (e) => e.stopPropagation();

    const handleCaptionKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            onAddTextBlock(block.id); // Pass current ID to insert AFTER
        }
    };

    return (
        <div className={`relative group/image border border-transparent hover:border-indigo-100 rounded-xl p-4 transition-all ${isResizing ? 'ring-2 ring-indigo-500 bg-gray-50' : ''}`}>
             
             {/* Loading State */}
             {block.uploading && (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg border border-slate-100 animate-pulse w-full">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                    <span className="text-sm text-slate-500 font-medium">이미지 업로드 중...</span>
                </div>
             )}

             {/* Toolbar (Visible on Hover) - Hide when uploading */}
             {!block.uploading && (
             <div 
                className="absolute top-2 right-2 flex items-center gap-1 bg-white shadow-lg rounded-lg p-1 opacity-0 group-hover/image:opacity-100 transition-opacity z-10 border border-gray-100"
                onMouseDown={preventDrag} 
                onPointerDown={preventDrag} // Stop dnd-kit
             >
                <button 
                    onClick={() => updateBlock({ style: { ...block.style, align: 'left' } })}
                    className={`p-1.5 rounded hover:bg-gray-100 ${block.style?.align === 'left' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
                    title="왼쪽 정렬"
                >
                    <AlignLeft size={16} />
                </button>
                <button 
                    onClick={() => updateBlock({ style: { ...block.style, align: 'center' } })}
                    className={`p-1.5 rounded hover:bg-gray-100 ${(!block.style?.align || block.style?.align === 'center') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
                    title="가운데 정렬"
                >
                    <AlignCenter size={16} />
                </button>
                <button 
                    onClick={() => updateBlock({ style: { ...block.style, align: 'right' } })}
                    className={`p-1.5 rounded hover:bg-gray-100 ${block.style?.align === 'right' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
                    title="오른쪽 정렬"
                >
                    <AlignRight size={16} />
                </button>
                
                <div className="w-px h-4 bg-gray-200 mx-1"></div>

                <button 
                    onClick={toggleRatio}
                    className={`p-1.5 rounded hover:bg-gray-100 ${block.style?.keepRatio !== false ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400'}`}
                    title={block.style?.keepRatio !== false ? "비율 잠금 해제 (자유 변형)" : "비율 잠금 (정비율)"}
                >
                    {block.style?.keepRatio !== false ? <Lock size={16} /> : <Unlock size={16} />}
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                
                <label className="p-1.5 rounded hover:bg-gray-100 text-gray-500 cursor-pointer" title="이미지 교체">
                    <RefreshCw size={16} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleReplace} />
                </label>
                <button 
                    onClick={() => onRemove(block.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-500"
                    title="삭제"
                >
                    <Trash2 size={16} />
                </button>
             </div>
             )}

             {/* Image Container */}
             {!block.uploading && (
             <div className={`flex ${alignClass}`}>
                <div 
                    className="relative inline-block group/handles" 
                    style={{ 
                        width: block.style?.width || '100%', 
                        height: block.style?.height || 'auto',
                        maxWidth: '100%' 
                    }}
                >
                    <img 
                        src={block.url} 
                        alt={block.alt} 
                        className="rounded-lg shadow-sm w-full h-full object-fill block" 
                        draggable={false}
                    />
                    
                    {/* Handles - Visible on Hover */}
                    <div className="opacity-0 group-hover/image:opacity-100 transition-opacity">
                        {/* Right Handle (Width) */}
                        <div 
                            onMouseDown={(e) => handleResizeStart(e, 'e')}
                            className="absolute right-[-6px] top-1/2 -translate-y-1/2 h-12 w-3 bg-white border border-gray-200 shadow-md rounded-full cursor-e-resize flex items-center justify-center hover:bg-gray-50 z-20"
                            title="Resize Width"
                        >
                            <div className="w-0.5 h-4 bg-gray-300"></div>
                        </div>

                        {/* Bottom Handle (Height) */}
                        <div 
                            onMouseDown={(e) => handleResizeStart(e, 's')}
                            className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-12 h-3 bg-white border border-gray-200 shadow-md rounded-full cursor-s-resize flex items-center justify-center hover:bg-gray-50 z-20"
                            title="Resize Height"
                        >
                            <div className="h-0.5 w-4 bg-gray-300"></div>
                        </div>

                        {/* Corner Handle (Both) */}
                        <div 
                            onMouseDown={(e) => handleResizeStart(e, 'se')}
                            className="absolute bottom-[-6px] right-[-6px] w-6 h-6 bg-white shadow-md border border-gray-200 rounded-full cursor-se-resize flex items-center justify-center hover:scale-110 z-30"
                            title="크기 조절"
                        >
                            <Maximize2 size={12} className="text-gray-500 transform rotate-90" />
                        </div>
                    </div>
                </div>
             </div>
             )}

             {/* Caption */}
             {!block.uploading && (
             <div className="mt-2 text-center">
                 <input 
                    type="text" 
                    placeholder="이미지에 대한 설명을 입력하세요..." 
                    className="text-center text-sm text-gray-400 bg-transparent outline-none placeholder:text-gray-300 w-full hover:text-gray-600 focus:text-gray-800 transition-colors"
                    value={block.caption || ''}
                    onChange={(e) => updateBlock({ caption: e.target.value })}
                    onKeyDown={handleCaptionKeyDown}
                 />
             </div>
             )}
        </div>
    );
};


// --- Sortable Wrapper ---
const SortableBlock = ({ block, index, onChange, onRemove, onFocus, showToast, onAddTextBlock }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTextChange = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChange(block.id, { text: e.target.value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-2 p-1 mb-2 transition-colors ${isDragging ? 'shadow-lg bg-white/50 rounded-lg' : ''}`}
    >
      {/* Drag Handle - Only show on hover of block */}
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-3 cursor-grab text-gray-300 hover:text-gray-600 active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1"
      >
        <GripVertical size={16} />
      </div>

      <div className="flex-1 min-w-0">
        {block.type === 'paragraph' ? (
          <textarea
            className="w-full resize-none outline-none text-lg text-slate-700 placeholder-gray-300 bg-transparent overflow-hidden px-2 py-2 leading-relaxed"
            rows={1}
            placeholder="당신의 이야기를 적어보세요..."
            value={block.text}
            onChange={handleTextChange}
            onFocus={() => onFocus(block.id)} // Pass ID instead of index
          />
        ) : (
           <ImageBlock block={block} onChange={onChange} onRemove={onRemove} showToast={showToast} onAddTextBlock={onAddTextBlock} />
        )}
      </div>

      {block.type === 'paragraph' && (
        <button 
            onClick={() => onRemove(block.id)}
            className="mt-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
        >
            <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

const BlockEditor = ({ blocks, setBlocks, showToast }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({ isOpen: false });
  const [pendingUpload, setPendingUpload] = useState(null); // { file, stats }

  const [focusedBlockId, setFocusedBlockId] = useState(null); // Track focused text block

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addTextBlock = (afterId = null) => {
    setBlocks(prev => {
        const newBlock = { id: crypto.randomUUID(), type: 'paragraph', text: '' };
        
        if (afterId) {
            const index = prev.findIndex(b => b.id === afterId);
            if (index !== -1) {
                const newBlocks = [...prev];
                newBlocks.splice(index + 1, 0, newBlock);
                return newBlocks;
            }
        }
        return [...prev, newBlock];
    });
  };

  const handleContainerClick = (e) => {
      // Only trigger if clicking directly on the container (empty space)
      if (e.target === e.currentTarget) {
          // Check if last block is empty paragraph to avoid duplicates
          const lastBlock = blocks[blocks.length - 1];
          if (lastBlock && lastBlock.type === 'paragraph' && !lastBlock.text.trim()) {
              return; 
          }
          addTextBlock();
      }
  };

  // --- File Upload Logic (Safe) ---
  
  const processAndUploadSingleFile = async (file) => {
      console.group(`🖼️ [BlockEditor] Processing: ${file.name}`);
      console.log('Raw File:', file);

      // 1. Analyze
      let stats;
      try {
          stats = await SafeImageProcessor.detectImageStats(file);
          console.log('📊 Detected Stats:', stats);
      } catch (eStats) {
          console.warn('Stats detection warning:', eStats);
          stats = { tier: 'NORMAL', size: file.size, width: 0, height: 0, mp: 0 };
      }

      // 2. Gate Check
      if (stats.tier === 'REJECT') {
          console.warn('⛔ REJECTED');
          console.groupEnd();
          showToast(`이미지가 너무 큽니다. (~${Math.round(stats.size/1024/1024)}MB)`, "error");
          return;
      }

      // Check for WARNING or EXTREME for Confirmation
      if (stats.tier === 'EXTREME' || stats.tier === 'WARNING') {
          const isExtreme = stats.tier === 'EXTREME';
          setPendingUpload({ file, stats });
          setAlertConfig({
              isOpen: true,
              title: isExtreme ? '초고해상도 이미지 발견' : '고해상도 이미지 발견',
              message: `선택하신 이미지는 용량이 큽니다. (${Math.round(stats.size/1024/1024)}MB)\n자동으로 최적화하여 업로드하시겠습니까?` + 
                       (isExtreme ? '\n(시간이 다소 소요될 수 있습니다.)' : ''),
              type: 'warning',
              confirmText: '최적화 업로드',
              cancelText: '취소',
          });
          return;
      }

      // Normal: Proceed
      await executeSafeUpload(file, stats);
  };

  const executeSafeUpload = async (file, stats) => {
      // Placeholder Block creation
      const tempId = crypto.randomUUID();
      const newBlock = {
          id: tempId,
          type: 'image',
          url: '',
          alt: 'Processing...',
          uploading: true,
          file: null // Don't keep raw file ref in block state to save memory
      };

      // Insert AFTER the focused block, or at end if none
      setBlocks(prev => {
        const insertIndex = focusedBlockId ? prev.findIndex(b => b.id === focusedBlockId) : prev.length - 1;
        const newBlocks = [...prev];
        // If list is empty or invalid index, just append
        if (insertIndex === -1) {
            return [...prev, newBlock];
        }
        // Insert after focused
        newBlocks.splice(insertIndex + 1, 0, newBlock);
        return newBlocks;
      });

      try {
          // 3. Safe Resize Worker
          const processedBlob = await SafeImageProcessor.processImage(file, stats, (step, percent) => {
              // Optional: Update block Loading UI with percent
              // console.log(`Processing: ${step} ${percent}%`);
          });

          // 4. Upload to Server
          // blob -> file object
          const processedFile = new File([processedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp"
          });

          const res = await uploadImage(processedFile, '');
          
          console.log('🎉 Upload Complete:', res);
          console.groupEnd();

          setBlocks(prev => prev.map(b => {
              if (b.id === tempId) {
                  return {
                      ...b,
                      url: res.data.primaryUrl,
                      alt: file.name,
                      uploading: false,
                      meta: res.data.meta,
                      style: { width: null, height: null, align: 'center', keepRatio: true },
                      caption: ''
                  };
              }
              return b;
          }));

      } catch (err) {
          console.error(err);
          setBlocks(prev => prev.filter(b => b.id !== tempId));
          showToast(err.message || "이미지 업로드 실패", "error");
      }
  };

  const handleAlertClose = () => {
      setAlertConfig({ isOpen: false });
      setPendingUpload(null);
  };

  const handleAlertConfirm = () => {
      if (pendingUpload) {
          executeSafeUpload(pendingUpload.file, pendingUpload.stats);
      }
      handleAlertClose();
  };

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    // Filter validation logic (Basic type checks)
    const validFiles = files.filter(f => {
        if (!f.type.startsWith('image/')) {
            showToast("이미지 파일만 업로드 가능합니다.", "error");
            return false;
        }
        if (f.size < 14) {
            showToast("너무 작은 이미지(14바이트 미만)는 업로드할 수 없습니다.", "error");
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    // Check count limit
    const imageCount = blocks.filter(b => b.type === 'image').length;
    if (imageCount + validFiles.length > 20) {
        showToast("이미지는 최대 20장까지 업로드할 수 있습니다.", "error");
        return;
    }

    // Process Sequentially for Safety (Reduce Memory Pressure)
    // We process one by one, especially important for large files.
    for (const file of validFiles) {
        await processAndUploadSingleFile(file);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    uploadFiles(files);
    e.target.value = ''; // Reset input
  };

  // --- Paste Handler ---
  const handlePaste = (e) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
        e.preventDefault();
        const files = Array.from(e.clipboardData.files);
        uploadFiles(files);
    }
  };

  // --- Drag & Drop Handler ---
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        uploadFiles(files);
    }
  };

  const updateBlock = (id, updates) => {
    setBlocks(prev => prev.map(block => 
        block.id === id ? { ...block, ...updates } : block
    ));
  };

  const removeBlock = (id) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  return (
    <div 
        className="w-full pb-32 min-h-[300px] cursor-text relative"
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleContainerClick}
    >
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(b => b.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <SortableBlock 
                key={block.id} 
                block={block} 
                index={index}
                onChange={updateBlock}
                onRemove={removeBlock}
                onFocus={(id) => setFocusedBlockId(id)} 
                showToast={showToast}
                onAddTextBlock={addTextBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Floating Action Bar */}
      <div className="mt-8 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
         <div className="flex gap-2 p-2 bg-white border shadow-sm rounded-full">
            <button onClick={addTextBlock} className="p-2 hover:bg-gray-100 rounded-full text-gray-500" title="텍스트 추가">
                <Type size={20} />
            </button>
            <div className="w-px h-6 bg-gray-200 my-auto"></div>
            <label className="p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer" title="이미지 추가">
                <ImageIcon size={20} />
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
         </div>
      </div>

      {/* Custom Alert for Image Confirmation */}
      <CustomAlert 
          isOpen={alertConfig.isOpen} 
          onClose={handleAlertClose} 
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          confirmText={alertConfig.confirmText}
          cancelText={alertConfig.cancelText}
          onConfirm={handleAlertConfirm}
      />
    </div>
  );
};

export default BlockEditor;
