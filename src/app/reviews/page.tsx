"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Star, Quote, ChevronRight, MessageSquare, Award, Users, Target, TrendingUp, Sparkles, Filter, FilterX, BookOpen, Headphones, PenTool, Mic } from "lucide-react";
import { useState, useMemo } from "react";

const reviews = [
  {
    id: 1,
    name: "Ộ I i",
    score: "Band 8.0",
    skill: "Writing",
    comment: "alo vũ à vũ, cảm ơn vũ vì giới thiệu anh tới ielts skibidi.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbwOaIfBgo681SnQ9tXxsYxs7XP6IRLfDmUw&s",
    date: "15/12/2025",
    size: "large",
    accent: "from-indigo-500/20"
  },
  {
    id: 2,
    name: "Faker",
    score: "Band 7.5",
    skill: "Reading",
    comment: "Chiếc cúp thứ 7 là dành cho Ielts Skibidi.",
    image: "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2025/11/20/0b89fcc0-92c9-4458-addd-1f4b13bbf00b-17636300163231290204390.jpg",
    date: "10/12/2025",
    size: "medium",
    accent: "from-rose-500/20"
  },
  {
    id: 3,
    name: "anh ALO",
    score: "Band 7.0",
    skill: "Speaking",
    comment: "Sau khi chinh phục được 7.0 ielts với ielts skibidi, thứ tiếp theo tôi hướng đến sẽ là major!!!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREK5zSrwzVYwXVoazwMynFv4szRnlLA1MAFQ&s",
    date: "05/12/2025",
    size: "small",
    accent: "from-emerald-500/20"
  },
  {
    id: 4,
    name: "Sơn Tùng MTP",
    score: "Band 8.5",
    skill: "Listening",
    comment: "FLOP QUÁ THÌ GHI TÊN ANH VÀO!!!",
    image: "https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj",
    date: "01/12/2025",
    size: "medium",
    accent: "from-violet-500/20"
  },
  {
    id: 5,
    name: "Học viên Ẩn danh",
    score: "Band 7.5",
    skill: "Writing",
    comment: "AI phản hồi cực nhanh và chính xác, giúp mình sửa lỗi sai ngay lập tức.",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
    date: "20/12/2025",
    size: "small",
    accent: "from-blue-500/20"
  },
  {
    id: 6,
    name: "Vinh Râu",
    score: "Band 6.5",
    skill: "Speaking",
    comment: "Tự học ở nhà mà cảm giác như có giáo viên kèm 1-1 vậy, đỉnh thực sự!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7tW8t6O7Y2_J5n9_v8Z7y-U5Z6L-n5p8_Q&s",
    date: "25/12/2025",
    size: "medium",
    accent: "from-amber-500/20"
  },
  {
    id: 7,
    name: "Hieuthuhai",
    score: "Band 8.0",
    skill: "Listening",
    comment: "Nghe Skibidi xong đi thi nghe như nghe nhạc rap, dễ hiểu vô cùng.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Y6M8p8vW9Z8Y_mYp8_z_z_z_z_z_z_z_z_z&s",
    date: "28/12/2025",
    size: "small",
    accent: "from-teal-500/20"
  }
];

const stats = [
  { label: "Học viên", value: "5,000+", icon: Users, color: "text-indigo-400" },
  { label: "Band cao nhất", value: "8.5", icon: Award, color: "text-rose-400" },
  { label: "Mục tiêu đạt được", value: "92%", icon: Target, color: "text-emerald-400" },
  { label: "Bài làm mỗi ngày", value: "1,200+", icon: TrendingUp, color: "text-amber-400" },
];

const categories = [
  { id: 'all', label: 'Tất cả', icon: FilterX },
  { id: 'Reading', label: 'Reading', icon: BookOpen },
  { id: 'Listening', label: 'Listening', icon: Headphones },
  { id: 'Writing', label: 'Writing', icon: PenTool },
  { id: 'Speaking', label: 'Speaking', icon: Mic },
];

function ReviewCard({ review, index }: { review: any; index: number }) {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-1",
    large: "col-span-1 md:col-span-2 row-span-2",
  };

  const skillIcons = {
    Reading: BookOpen,
    Listening: Headphones,
    Writing: PenTool,
    Speaking: Mic,
  };

  const Icon = skillIcons[review.skill as keyof typeof skillIcons];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05,
        layout: { duration: 0.3 }
      }}
      className={`${sizeClasses[review.size as keyof typeof sizeClasses]} group relative overflow-hidden rounded-[2.5rem] glass-premium border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-500`}
    >
      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${review.accent} to-transparent rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      <div className="p-8 h-full flex flex-col justify-between relative z-10">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{review.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                  <Icon className="w-3 h-3 text-indigo-400" />
                  {review.skill} • {review.date}
                </div>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black shadow-lg">
              {review.score}
            </div>
          </div>

          <div className="relative">
            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-white/5 -z-10" />
            <p className={`text-white font-medium leading-relaxed italic ${review.size === 'large' ? 'text-2xl' : 'text-lg'}`}>
              "{review.comment}"
            </p>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-white/5 mt-6">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
            Học viên Skibidi
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState('all');

  const filteredReviews = useMemo(() => {
    if (filter === 'all') return reviews;
    return reviews.filter(r => r.skill === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden pt-32 pb-24">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-20 relative">
        {/* Hero Section */}
        <div className="text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <MessageSquare className="w-4 h-4" />
            Community Wall of Fame
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight"
          >
            NHỮNG <span className="gradient-text">GƯƠNG MẶT</span><br />CHINH PHỤC IELTS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Nơi lưu giữ những cột mốc đáng nhớ của cộng đồng Skibidians trên hành trình vươn tới mục tiêu Band điểm mơ ước.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                filter === cat.id 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-105' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-premium !p-8 text-center space-y-4 border-white/5 bg-slate-900/40"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto ${stat.color} shadow-inner`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-white tabular-nums">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bento Grid with Layout Transitions */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[320px] gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </AnimatePresence>

            {/* Special CTA Card - Always at the end or integrated */}
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="col-span-1 md:col-span-2 row-span-1 glass-premium bg-gradient-to-br from-indigo-600 to-violet-700 p-10 flex flex-col justify-between group cursor-pointer border-none shadow-2xl shadow-indigo-500/20"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tight">CÂU CHUYỆN CỦA BẠN?</h2>
                <p className="text-indigo-100 font-medium leading-relaxed">
                  Hãy bắt đầu hành trình ngay hôm nay để ghi tên mình lên bảng vàng Skibidi.
                </p>
              </div>
              <div className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs">
                Bắt đầu luyện tập <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          </motion.div>
        </LayoutGroup>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="py-20 text-center space-y-12 border-t border-white/5"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            BẠN ĐÃ SẴN SÀNG CHƯA?
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="group px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-500 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-white/5">
              Bắt đầu học ngay
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm border border-white/10 hover:bg-slate-800 transition-all backdrop-blur-xl">
              Tư vấn lộ trình
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
