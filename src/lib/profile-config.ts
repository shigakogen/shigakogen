// Nội dung cá nhân dùng cho trang chủ/about/resume — TOÀN BỘ là placeholder,
// bạn cần tự sửa lại thành thông tin thật trước khi launch (docs/00-SPEC.md:
// "nội dung quan trọng hơn hiệu ứng").
export const profileConfig = {
  hero: {
    heading: `Hi, my name is ---`,
    name: 'Nam Luu',
    roles: 'Senior Backend Developer. Systems Builder. Performance Chaser.',
    tagline:
      'I build distributed systems, hunt down bottlenecks, and turn complex engineering problems into faster, more reliable, and easier-to-operate software.',
    ctaLabel: 'View Resume',
    ctaHref: '/resume',
  },
  about: {
    intro: [
      // TODO: viết lại câu chuyện thật của bạn
      'Đây là đoạn giới thiệu placeholder — kể câu chuyện thật của bạn: bắt đầu code từ khi nào, thích mảng gì, đang làm gì hiện tại.',
      'Đoạn thứ hai — điều gì khiến bạn hứng thú với backend/hệ thống, và bạn muốn viết blog về chủ đề gì.',
    ],
    timeline: [
      // TODO: thay bằng timeline sự nghiệp thật
      { year: '2024', title: 'Chức danh @ Công ty', description: 'Mô tả ngắn công việc.' },
      { year: '2022', title: 'Chức danh @ Công ty trước', description: 'Mô tả ngắn công việc.' },
    ],
  },
  resume: {
    summary: 'Placeholder tóm tắt CV — 2-3 câu về kinh nghiệm và thế mạnh chính.', // TODO
    resumePdfPath: 'resume.pdf', // TODO: upload file thật vào bucket "files" đúng tên này
    skills: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes'], // TODO
    experience: [
      // TODO
      {
        role: 'Chức danh',
        company: 'Công ty',
        period: '2022 — hiện tại',
        bullets: ['Việc đã làm 1.', 'Việc đã làm 2.'],
      },
    ],
    education: [
      // TODO
      { school: 'Trường', degree: 'Ngành học', period: '2018 — 2022' },
    ],
  },
} as const;
