"use client";

import { motion } from "framer-motion";
import { Star, Quote, Image as ImageIcon, MessageSquare } from "lucide-react";
import Image from "next/image";

// Dữ liệu mẫu cho đánh giá. Sau này bạn có thể thay đổi đường dẫn ảnh trong mảng này.
const reviews = [
  {
    id: 1,
    name: "Ộ I i",
    score: "Band 8.0",
    comment: "alo vũ à vũ, cảm ơn vũ vì giới thiệu anh tới ielts skibidi.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbwOaIfBgo681SnQ9tXxsYxs7XP6IRLfDmUw&s",
    date: "15/12/2025"
  },
  {
    id: 2,
    name: "Faker",
    score: "Band 7.5",
    comment: "Chiếc cúp thứ 7 là dành cho Ielts Skibidi.",
    image: "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2025/11/20/0b89fcc0-92c9-4458-addd-1f4b13bbf00b-17636300163231290204390.jpg",
    date: "10/12/2025"
  },
  {
    id: 3,
    name: "anh ALO",
    score: "Band 7.0",
    comment: "Sau khi chinh phục được 7.0 ielts với ielts skibidi, thứ tiếp theo tôi hướng đến sẽ là major!!!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREK5zSrwzVYwXVoazwMynFv4szRnlLA1MAFQ&s",
    date: "05/12/2025"
  },
  {
    id: 4,
    name: "Sơn Tùng MTP",
    score: "Band 8.5",
    comment: "FLOP QUÁ THÌ GHI TÊN ANH VÀO!!!",
    image: "https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj",
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="glass-card group border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-500 overflow-hidden !p-0 relative">
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Review Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={review.image} 
                    alt={`Đánh giá từ ${review.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Floating Band Tag */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-2xl">
                      {review.score}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs border border-white/10 shadow-2xl">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-black text-sm tracking-tight">{review.name}</div>
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Học viên Skibidi</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 relative">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 w-12 h-12 text-indigo-500/10 -z-10" />
                    <p className="text-slate-300 font-medium leading-relaxed italic text-lg">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{review.date}</span>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 cursor-pointer hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </motion.div>
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
