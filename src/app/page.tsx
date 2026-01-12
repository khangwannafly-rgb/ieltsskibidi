'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import './landing.css';

export default function LandingPage() {
  useEffect(() => {
    // Animate progress bars on scroll
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const animateProgress = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('[data-progress]');
          progressBars.forEach(bar => {
            const progress = (bar as HTMLElement).getAttribute('data-progress');
            (bar as HTMLElement).style.width = '0%';
            setTimeout(() => {
              (bar as HTMLElement).style.width = progress + '%';
            }, 200);
          });
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(animateProgress, observerOptions);

    // Observe sections
    document.querySelectorAll('.landing-skills-section, .landing-dashboard-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-body">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">🚀 IELTS Skibidi</div>
        <ul className="landing-nav-links">
          <li><a href="#skills">Skills</a></li>
          <li><a href="#practice">Practice</a></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><a href="#resources">Resources</a></li>
        </ul>
        <div className="landing-nav-buttons">
          <Link href="/dashboard" className="landing-btn-ghost">Log In</Link>
          <Link href="/dashboard" className="landing-btn-primary">Start Free 🎉</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">✨ 50,000+ Students Crushing It</div>
          <h1>Master IELTS. <span className="landing-highlight">No Cap.</span> 🎯</h1>
          <p>Học IELTS cực cuốn, Band Score cực Skibidi! No cap! Master English with fun practice tests, AI feedback, and gamified learning. Track progress, earn badges, and flex on your dream score.</p>
          <div className="landing-hero-buttons">
            <Link href="/dashboard" className="landing-btn-primary landing-btn-white">Start Free Practice 🚀</Link>
            <a href="#practice" className="landing-btn-secondary">Take Mock Test</a>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat">
              <div className="landing-stat-number">50K+</div>
              <div className="landing-stat-label">Active Learners</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">7.8</div>
              <div className="landing-stat-label">Avg Band Score</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-number">96%</div>
              <div className="landing-stat-label">Success Rate</div>
            </div>
          </div>
        </div>
        <div className="landing-hero-image">
          <div className="landing-hero-illustration">📚</div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="landing-skills-section" id="skills">
        <div className="landing-section-header">
          <div className="landing-section-badge">🎯 All Four Skills</div>
          <h2>Master Every Section</h2>
          <p>Interactive practice for Listening, Reading, Writing, and Speaking with instant AI-powered feedback that actually slaps. No more boring study sessions!</p>
        </div>
        <div className="landing-skills-grid">
          <div className="landing-skill-card">
            <div className="landing-skill-badge-top">📈 25% Complete</div>
            <div className="landing-skill-icon">👂</div>
            <h3>Listening</h3>
            <p>Train your ears with real exam audios. Practice conversations, monologues, and academic lectures like a pro.</p>
            <div className="landing-skill-progress">
              <div className="landing-skill-progress-fill" style={{ width: '25%' }} data-progress="25"></div>
            </div>
            <Link href="/listening" className="landing-skill-link">Start Practice →</Link>
          </div>
          <div className="landing-skill-card">
            <div className="landing-skill-badge-top">📈 60% Complete</div>
            <div className="landing-skill-icon">📖</div>
            <h3>Reading</h3>
            <p>Master academic texts with timed exercises, vocabulary tips, and smart strategies that work.</p>
            <div className="landing-skill-progress">
              <div className="landing-skill-progress-fill" style={{ width: '60%' }} data-progress="60"></div>
            </div>
            <Link href="/reading" className="landing-skill-link">Start Practice →</Link>
          </div>
          <div className="landing-skill-card">
            <div className="landing-skill-badge-top">📈 40% Complete</div>
            <div className="landing-skill-icon">✍️</div>
            <h3>Writing</h3>
            <p>Get AI feedback on Task 1 & 2. Improve grammar, vocabulary, coherence, and task achievement instantly.</p>
            <div className="landing-skill-progress">
              <div className="landing-skill-progress-fill" style={{ width: '40%' }} data-progress="40"></div>
            </div>
            <Link href="/writing" className="landing-skill-link">Start Practice →</Link>
          </div>
          <div className="landing-skill-card">
            <div className="landing-skill-badge-top">📈 15% Complete</div>
            <div className="landing-skill-icon">🗣️</div>
            <h3>Speaking</h3>
            <p>Record your answers and get pronunciation, fluency, and grammar feedback that's actually helpful.</p>
            <div className="landing-skill-progress">
              <div className="landing-skill-progress-fill" style={{ width: '15%' }} data-progress="15"></div>
            </div>
            <Link href="/speaking" className="landing-skill-link">Start Practice →</Link>
          </div>
        </div>
      </section>

      {/* Practice Test Section */}
      <section className="landing-practice-section" id="practice">
        <div className="landing-practice-content">
          <h2>Full Practice Tests</h2>
          <p>Experience the real deal with authentic IELTS practice tests. Timed, scored, and reviewed instantly. Get that bag! 💰</p>
          <Link href="/dashboard" className="landing-btn-primary landing-btn-white">Start Full Test Now 🎯</Link>
          
          <div className="landing-practice-features">
            <div className="landing-feature-item">
              <div className="landing-feature-icon">⏱️</div>
              <h4>Real Timing</h4>
              <p>Practice under actual exam conditions with precise timing</p>
            </div>
            <div className="landing-feature-item">
              <div className="landing-feature-icon">🤖</div>
              <h4>AI Scoring</h4>
              <p>Get instant band scores with detailed breakdowns</p>
            </div>
            <div className="landing-feature-item">
              <div className="landing-feature-icon">📊</div>
              <h4>Analytics</h4>
              <p>Track your progress with insightful performance metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="landing-dashboard-section" id="dashboard">
        <div className="landing-section-header">
          <div className="landing-section-badge">📊 Your Progress</div>
          <h2>Track Your Glow Up</h2>
          <p>Visualize your improvement with detailed analytics and personalized insights that hit different</p>
        </div>
        <div className="landing-dashboard-grid">
          <div className="landing-dashboard-card">
            <h3>Current Band Score</h3>
            <div className="landing-big-number">7.5</div>
            <div className="landing-subtitle">+0.5 from last week 🎉</div>
            <div className="landing-progress-bar-container">
              <div className="landing-progress-bar-fill-dash" style={{ width: '75%' }} data-progress="75"></div>
            </div>
          </div>
          <div className="landing-dashboard-card landing-streak-card">
            <h3>Study Streak</h3>
            <div className="landing-big-number">14 🔥</div>
            <div className="landing-subtitle">Keep it up! You're on fire!</div>
            <div className="landing-progress-bar-container">
              <div className="landing-progress-bar-fill-dash" style={{ width: '93%' }} data-progress="93"></div>
            </div>
          </div>
          <div className="landing-dashboard-card landing-success-card">
            <h3>Tests Completed</h3>
            <div className="landing-big-number">12</div>
            <div className="landing-subtitle">3 more than last month 💪</div>
            <div className="landing-progress-bar-container">
              <div className="landing-progress-bar-fill-dash" style={{ width: '60%' }} data-progress="60"></div>
            </div>
          </div>
          <div className="landing-dashboard-card landing-warning-card">
            <h3>Weakest Skill</h3>
            <div className="landing-big-number" style={{ fontSize: '40px' }}>Speaking 🗣️</div>
            <div className="landing-subtitle">Cần "rizz" thêm chút nữa!</div>
            <Link href="/speaking" style={{ color: 'white', textDecoration: 'none', fontWeight: 800, marginTop: '20px', display: 'inline-block', fontSize: '15px' }}>Practice Now →</Link>
          </div>
        </div>
      </section>

      {/* Gamification Badges */}
      <section className="landing-gamification-section">
        <div className="landing-section-header">
          <div className="landing-section-badge">🎮 Earn Rewards</div>
          <h2>Collect Epic Badges</h2>
          <p>Turn study time into game time. Earn badges, build streaks, and flex on your friends 💯</p>
        </div>
        <div className="landing-badges-container">
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">🔥</span>
            <div className="landing-badge-label">Fire Streak</div>
            <div className="landing-badge-description">Study 7 days straight</div>
          </div>
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">⭐</span>
            <div className="landing-badge-label">First Victory</div>
            <div className="landing-badge-description">Complete first test</div>
          </div>
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">🏆</span>
            <div className="landing-badge-label">Band 7+ Club</div>
            <div className="landing-badge-description">Score Band 7 or higher</div>
          </div>
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">💯</span>
            <div className="landing-badge-label">Perfect Score</div>
            <div className="landing-badge-description">Ace a practice section</div>
          </div>
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">🎯</span>
            <div className="landing-badge-label">Sharpshooter</div>
            <div className="landing-badge-description">90%+ accuracy rate</div>
          </div>
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">⚡</span>
            <div className="landing-badge-label">Speed Demon</div>
            <div className="landing-badge-description">Finish test early</div>
          </div>
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">🌟</span>
            <div className="landing-badge-label">Rising Star</div>
            <div className="landing-badge-description">Improve 1+ band score</div>
          </div>
          <div className="landing-badge-item">
            <span className="landing-badge-icon-large">👑</span>
            <div className="landing-badge-label">IELTS King</div>
            <div className="landing-badge-description">Band 8.5+ overall</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-testimonials">
        <div className="landing-section-header">
          <div className="landing-section-badge">💬 Success Stories</div>
          <h2>Students Are Winning</h2>
          <p>See how IELTS Skibidi helped thousands achieve their dream scores fr fr</p>
        </div>
        <div className="landing-testimonial-grid">
          <div className="landing-testimonial-card">
            <div className="landing-quote-icon">"</div>
            <div className="landing-testimonial-header">
              <div className="landing-avatar">AK</div>
              <div className="landing-testimonial-info">
                <h4>Anh Khoa Nguyen</h4>
                <div className="landing-band-score">⭐ Band 8.0</div>
              </div>
            </div>
            <p className="landing-testimonial-text">"Yo this app is fire! The gamification kept me locked in every single day. Went from 6.5 to 8.0 in just 2 months. No cap, best decision ever! 🚀"</p>
          </div>
          <div className="landing-testimonial-card">
            <div className="landing-quote-icon">"</div>
            <div className="landing-testimonial-header">
              <div className="landing-avatar">ML</div>
              <div className="landing-testimonial-info">
                <h4>Mai Linh Tran</h4>
                <div className="landing-band-score">⭐ Band 7.5</div>
              </div>
            </div>
            <p className="landing-testimonial-text">"The AI feedback is insane! It's like having a personal tutor 24/7. My writing went from 6.0 to 7.5 in 8 weeks. Worth every penny! 💯"</p>
          </div>
          <div className="landing-testimonial-card">
            <div className="landing-quote-icon">"</div>
            <div className="landing-testimonial-header">
              <div className="landing-avatar">TN</div>
              <div className="landing-testimonial-info">
                <h4>Thanh Nguyen</h4>
                <div className="landing-band-score">⭐ Band 8.5</div>
              </div>
            </div>
            <p className="landing-testimonial-text">"Best investment for IELTS prep! Speaking practice with instant feedback hit different. Dashboard analytics showed exactly where to improve. 10/10! 🎯"</p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="landing-resources-section" id="resources">
        <div className="landing-section-header">
          <div className="landing-section-badge">📚 Free Learning</div>
          <h2>Level Up Your Prep</h2>
          <p>Get access to our exclusive study materials and guides to boost your score without the stress.</p>
        </div>
        <div className="landing-resources-grid">
          <div className="landing-resource-card">
            <div className="landing-resource-icon">📖</div>
            <h4>IELTS Vocabulary Bible</h4>
            <p>1000+ high-level words for Band 7+ success.</p>
            <a href="#" className="landing-resource-link">Download PDF ↓</a>
          </div>
          <div className="landing-resource-card">
            <div className="landing-resource-icon">✍️</div>
            <h4>Writing Task 2 Guide</h4>
            <p>The ultimate structure for perfect essays.</p>
            <a href="#" className="landing-resource-link">Read Guide →</a>
          </div>
          <div className="landing-resource-card">
            <div className="landing-resource-icon">🗣️</div>
            <h4>Speaking Part 3 Secrets</h4>
            <p>How to answer complex questions with confidence.</p>
            <a href="#" className="landing-resource-link">Watch Video →</a>
          </div>
          <div className="landing-resource-card">
            <div className="landing-resource-icon">📝</div>
            <h4>Common Mistakes PDF</h4>
            <p>Avoid the errors that kill your band score.</p>
            <a href="#" className="landing-resource-link">Get Free PDF ↓</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <h3>🚀 IELTS Skibidi</h3>
            <p>Your ride-or-die partner for IELTS success. We help Gen Z students worldwide achieve their dream band scores with fun, engaging, and effective learning tools that actually work.</p>
            <div className="landing-footer-socials">
              <div className="landing-social-icon">📘</div>
              <div className="landing-social-icon">📸</div>
              <div className="landing-social-icon">🐦</div>
              <div className="landing-social-icon">💼</div>
              <div className="landing-social-icon">📺</div>
            </div>
          </div>
          <div className="landing-footer-links">
            <h4>Platform</h4>
            <ul>
              <li><Link href="/listening">Listening Practice</Link></li>
              <li><Link href="/reading">Reading Practice</Link></li>
              <li><Link href="/writing">Writing Practice</Link></li>
              <li><Link href="/speaking">Speaking Practice</Link></li>
              <li><Link href="/dashboard">Full Practice Tests</Link></li>
              <li><Link href="/dashboard">Student Dashboard</Link></li>
            </ul>
          </div>
          <div className="landing-footer-links">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Study Guides</a></li>
              <li><a href="#">Exam Tips & Tricks</a></li>
              <li><a href="#">Blog & Articles</a></li>
              <li><a href="#">Video Tutorials</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>
          <div className="landing-footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Pricing Plans</a></li>
              <li><a href="#">Affiliate Program</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p>&copy; 2026 IELTS Skibidi. Made with 💜 for students worldwide. All rights reserved. | <a href="#">Privacy</a> | <a href="#">Terms</a></p>
        </div>
      </footer>
    </div>
  );
}
