// Cấu hình chung của site — sửa trực tiếp các giá trị placeholder dưới đây
// (chưa có thông tin thật của bạn) trước khi launch.
export const siteConfig = {
  name: 'shigakogen',
  description: 'Portfolio và blog kỹ thuật của một Backend Developer.',
  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
    { label: 'Resume', href: '/resume' },
    { label: 'About', href: '/about' },
  ],
  social: {
    github: 'https://github.com/your-username', // TODO: điền username thật
    linkedin: 'https://linkedin.com/in/your-username', // TODO
    email: 'mailto:you@example.com', // TODO
    rss: '/rss.xml',
  },
} as const;
