# 🏜️ Desert Gear Boutique

## 📘 Project Overview

**Desert Gear Boutique** is a modern e-commerce platform tailored for outdoor enthusiasts. Built with cutting-edge technologies, it offers a seamless shopping experience with a focus on performance and scalability.

## 🚀 Features

- **Responsive Design**: Ensures optimal viewing across devices.
- **Component-Based Architecture**: Facilitates easy customization and scalability.
- **Dark/Light Mode Toggle**: Enhances user experience by adapting to user preferences.
- **Fast Performance**: Leveraging Vite for rapid development and optimized builds.

## 🧱 Project Structure

```
desert-gear-boutique/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── styles/             # Tailwind CSS configurations
│   └── utils/              # Utility functions
├── supabase/               # Supabase configuration and integration
├── index.html              # Main HTML file
├── package.json            # Project metadata and dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## ⚙️ Tech Stack

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

## 🛠 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Bun](https://bun.sh/) (if using Bun as the package manager)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/pro-boost/desert-gear-boutique.git
   cd desert-gear-boutique
   ```

2. **Install Dependencies**

   Using Bun:

   ```bash
   bun install
   ```

   Or using npm:

   ```bash
   npm install
   ```

3. **Start the Development Server**

   Using Bun:

   ```bash
   bun run dev
   ```

   Or using npm:

   ```bash
   npm run dev
   ```

4. **Build for Production**

   Using Bun:

   ```bash
   bun run build
   ```

   Or using npm:

   ```bash
   npm run build
   ```

## 🌐 Deployment

After building the project, the static files will be located in the `dist/` directory. You can deploy these files to any static hosting service like [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), or [GitHub Pages](https://pages.github.com/).

## 📁 Key Directories Explained

| Directory         | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `public/`         | Contains static assets like images and icons  |
| `src/components/` | Reusable React components                     |
| `src/pages/`      | Page-level components                         |
| `src/styles/`     | Tailwind CSS configurations and custom styles |
| `src/utils/`      | Utility functions and helpers                 |
| `supabase/`       | Supabase configuration and integration        |

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## Authentication Setup with Clerk

This project uses Clerk for authentication. Follow these steps to set up authentication:

1. Create a Clerk account and application:

   - Go to [Clerk Dashboard](https://dashboard.clerk.dev)
   - Create a new application
   - Get your publishable key from the API Keys section

2. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Add your Clerk publishable key:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
     ```

3. Set up admin users:

   - In the Clerk Dashboard, go to Users
   - Select the user you want to make an admin
   - Go to Public Metadata
   - Add `isAdmin: true`
   - Save changes

4. Available authentication features:

   - Sign in/Sign up with email
   - Protected routes for authenticated users
   - Admin-only routes
   - User profile management
   - Persistent cart and favorites per user

5. Authentication routes:
   - `/sign-in` - Sign in page
   - `/sign-up` - Sign up page
   - Protected routes require authentication
   - Admin routes require admin privileges

## Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Features

- User authentication with Clerk
- Product catalog
- Shopping cart
- Favorites list
- Admin dashboard
- Multi-language support (French, Arabic)
- Dark/Light theme
- Responsive design

## Tech Stack

- React
- TypeScript
- Vite
- Clerk (Authentication)
- Tailwind CSS
- Shadcn/ui
- React Router
- Framer Motion

---

Made by [pro-boost](https://github.com/pro-boost)
