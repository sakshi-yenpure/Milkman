# Milkman - Fresh Dairy Delivery System

Milkman is a comprehensive dairy delivery platform featuring a modern React frontend and a robust Django REST API backend. It provides a seamless experience for both customers and staff members.

## 🚀 Features

### **For Customers**
- **Home Page**: Premium UI with featured products, store locations, and business stats.
- **Product Catalog**: Browse and add fresh dairy items (Milk, Cheese, Curd, etc.) to your cart.
- **Smart Chatbot**: Green-themed AI assistant to help with product queries and support.
- **Subscription Plans**: Flexible Daily, Weekly, and Monthly plans with 20% savings.
- **Admin Dashboard**: A dedicated user panel to track orders, manage subscriptions, and view profile details.
- **Secure Billing**: Integrated checkout with dummy Card and UPI payment simulations.

### **For Staff**
- **Staff Authentication**: Redesigned Signup and Login portals for team members with "Employee Add" capability.
- **Admin Portal**: A dedicated monitoring hub at `/admin-portal` that tracks real-time employee activities (Login, Signup, Logout) stored in a database.
- **Live Activity Tracking**: Monitor system-wide user activity (logins/signups) from the dashboard or backend root.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, CSS3 (Modern responsive design).
- **Backend**: Django, Django REST Framework.
- **Database**: SQLite3 (Local development with `EmployeeActivity` tracking).

## 🏃 How to Run

### **1. Backend (Django)**
```bash
cd milkman
.\env\Scripts\activate
python manage.py runserver
```
- Access API at: `http://127.0.0.1:8000/`
- View live activity logs on the root landing page.

### **2. Frontend (React)**
```bash
cd reactadmin
npm install
npm run dev
```
- Access App at: `http://localhost:5173/`

## 🐞 Recent Fixes
- **Cart Bug**: Fixed an issue where new users would see a non-empty cart on their first visit.
- **Template Error**: Resolved the `TemplateDoesNotExist` error on the backend root URL.
- **Billing Logic**: Fixed subscription total calculations to include both plan price and cart items.

---
© 2026 Milkman Team. Freshness delivered.
