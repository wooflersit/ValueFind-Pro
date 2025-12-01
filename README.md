# ValueFind Pro 🚀

**Complete Multi-Tenant SaaS E-Commerce Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue.svg)](https://tailwindcss.com/)

## 📋 Overview

ValueFind Pro is a comprehensive multi-tenant e-commerce platform built with React, TypeScript, Tailwind CSS, and Supabase. It features 6 user roles, complete authentication system with OTP verification, multi-store ordering, franchise management, and advanced KYC implementation.

## ✨ Key Features

### 🔐 **Authentication System**
- User type dropdown login
- 3-step registration with OTP verification
- Real-time email/phone availability checks
- Forgot password functionality
- SMS configuration for 4 Indian providers:
  - MSG91
  - Textlocal
  - Fast2SMS
  - Twilio
- Maps integration:
  - Google Maps
  - Ola Maps

### 👥 **User Roles**

1. **Master Admin**
   - Platform oversight and configuration
   - SMS/Maps settings management
   - Global dashboard access

2. **Network Operator**
   - Network management
   - Multi-store coordination

3. **Store Owner**
   - Business type classifications:
     - Manufacturer
     - Distributor
     - Trader
     - Retailer
   - Unified `/store/*` routing

4. **Delivery Partner**
   - Vehicle type management:
     - Bike
     - Auto
     - Van
   - Delivery tracking

5. **Customer**
   - Standard customer access
   - Multi-store ordering

6. **Premium Customer**
   - Premium tier benefits
   - Enhanced features

### 🏪 **Core Functionality**

- ✅ Multi-store ordering
- ✅ Franchise management
- ✅ Role-based dashboards
- ✅ Comprehensive KYC system
- ✅ Business type classifications
- ✅ Vehicle type management
- ✅ Real-time availability checks
- ✅ 47 total routes

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Backend**: Supabase
  - Database (PostgreSQL)
  - Authentication
  - Storage
  - Edge Functions
- **Maps**: Google Maps / Ola Maps
- **SMS**: MSG91, Textlocal, Fast2SMS, Twilio
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📁 Project Structure

```
ValueFind-Pro/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   └── ...
│   ├── pages/              # Route pages (47 routes)
│   ├── utils/              # Utility functions
│   │   └── supabase/       # Supabase client & helpers
│   └── styles/             # Global styles
├── supabase/
│   └── functions/          # Edge functions
│       └── server/         # Backend API server
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- SMS provider account (optional)
- Maps API key (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/wooflersit/ValueFind-Pro.git

# Navigate to project directory
cd ValueFind-Pro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure Supabase credentials in .env
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_anon_key

# Start development server
npm run dev
```

## ⚙️ Configuration

### Master Admin Dashboard

All platform configurations are managed through the Master Admin dashboard:

1. **SMS Configuration**
   - Configure SMS provider (MSG91/Textlocal/Fast2SMS/Twilio)
   - Set API keys and sender IDs
   - Test SMS delivery

2. **Maps Configuration**
   - Choose maps provider (Google Maps/Ola Maps)
   - Configure API keys
   - Set default location

3. **User Management**
   - Approve KYC documents
   - Manage user roles
   - Monitor platform activity

## 📱 Features by Role

### Master Admin
- Platform-wide settings
- SMS/Maps configuration
- User management
- Analytics dashboard

### Store Owner
- Product management
- Order processing
- Inventory tracking
- Sales analytics

### Delivery Partner
- Order pickup/delivery
- Route optimization
- Earnings tracking

### Customer
- Browse multiple stores
- Place orders
- Track deliveries
- Order history

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ OTP verification for registration
- ✅ Role-based access control (RBAC)
- ✅ KYC document verification
- ✅ Secure API endpoints
- ✅ Environment variable protection

## 📊 Status

- ✅ Authentication system complete
- ✅ SMS configuration ready
- ✅ Maps integration ready
- ✅ Master Admin dashboard functional
- ✅ 115+ files implemented
- ✅ Production-ready

## 🗺️ Roadmap

- [ ] Payment gateway integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Multi-language support

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ValueFind Pro Team**
- GitHub: [@wooflersit](https://github.com/wooflersit)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💬 Support

For support, email support@valuefind.pro or open an issue.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Built with ❤️ for ValueFind Pro**

*Empowering businesses with modern e-commerce solutions*
