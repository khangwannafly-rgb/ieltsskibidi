"use client";

import { motion } from "framer-motion";
import { Star, Quote, Image as ImageIcon, MessageSquare } from "lucide-react";
import Image from "next/image";

// Dữ liệu mẫu cho đánh giá. Sau này bạn có thể thay đổi đường dẫn ảnh trong mảng này.
const reviews = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    score: "Band 8.0",
    comment: "Nhờ IELTS SKIBIDI mà mình đã đạt được mục tiêu chỉ sau 2 tháng luyện tập. Công cụ AI chấm điểm rất sát thực tế!",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", // Thay bằng link ảnh thật của bạn
    date: "15/12/2025"
  },
  {
    id: 2,
    name: "Trần Thị B",
    score: "Band 7.5",
    comment: "Giao diện đẹp, dễ dùng. Phần Writing được sửa lỗi rất chi tiết, giúp mình nhận ra những lỗi sai ngữ pháp ngớ ngẩn.",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    date: "10/12/2025"
  },
  {
    id: 3,
    name: "Lê Văn C",
    score: "Band 7.0",
    comment: "Phần Speaking giả lập giúp mình bớt run hơn khi đi thi thật. Cảm ơn đội ngũ phát triển!",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    date: "05/12/2025"
  },
  {
    id: 4,
    name: "Hoàng Thị D",
    score: "Band 8.5",
    comment: "Tuyệt vời! Không nghĩ là có một nền tảng hỗ trợ học IELTS tốt như thế này tại Việt Nam.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    date: "01/12/2025"
  }
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] border border-indigo-500/20"
          >
            <Star className="w-4 h-4 fill-indigo-400" />
            Cộng đồng IELTS SKIBIDI
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tight"
          >
            Đánh giá từ <span className="gradient-text">Học viên</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Khám phá những câu chuyện thành công và phản hồi thực tế từ các học viên đã đồng hành cùng IELTS SKIBIDI.
          </motion.p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { label: "Học viên hài lòng", value: "2,000+", icon: MessageSquare, color: "text-indigo-400" },
            { label: "Điểm đánh giá TB", value: "4.9/5", icon: Star, color: "text-amber-400" },
            { label: "Ảnh phản hồi", value: "500+", icon: ImageIcon, color: "text-emerald-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card flex items-center gap-6 p-8 border-white/5 bg-slate-900/40"
            >
              <div className={`w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="glass-card group border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-500 overflow-hidden !p-0">
                {/* Review Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={review.image} 
                    alt={`Đánh giá từ ${review.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                    <div className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xl">
                      {review.score}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -z-10" />
                    <p className="text-slate-300 font-medium leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <div>
                      <div className="text-white font-black text-sm">{review.name}</div>
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{review.date}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-32 text-center glass-premium border-indigo-500/20 bg-indigo-500/5 py-16 px-8"
        >
          <h2 className="text-4xl font-black text-white mb-6">Bạn đã sẵn sàng chinh phục IELTS?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">
            Tham gia cùng hàng ngàn học viên khác và bắt đầu hành trình nâng band ngay hôm nay với sự hỗ trợ từ AI.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="btn-primary">Bắt đầu luyện tập</button>
            <button className="btn-secondary">Tìm hiểu thêm</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
