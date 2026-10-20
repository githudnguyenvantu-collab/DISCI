import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Plus,
  Play,
  Pause,
  Award,
  Users,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Send,
  Flag
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { CommunityPost } from '../../types';
import { CreatePostModal } from './CreatePostModal';

export const CommunityTab: React.FC = () => {
  const {
    posts,
    toggleLikePost,
    addCommentToPost,
    toggleSavePost,
    reportPost,
    challenges,
    toggleJoinChallenge
  } = useAppStore();

  const [activeStream, setActiveStream] = useState<'all' | 'following' | 'challenges'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [reportedMessage, setReportedMessage] = useState<string | null>(null);

  const handleSendComment = (postId: string) => {
    if (!commentText.trim()) return;
    addCommentToPost(postId, commentText);
    setCommentText('');
  };

  const handleReport = (postId: string) => {
    reportPost(postId);
    setReportedMessage('Cảm ơn bạn đã báo cáo. Đội ngũ kiểm duyệt DISCI sẽ rà soát nội dung này theo quy tắc an toàn cộng đồng.');
    setTimeout(() => setReportedMessage(null), 3000);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Header and Create Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#18324B] tracking-tight">Cộng Đồng DISCI</h1>
          <p className="text-xs text-slate-500 font-medium">Chia sẻ video, tạo động lực và cùng kiên trì</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="text-xs bg-[#4A9DFF] hover:bg-[#3b8beb] text-white font-extrabold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng bài</span>
        </button>
      </div>

      {/* Stream Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveStream('all')}
          className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
            activeStream === 'all'
              ? 'border-[#4A9DFF] text-[#4A9DFF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Bảng tin cộng đồng
        </button>
        <button
          onClick={() => setActiveStream('following')}
          className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
            activeStream === 'following'
              ? 'border-[#4A9DFF] text-[#4A9DFF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Đang theo dõi
        </button>
        <button
          onClick={() => setActiveStream('challenges')}
          className={`py-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1 ${
            activeStream === 'challenges'
              ? 'border-[#4A9DFF] text-[#4A9DFF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Thử thách nhóm</span>
        </button>
      </div>

      {reportedMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
          <Flag className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{reportedMessage}</span>
        </div>
      )}

      {/* Challenges Stream */}
      {activeStream === 'challenges' ? (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
            Tham gia thử thách giúp bạn duy trì kỷ luật rèn luyện tại nhà và nhận huy hiệu danh giá!
          </div>

          {challenges.map(ch => (
            <div
              key={ch.id}
              className="bg-white rounded-3xl p-5 border border-[#8ECAFF]/40 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                    Huy hiệu: {ch.badgeName}
                  </span>
                  <h3 className="text-sm font-extrabold text-[#18324B] leading-tight">{ch.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>{ch.participantsCount} người</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{ch.description}</p>

              {ch.joined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Tiến độ của bạn</span>
                    <span>{ch.currentDayProgress}/{ch.durationDays} ngày</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${(ch.currentDayProgress / ch.durationDays) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <button
                  onClick={() => toggleJoinChallenge(ch.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    ch.joined
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-[#4A9DFF] hover:bg-[#3b8beb] text-white shadow-xs'
                  }`}
                >
                  {ch.joined ? '✓ Đang Tham Gia (Rời thử thách)' : 'Tham Gia Thử Thách'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Posts Feed Stream */
        <div className="space-y-4">
          {posts.filter(p => !p.isReported).map(post => (
            <article
              key={post.id}
              className="bg-white rounded-3xl p-4 border border-[#8ECAFF]/40 shadow-xs space-y-3"
            >
              {/* Post Author Bar */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#8ECAFF]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#18324B] leading-tight">{post.authorName}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{post.createdAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleReport(post.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  title="Báo cáo bài viết vi phạm"
                  aria-label="Báo cáo bài viết"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Post Text */}
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 text-[11px] text-[#4A9DFF] font-semibold">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx}>#{tag}</span>
                  ))}
                </div>
              )}

              {/* Workout summary card if attached */}
              {post.workoutSummary && (
                <div className="bg-[#F4F9FF] p-3 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Nhật ký hoàn thành:</span>
                    <strong className="text-[#18324B]">{post.workoutSummary.focusName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#4A9DFF] block">
                      {post.workoutSummary.durationMinutes} phút
                    </span>
                    <span className="text-[10px] text-slate-400">{post.workoutSummary.exercisesDone} bài tập</span>
                  </div>
                </div>
              )}

              {/* Media: Video Player */}
              {post.mediaType === 'video' && post.mediaUrl && (
                <div className="rounded-2xl overflow-hidden bg-black border border-slate-200">
                  <video
                    src={post.mediaUrl}
                    poster={post.videoPosterUrl}
                    controls
                    playsInline
                    className="w-full max-h-72 object-contain"
                  />
                </div>
              )}

              {/* Media: Image */}
              {post.mediaType === 'image' && post.mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full max-h-72 object-cover"
                  />
                </div>
              )}

              {/* Interactions Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-1 font-semibold transition-colors ${
                      post.isLikedByMe ? 'text-red-500' : 'hover:text-slate-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-red-500' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1 font-semibold hover:text-slate-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    onClick={() => alert('Đã sao chép liên kết chia sẻ bài đăng!')}
                    className="flex items-center gap-1 font-semibold hover:text-slate-800 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => toggleSavePost(post.id)}
                  className={`p-1 transition-colors ${post.isSavedByMe ? 'text-[#4A9DFF]' : 'hover:text-slate-800'}`}
                  aria-label="Lưu bài viết"
                >
                  <Bookmark className={`w-4 h-4 ${post.isSavedByMe ? 'fill-[#4A9DFF]' : ''}`} />
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {post.comments.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">Chưa có bình luận. Hãy là người đầu tiên!</p>
                    ) : (
                      post.comments.map(c => (
                        <div key={c.id} className="bg-slate-50 p-2 rounded-xl text-xs space-y-0.5">
                          <span className="font-bold text-[#18324B] text-[11px]">{c.authorName}: </span>
                          <span className="text-slate-700">{c.content}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Viết bình luận động viên..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      className="flex-1 p-2 rounded-xl border border-slate-200 text-xs bg-slate-50"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="p-2 bg-[#4A9DFF] text-white rounded-xl hover:bg-[#3b8beb]"
                      aria-label="Gửi bình luận"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
