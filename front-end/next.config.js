/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {nextConfig,
  env: {
    is7rag : 'http://localhost:5000/user/is7erag',
    ME : 'http://localhost:5000/user/me',
    Blocks : 'http://localhost:5000/user/blocks',
    Dashbord : 'http://localhost:3000/Dashbord',
    NotExist : '/NotExist',
    Qrcode : 'http://localhost:3000/QrCode',
    Setting : 'http://localhost:3000/Setting',
    Chat : 'http://localhost:3000/Chat',
    Game : 'http://localhost:3000/Game',
    Members : 'http://localhost:5000/chat/channel/members',
    Membership : 'http://localhost:5000/chat/channel/memberShips',
    Banned : 'http://localhost:5000/chat/channel/banned',
    Conversations : 'http://localhost:5000/chat/conversations',
    Localhost : 'http://localhost:3000',
    ViewProfile : 'http://localhost:5000/user/viewProfile',
    findProfile : 'http://localhost:5000/user/find',
    Profile : 'http://localhost:3000/Profile',
    Memb : 'http://localhost:5000/chat/memberships',
    Leaderboard : 'http://localhost:5000/user/Leaderboard',
    AllMes : 'http://localhost:5000/chat/channel/message/all',
    Auth : 'http://localhost:5000/auth/42',
    Search : 'http://localhost:5000/user/search',
    Friends : 'http://localhost:5000/user/friends',
    Pprofile : 'http://localhost:5000/user/profile',
  },
  images: {
    unoptimized: true,
  },
}

// ${process.env.NotExist}