import React, { useState } from 'react';
import { X, Video, Image as ImageIcon, Globe, Users, Lock, Film, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { PostVisibility } from '../../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { addPost, profile } = useAppStore();

  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('#LuyenTapTaiNha #TangCo #DISCI');
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('Vui lòng chọn video dưới 50MB để đảm bảo tải mượt mà trên di động.');
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setMediaType('video');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaType('image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaType === 'none') return;

    if (mediaType === 'video' && videoFile) {
      setIsUploading(true);
      // Simulate real chunk upload progress
      for (let p = 20; p <= 100; p += 20) {
        setUploadProgress(p);
        await new Promise(r => setTimeout(r, 120));
      }
    }

    const tags = hashtags
      .split(' ')
      .map(t => t.replace('#', '').trim())
      .filter(Boolean);

    addPost({
      content: content.trim(),
      hashtags: tags,
      visibility,
      mediaType: mediaType === 'none' ? undefined : mediaType,
      mediaUrl: mediaType === 'video' ? (videoPreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4') : mediaUrl || undefined,
      videoDurationSeconds: mediaType === 'video' ? 15 : undefined,
      videoPosterUrl: mediaType === 'video' ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80' : undefined
    });

    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover border border-[#8ECAFF]"
            />
            <div>
              <h3 className="font-extrabold text-[#18324B] text-sm">{profile.name}</h3>
              {/* Visibility dropdown */}
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as PostVisibility)}
                  className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-lg border-none focus:ring-0"
                >
                  <option value="public">🌐 Công khai</option>
                  <option value="friends">👥 Bạn bè</option>
                  <option value="private">🔒 Chỉ mình tôi</option>
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={4}
            required
            placeholder="Bạn muốn chia sẻ cảm nhận buổi tập, kinh nghiệm rèn luyện tại nhà hay video động tác nào hôm nay?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#4A9DFF] leading-relaxed resize-none"
          />

          {/* Video Preview if selected */}
          {mediaType === 'video' && videoPreviewUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black relative">
              <video
                src={videoPreviewUrl}
                controls
                className="w-full max-h-48 object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setVideoFile(null);
                  setVideoPreviewUrl(null);
                  setMediaType('none');
                }}
                className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                aria-label="Xóa video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Preview if selected */}
          {mediaType === 'image' && mediaUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 relative">
              <img src={mediaUrl} alt="Preview" className="w-full max-h-48 object-cover" />
              <button
                type="button"
                onClick={() => {
                  setMediaUrl('');
                  setMediaType('none');
                }}
                className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                aria-label="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hashtags input */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Thẻ bắt đầu bằng # (Hashtags):</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-[#4A9DFF] font-semibold"
            />
          </div>

          {/* Upload progress if active */}
          {isUploading && (
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Đang tải tệp phương tiện...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4A9DFF] h-1.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Media Attach Bar */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">Đính kèm phương tiện:</span>
            <div className="flex items-center gap-2">
              {/* Attach video */}
              <label className="cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-[#4A9DFF] text-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-2xs">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Video thực tế</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </label>

              {/* Attach image */}
              <label className="cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-[#4A9DFF] text-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-2xs">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Hình ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 bg-[#4A9DFF] hover:bg-[#3b8beb] active:scale-98 disabled:opacity-50 text-white font-extrabold rounded-2xl text-xs transition-colors shadow-md"
            >
              {isUploading ? 'Đang Đăng Bài...' : 'Đăng Lên Bảng Tin DISCI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
