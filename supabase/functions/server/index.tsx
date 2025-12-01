import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to verify user
const verifyUser = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
};

// ==================== INITIALIZATION ====================

app.post('/make-server-ced858b5/init', async (c) => {
  try {
    console.log('Starting demo data initialization...');
    
    // Demo users configuration
    const demoUsers = [
      { email: 'master@valuefind.com', password: 'Master@123', role: 'master_admin', name: 'Master Admin', phone: '+919876543210', kycStatus: 'verified' },
      { email: 'operator@valuefind.com', password: 'Operator@123', role: 'network_operator', name: 'Network Operator', phone: '+919876543211', kycStatus: 'verified', metadata: { assignedPincodes: ['560001', '560002', '560003'], assignedArea: 'South Zone', commissionRate: 5 } },
      { email: 'manufacturer@valuefind.com', password: 'Store@123', role: 'store_owner', name: 'ABC Manufacturing', phone: '+919876543212', kycStatus: 'verified', metadata: { businessType: 'manufacturer', businessName: 'ABC Manufacturing Ltd', gst: '29ABCDE1234F1Z5', pincode: '560001' } },
      { email: 'distributor@valuefind.com', password: 'Store@123', role: 'store_owner', name: 'XYZ Distributors', phone: '+919876543213', kycStatus: 'verified', metadata: { businessType: 'distributor', businessName: 'XYZ Distributors Pvt Ltd', gst: '29XYZAB1234G1Z5', pincode: '560002' } },
      { email: 'trader@valuefind.com', password: 'Store@123', role: 'store_owner', name: 'Global Traders', phone: '+919876543214', kycStatus: 'pending', metadata: { businessType: 'trader', businessName: 'Global Traders Inc', gst: '29TRADE1234H1Z5', pincode: '560003' } },
      { email: 'retailer@valuefind.com', password: 'Store@123', role: 'store_owner', name: 'Super Store', phone: '+919876543215', kycStatus: 'under_review', metadata: { businessType: 'retailer', businessName: 'Super Store', gst: '29RETAIL1234I1Z5', pincode: '400001' } },
      { email: 'delivery@valuefind.com', password: 'Delivery@123', role: 'delivery_partner', name: 'Rajesh Kumar', phone: '+919876543216', kycStatus: 'verified', metadata: { vehicleType: 'bike', vehicleNumber: 'KA-01-AB-1234', availabilityStatus: 'available', assignedPincodes: ['560001', '560002'] } },
      { email: 'delivery2@valuefind.com', password: 'Delivery@123', role: 'delivery_partner', name: 'Mohammed Ali', phone: '+919876543217', kycStatus: 'verified', metadata: { vehicleType: 'van', vehicleNumber: 'KA-02-CD-5678', availabilityStatus: 'available', assignedPincodes: ['560003', '400001'] } },
      { email: 'customer@valuefind.com', password: 'Customer@123', role: 'customer', name: 'John Doe', phone: '+919876543218', kycStatus: 'not_started', metadata: { deliveryAddress: { line1: '123 Main Street', pincode: '560001', city: 'Bangalore', state: 'Karnataka' } } },
      { email: 'premium@valuefind.com', password: 'Premium@123', role: 'customer', name: 'Jane Smith', phone: '+919876543219', kycStatus: 'not_started', metadata: { subscriptionTier: 'premium', deliveryAddress: { line1: '456 Park Avenue', pincode: '560002', city: 'Bangalore', state: 'Karnataka' } } },
    ];

    // Create all demo users
    for (const userData of demoUsers) {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: { name: userData.name, phone: userData.phone, role: userData.role },
        });

        if (error) {
          console.log(`User ${userData.email} might already exist:`, error.message);
          continue;
        }

        if (data.user) {
          await kv.set(`user:${data.user.id}`, {
            id: data.user.id,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            phone: userData.phone,
            status: 'active',
            kycStatus: userData.kycStatus,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: userData.metadata || {},
          });
          console.log(`Created user: ${userData.email}`);
        }
      } catch (err) {
        console.error(`Error creating ${userData.email}:`, err);
      }
    }

    // Initialize categories
    const categories = [
      { id: 'cat-1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', isActive: true, order: 1 },
      { id: 'cat-2', name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', isActive: true, order: 2 },
      { id: 'cat-3', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchenware', isActive: true, order: 3 },
      { id: 'cat-4', name: 'Groceries', slug: 'groceries', description: 'Food and beverages', isActive: true, order: 4 },
      { id: 'cat-5', name: 'Books & Media', slug: 'books-media', description: 'Books, music, and movies', isActive: true, order: 5 },
    ];

    for (const category of categories) {
      await kv.set(`category:${category.id}`, category);
    }

    // Initialize franchises
    const franchises = [
      { id: 'fr-1', pincode: '560001', area: 'Koramangala', city: 'Bangalore', state: 'Karnataka', operatorId: null, isActive: true },
      { id: 'fr-2', pincode: '560002', area: 'Indiranagar', city: 'Bangalore', state: 'Karnataka', operatorId: null, isActive: true },
      { id: 'fr-3', pincode: '560003', area: 'Whitefield', city: 'Bangalore', state: 'Karnataka', operatorId: null, isActive: true },
      { id: 'fr-4', pincode: '400001', area: 'Fort', city: 'Mumbai', state: 'Maharashtra', operatorId: null, isActive: true },
      { id: 'fr-5', pincode: '400002', area: 'Kalbadevi', city: 'Mumbai', state: 'Maharashtra', operatorId: null, isActive: true },
    ];

    for (const franchise of franchises) {
      await kv.set(`franchise:${franchise.pincode}`, franchise);
    }

    console.log('Initialization complete!');
    return c.json({ success: true, message: 'Demo data initialized successfully', users: demoUsers.length, categories: categories.length, franchises: franchises.length });
  } catch (error: any) {
    console.error('Initialization error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== AUTHENTICATION ====================

app.post('/make-server-ced858b5/auth/user', async (c) => {
  try {
    const { userId } = await c.req.json();
    if (!userId) return c.json({ error: 'User ID required' }, 400);
    const userData = await kv.get(`user:${userId}`);
    if (!userData) return c.json({ error: 'User not found' }, 404);
    return c.json(userData);
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-ced858b5/auth/check-email', async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) return c.json({ error: 'Email required' }, 400);
    const allUsers = await kv.getByPrefix('user:');
    const emailExists = allUsers.some((user: any) => user.email === email);
    return c.json({ available: !emailExists });
  } catch (error: any) {
    console.error('Check email error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-ced858b5/auth/check-phone', async (c) => {
  try {
    const { phone } = await c.req.json();
    if (!phone) return c.json({ error: 'Phone required' }, 400);
    const allUsers = await kv.getByPrefix('user:');
    const phoneExists = allUsers.some((user: any) => user.phone === phone);
    return c.json({ available: !phoneExists });
  } catch (error: any) {
    console.error('Check phone error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-ced858b5/auth/send-otp', async (c) => {
  try {
    const { email, phone, preferredMethod } = await c.req.json();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${preferredMethod === 'email' ? email : phone}`;
    await kv.set(otpKey, { otp, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() });
    console.log(`OTP for ${preferredMethod}: ${otp}`);
    return c.json({ otp, sentTo: preferredMethod as 'email' | 'phone', message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-ced858b5/auth/register', async (c) => {
  try {
    const { name, email, phone, password, role, address } = await c.req.json();
    const allUsers = await kv.getByPrefix('user:');
    if (allUsers.some((user: any) => user.email === email)) return c.json({ error: 'Email already registered' }, 400);
    
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name, phone, role: role || 'customer' } });
    if (error) return c.json({ error: error.message }, 500);
    if (data.user) {
      await kv.set(`user:${data.user.id}`, { id: data.user.id, email, role: role || 'customer', name, phone, status: 'active', kycStatus: 'not_started', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), metadata: { deliveryAddress: address } });
      return c.json({ success: true, message: 'Registration successful', userId: data.user.id });
    }
    return c.json({ error: 'Failed to create user' }, 500);
  } catch (error: any) {
    console.error('Registration error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-ced858b5/auth/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json();
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.email === email);
    if (!user) return c.json({ error: 'Email not found' }, 404);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await kv.set(`reset_otp:${email}`, { otp, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() });
    console.log(`Reset OTP for ${email}: ${otp}`);
    return c.json({ otp, message: 'Reset code sent to your email' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-ced858b5/auth/reset-password', async (c) => {
  try {
    const { email, newPassword } = await c.req.json();
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.email === email);
    if (!user) return c.json({ error: 'User not found' }, 404);
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password: newPassword });
    if (error) return c.json({ error: error.message }, 500);
    await kv.del(`reset_otp:${email}`);
    return c.json({ success: true, message: 'Password reset successful' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// NOTE: This is a condensed version. Full implementation with Products, Cart, Orders, KYC, Dashboard, Franchises, and Settings routes available in local files.
// Deploy via manual git push for complete 1262-line implementation.

// Health check
app.get('/make-server-ced858b5/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
