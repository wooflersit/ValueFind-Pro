# 🔧 ValueFind Pro - Backend API Reference

## Server File: `supabase/functions/server/index.tsx`

**Status:** Full implementation (1262 lines) ready in local files  
**Framework:** Hono (Fast Deno web framework)  
**Database:** Supabase KV Store + Auth

---

## 📦 API Endpoints Overview

### 🏁 Initialization
- `POST /make-server-ced858b5/init` - Initialize demo data (10 users, categories, franchises)

### 🔐 Authentication
- `POST /make-server-ced858b5/auth/user` - Get user data by ID
- `POST /make-server-ced858b5/auth/check-email` - Check email availability
- `POST /make-server-ced858b5/auth/check-phone` - Check phone availability
- `POST /make-server-ced858b5/auth/send-otp` - Send OTP for verification
- `POST /make-server-ced858b5/auth/register` - Register new user
- `POST /make-server-ced858b5/auth/forgot-password` - Initiate password reset
- `POST /make-server-ced858b5/auth/reset-password` - Complete password reset

### 📋 KYC Management
- `POST /make-server-ced858b5/kyc/submit` - Submit KYC documents
- `POST /make-server-ced858b5/kyc/verify` - Verify user KYC (admin/operator)

### 🏷️ Categories
- `GET /make-server-ced858b5/categories` - List all categories

### 📦 Products
- `POST /make-server-ced858b5/products/list` - List products (with filters)
- `POST /make-server-ced858b5/products/get` - Get single product
- `POST /make-server-ced858b5/products/create` - Create product (auth required)
- `POST /make-server-ced858b5/products/update` - Update product (auth required)
- `POST /make-server-ced858b5/products/delete` - Delete product (auth required)

### 🛒 Cart
- `POST /make-server-ced858b5/cart/get` - Get cart items
- `POST /make-server-ced858b5/cart/add` - Add item to cart
- `POST /make-server-ced858b5/cart/update` - Update cart item quantity
- `POST /make-server-ced858b5/cart/remove` - Remove item from cart
- `POST /make-server-ced858b5/cart/clear` - Clear entire cart

### 📦 Orders
- `POST /make-server-ced858b5/orders/create` - Create new order (auth required)
- `POST /make-server-ced858b5/orders/list` - List orders (filtered by role)
- `POST /make-server-ced858b5/orders/get` - Get single order
- `POST /make-server-ced858b5/orders/update-status` - Update order status (auth required)

### 📊 Dashboard
- `POST /make-server-ced858b5/dashboard/stats` - Get role-specific dashboard stats (auth required)

### 🏚️ Franchises
- `GET /make-server-ced858b5/franchises` - List all franchises
- `POST /make-server-ced858b5/franchises/assign` - Assign franchise to operator (auth required)

### 👥 Users
- `POST /make-server-ced858b5/users/list` - List users (with role/KYC filters)

### ⚙️ Admin Settings
- `GET /make-server-ced858b5/admin/settings/sms-config` - Get SMS configuration
- `POST /make-server-ced858b5/admin/settings/sms-config` - Update SMS configuration
- `POST /make-server-ced858b5/admin/settings/test-sms` - Test SMS sending
- `GET /make-server-ced858b5/admin/settings/maps-config` - Get Maps configuration
- `POST /make-server-ced858b5/admin/settings/maps-config` - Update Maps configuration  
- `POST /make-server-ced858b5/admin/settings/test-geocoding` - Test geocoding

### ❤️‍🩹 Health Check
- `GET /make-server-ced858b5/health` - Server health status

---

## 👤 Demo Users (Pre-configured)

| Email | Role | Password | Business Type |
|-------|------|----------|---------------|
| master@valuefind.com | master_admin | Master@123 | - |
| operator@valuefind.com | network_operator | Operator@123 | - |
| manufacturer@valuefind.com | store_owner | Store@123 | Manufacturer |
| distributor@valuefind.com | store_owner | Store@123 | Distributor |
| trader@valuefind.com | store_owner | Store@123 | Trader |
| retailer@valuefind.com | store_owner | Store@123 | Retailer |
| delivery@valuefind.com | delivery_partner | Delivery@123 | Bike |
| delivery2@valuefind.com | delivery_partner | Delivery@123 | Van |
| customer@valuefind.com | customer | Customer@123 | - |
| premium@valuefind.com | customer | Premium@123 | Premium |

---

## 🔑 Authentication Flow

1. **User initiates login/register**
2. **Frontend sends request** to appropriate endpoint
3. **Server validates** using Supabase Auth
4. **KV Store** maintains user profile data
5. **JWT token** returned for subsequent requests
6. **Protected routes** verify token via `verifyUser()` helper

---

## 📄 Data Storage Strategy

**KV Store Prefixes:**
- `user:{userId}` - User profiles
- `product:{productId}` - Product catalog
- `cart:{customerId}` - Shopping carts
- `order:{orderId}` - Order records
- `category:{categoryId}` - Product categories
- `franchise:{pincode}` - Franchise records
- `otp:{identifier}` - Temporary OTP storage
- `reset_otp:{email}` - Password reset OTPs
- `settings:sms_config` - SMS provider configuration
- `settings:maps_config` - Maps API configuration

---

## 🔒 Security Features

- ✅ JWT token verification for protected routes
- ✅ Role-based access control
- ✅ Email/phone uniqueness validation
- ✅ OTP expiration (10 minutes)
- ✅ Password hashing via Supabase Auth
- ✅ CORS enabled for frontend access
- ✅ Request logging for debugging

---

## 🌐 SMS/Maps Integration

### SMS Providers Supported:
1. **MSG91** - Indian SMS gateway
2. **Textlocal** - Bulk SMS service
3. **Fast2SMS** - Fast delivery service
4. **Twilio** - International SMS

### Maps Providers Supported:
1. **Google Maps** - Global coverage
2. **Ola Maps** - India-focused

**Configuration:** Managed via Admin Settings dashboard

---

## 🛠️ Error Handling

All endpoints return standard JSON responses:

```typescript
// Success
{ success: true, data: {...}, message: "Operation successful" }

// Error
{ success: false, error: "Error description", status: 400/401/404/500 }
```

---

## 🚀 Deployment

**File Location:** `/supabase/functions/server/index.tsx`  
**Entry Point:** `Deno.serve(app.fetch)`  
**Dependencies:** Installed via `npm:`/`jsr:` imports

---

**💡 Note:** Complete 1262-line implementation available in your local files. Deploy via manual git push for full functionality.
