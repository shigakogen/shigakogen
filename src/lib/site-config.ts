// Cấu hình chung của site — sửa trực tiếp các giá trị placeholder dưới đây
// (chưa có thông tin thật của bạn) trước khi launch.
export const siteConfig = {
  name: 'shigakogen',
  description: 'Portfolio và blog kỹ thuật của một Backend Developer.',
  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'Resume', href: '/resume' },
    { label: 'About', href: '/about' },
  ],
  social: {
    github: 'https://github.com/shigakogen',
    linkedin: 'https://linkedin.com/in/your-username', // TODO
    facebook: 'https://facebook.com/kichirou58',
    instagram: 'https://instagram.com/shigakogenn',
    email: 'mailto:nam.luuhoai.dev@gmail.com',
    rss: '/rss.xml',
  },
} as const;
