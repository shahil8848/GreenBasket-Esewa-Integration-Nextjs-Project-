🌿 GreenBasket – Sustainable E-Commerce for a Greener Tomorrow

GreenBasket is a modern, full-stack e-commerce platform dedicated to promoting sustainable and eco-friendly shopping. Discover ethically sourced products like hemp bags, hemp oils, locally handcrafted goods, and other eco-conscious items through a seamless, responsive, and user-friendly experience.
🔗 Live Site: greenbasket-esewa.vercel.app
📂 GitHub Repo: shahil8848/GreenBasket-Esewa-Integration-Nextjs-Project
👤 Connect with me on LinkedIn: Shahil Bhusal(https://www.linkedin.com/in/shahil-bhusal8848)

✨ Key Features

Responsive Design: Clean, minimal, and fully responsive UI crafted with Tailwind CSS.
User Authentication: Secure registration, login, and session management powered by Clerk.
Product Management: Efficient product creation and listing with robust form validation.
Image Handling: Multi-image upload and optimized delivery using Cloudinary.
Background Processing: Event tracking and async jobs managed by Inngest.
Database: Scalable, cloud-based storage with MongoDB Atlas.
Notifications: Real-time success and error feedback using React Hot Toast.
Product Categories: Explore Hemp Bags, Hemp Oils, Local Artisan, and Eco-Friendly items.
Protected Routes: Secure access to sensitive pages with Clerk’s SDK.
Scalable Codebase: Clean, modular, and ready for future enhancements.


🛠️ Tech Stack
GreenBasket leverages a modern tech stack for performance and scalability:



Technology
Purpose



Next.js
Frontend and backend framework


Tailwind CSS
Styling and responsive design


Clerk
Authentication and user management


MongoDB Atlas
Cloud-based database storage


Cloudinary
Image upload and optimization


Inngest
Background task processing


Axios
API communication


React Hot Toast
Real-time notifications


Vercel
Deployment and CI/CD



📁 Project Structure
Key directories and files:
├── /app                        # Next.js app router for pages and API routes
│   ├── /about                  # About page
│   ├── /add-address            # Add address page
│   ├── /all-products           # All products listing page
│   ├── /api                    # API routes
│   ├── /cart                   # Shopping cart page
│   ├── /contact                # Contact page
│   ├── /esewa-payment-success  # eSewa payment success page
│   ├── /my-orders              # Customer order history page
│   ├── /order-placed           # Order confirmation page
│   ├── /privacy                # Privacy policy page
│   ├── /product                # Product detail page
│   ├── /seller                 # Seller dashboard and pages
│   ├── favicon.ico             # Favicon for the site
│   ├── globals.css             # Global CSS styles
│   ├── layout.js               # Root layout for app router
│   ├── page.jsx                # Home page
├── /assets                     # Static assets like images and fonts
├── /components                 # Reusable UI components
│   ├── /seller                 # Seller-specific components
│   │   ├── Footer.jsx          # Seller footer component
│   │   ├── Navbar.jsx          # Seller navigation bar
│   │   ├── Sidebar.jsx         # Seller sidebar
│   ├── AboutUs.jsx             # About us section
│   ├── Banner.jsx              # Homepage banner
│   ├── ContactUs.jsx           # Contact us section
│   ├── FeaturedProduct.jsx     # Featured product display
│   ├── Footer.jsx              # Main footer component
│   ├── HeaderSlider.jsx        # Header carousel/slider
│   ├── HomeProducts.jsx        # Homepage product listing
│   ├── Loading.jsx             # Loading state component
│   ├── Navbar.jsx              # Main navigation bar
│   ├── NewsLetter.jsx          # Newsletter subscription component
│   ├── OrderSummary.jsx        # Order summary component
│   ├── PrivacyPolicy.jsx       # Privacy policy component
│   ├── ProductCard.jsx         # Product card for listings
├── /config                     # Configuration files
│   ├── db.js                   # Database connection setup
│   ├── inngest.js              # Inngest configuration
├── /context                    # React context for state management
│   ├── AppContext.jsx          # Application-wide context
├── /lib                        # Utility functions and helpers
│   ├── authSeller.js           # Seller authentication utilities
│   ├── generateEsewaSignature.js # eSewa payment signature generation
├── /models                     # MongoDB models
│   ├── Address.js              # Address schema
│   ├── Order.js                # Order schema
│   ├── Product.js              # Product schema
│   ├── User.js                 # User schema
├── /public                     # Publicly accessible static files
├── /screenshots and reports    # Website screenshots
├── .env                        # Environment variables (not tracked)
├── .env.example                # Template for environment variables
├── .gitignore                  # Files and folders to ignore in Git
├── eslint.config.mjs           # ESLint configuration for code linting
├── jsconfig.json               # JavaScript/Next.js path aliases
├── LICENSE                     # MIT License file
├── middleware.ts               # Next.js middleware for route protection
├── next.config.mjs             # Next.js configuration
├── package-lock.json           # Locked dependency versions
├── package.json                # Project dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration for Tailwind
├── tailwind.config.mjs         # Tailwind CSS configuration


📸 Screenshots
Here are some screenshots of the application.

### Admin Panel

[Admin Order Page](screenshots and reports/admin order page.png)
A view of the admin order management page.

[Admin Product List Page](screenshots and reports/admin product list page.png)
A view of the admin product list management page.

[Home Page with Admin Panel Visible](screenshots and reports/home page with admin pannel visible.png)
The homepage with the admin panel visible.

### Customer Interface

[Customer Home Page](screenshots and reports/customer home page.png)
The main homepage for customers.

[Product Detail Page](screenshots and reports/product detail page.png)
A detailed view of a specific product.

[Product After Search Page](screenshots and reports/producct after search page.png)
The page displaying search results.

[Customers My Order Page](screenshots and reports/customers myorder page.png)
The customer's personal order history page.

### Checkout Process

[Checkout with eSewa Button](screenshots and reports/check out with esewa button.png)
The checkout page showing the eSewa payment option.

[Order Summary Page](screenshots and reports/ordersummmary page.png)
A summary of the order before payment.

[eSewa Payment](screenshots and reports/esewa.png)
The eSewa payment gateway interface.


🚀 Getting Started Locally
Follow these steps to run GreenBasket on your local machine:

Clone the repository:
git clone https://github.com/shahil8848GreenBasket-Esewa-Integration-Nextjs-Project-.git


Navigate to the project directory:
cd GreenBasket-Esewa-Integration-Nextjs-Project


Install dependencies:
npm install


Set up environment variables:

Copy .env.example to .env:cp .env.example .env


Add your credentials for services like MongoDB Atlas, Cloudinary, Clerk, and Inngest as specified in .env.example.


Run the development server:
npm run dev


Open the app:Visit http://localhost:3000 in your browser.



🤝 Contributing
Contributions are welcome To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add YourFeature').
Push to the branch (git push origin feature/YourFeature).
Open a Pull Request.

Please ensure your code follows the project’s coding standards and includes relevant tests.

📜 License
This project is licensed under the MIT License.

🙏 Acknowledgements

Next.js for an amazing framework.
Clerk for seamless authentication.
MongoDB Atlas and Cloudinary for robust data and image management.
Vercel for effortless deployment.
All eco-conscious artisans and sustainable brands inspiring this project.



GreenBasket is more than an e-commerce platform – it’s a movement toward sustainable living and empowering local artisans. Let’s build a greener tomorrow, one purchase at a time.
