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

// --- Image Block Component ---
const ImageBlock = ({ block, onChange, onRemove, showToast }) => {
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

    return (
        <div className={`relative group/image border border-transparent hover:border-indigo-100 rounded-xl p-4 transition-all ${isResizing ? 'ring-2 ring-indigo-500 bg-gray-50' : ''}`}>
             
             {/* Toolbar (Visible on Hover) */}
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

             {/* Image Container */}
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

             {/* Caption */}
             <div className="mt-2 text-center">
                 <input 
                    type="text" 
                    placeholder="이미지에 대한 설명을 입력하세요..." 
                    className="text-center text-sm text-gray-400 bg-transparent outline-none placeholder:text-gray-300 w-full hover:text-gray-600 focus:text-gray-800 transition-colors"
                    value={block.caption || ''}
                    onChange={(e) => updateBlock({ caption: e.target.value })}
                 />
             </div>
        </div>
    );
};


// --- Sortable Wrapper ---
// --- Sortable Wrapper ---
const SortableBlock = ({ block, index, onChange, onRemove, onFocus, showToast }) => {
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
            onFocus={() => onFocus(index)}
          />
        ) : (
           <ImageBlock block={block} onChange={onChange} onRemove={onRemove} showToast={showToast} />
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

  const addTextBlock = () => {
    setBlocks(prev => [
      ...prev, 
      { id: crypto.randomUUID(), type: 'paragraph', text: '' }
    ]);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check limit
    // Check limit
    const imageCount = blocks.filter(b => b.type === 'image').length;
    if (imageCount + files.length > 20) {
        showToast("이미지는 최대 20장까지 업로드할 수 있습니다.", "error");
        return;
    }

    // Add Loading Blocks
    const newBlocks = files.map(file => ({
        id: crypto.randomUUID(),
        type: 'image',
        url: '',
        alt: 'Uploading...',
        uploading: true,
        file: file // Temp ref for upload
    }));

    setBlocks(prev => [...prev, ...newBlocks]);

    // Process Uploads
    for (const block of newBlocks) {
        try {
            const { processedFile } = await processImage(block.file);
            const res = await uploadImage(processedFile, '');
            
            setBlocks(prev => prev.map(b => {
                if (b.id === block.id) {
                    return {
                        ...b,
                        url: res.data.primaryUrl,
                        alt: block.file.name,
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
            setBlocks(prev => prev.filter(b => b.id !== block.id));
        }
    }
    
    // Allow re-uploading the same file
    e.target.value = '';
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
    <div className="w-full pb-32">
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
                onRemove={removeBlock}
                onFocus={() => {}} 
                showToast={showToast}
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
    </div>
  );
};

export default BlockEditor;
