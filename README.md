# RESTRO Management System

A comprehensive full-stack restaurant management system built with React, featuring Admin, Employee, and Customer modules with real-time capabilities.

## 🚀 Features

### 🧑‍💼 Admin Module (Web)
- **Dashboard**: KPIs, sales analytics, and quick actions
- **Menu Management**: CRUD operations for categories and items
- **Order Management**: View, update, and assign orders
- **Employee Management**: Staff management and role assignment
- **Customer Management**: Customer profiles and order history
- **Inventory Management**: Stock tracking and low inventory alerts
- **Reports & Analytics**: Generate and export business reports
- **Table Management**: Restaurant layout and reservation management
- **Event Management**: Catering and event booking management

### 👨‍🍳 Employee Module (Mobile)
- **Dashboard**: Personal work overview and assigned tasks
- **Order Management**: View and update assigned orders
- **Table Management**: Table status and customer seating
- **Task Management**: View and complete assigned tasks
- **Shift Tracking**: Check-in/out and shift management

### 🍽️ Customer Module (Web/Mobile)
- **Home Page**: Featured dishes, offers, and restaurant information
- **Menu**: Browse categories, search, and filter items
- **Cart & Checkout**: Add items, manage quantities, and place orders
- **Order Tracking**: Real-time order status updates
- **Table Reservation**: Book tables for dining
- **Event Booking**: Book catering for special events
- **Profile Management**: Account settings and order history

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Styling**: TailwindCSS 3.2.7
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM
- **State Management**: Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Date Handling**: date-fns
- **File Upload**: React Dropzone
- **Animations**: Framer Motion

## 🎨 Design System

The application uses a custom color palette:
- **Primary**: #19183B (Dark Navy)
- **Secondary**: #708993 (Blue Gray)
- **Accent**: #A1C2BD (Mint Green)
- **Light**: #E7F2EF (Light Mint)

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Admin/           # Admin-specific components
│   ├── Customer/        # Customer-specific components
│   ├── Employee/        # Employee-specific components
│   ├── Common/          # Shared components
│   └── UI/              # Base UI components
├── pages/               # Page components
│   ├── Admin/           # Admin pages
│   ├── Customer/        # Customer pages
│   ├── Employee/        # Employee pages
│   └── Auth/            # Authentication pages
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── services/            # API service layer
├── styles/              # Global styles
├── utils/               # Utility functions
├── assets/              # Static assets
├── constants/           # Application constants
└── types/               # Type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🔐 Demo Accounts

The application includes demo accounts for testing:

- **Admin**: admin@restaurant.com / admin123
- **Employee**: employee@restaurant.com / employee123
- **Customer**: customer@restaurant.com / customer123

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface for small screens

## 🔄 Real-time Features

- Live order status updates
- Real-time notifications
- Table status changes
- Inventory alerts
- Employee task assignments

## 🎯 Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Protected routes
- Session management

### State Management
- Context API for global state
- Local storage for persistence
- Optimistic updates

### UI/UX
- Modern, clean design
- Intuitive navigation
- Loading states
- Error handling
- Toast notifications

### Performance
- Code splitting
- Lazy loading
- Image optimization
- Efficient re-renders

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure environment variables

### Docker
```bash
# Build Docker image
docker build -t restaurant-management-system .

# Run container
docker run -p 3000:3000 restaurant-management-system
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic authentication system
- ✅ Admin dashboard and management
- ✅ Customer menu and cart
- ✅ Employee interface

### Phase 2 (Upcoming)
- 🔄 Real-time order tracking
- 🔄 Payment integration
- 🔄 Advanced analytics
- 🔄 Mobile app (React Native)

### Phase 3 (Future)
- 📋 Multi-restaurant support
- 📋 Advanced reporting
- 📋 AI-powered recommendations
- 📋 Integration with POS systems

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Lucide for the beautiful icons
- All contributors and testers

---

**Built with ❤️ for RESTRO**