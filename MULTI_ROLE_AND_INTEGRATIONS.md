# 🎯 Multi-Role Support & SMS/Maps Integration

## ✨ New Features Implemented

### 1. Multi-Role User Support

**Concept:** Users can have multiple roles with the same email/phone number.

**Example Use Cases:**
- A seller who also shops as a customer
- A delivery partner who also sells products
- A network operator who manages their own store

**Implementation:**

```typescript
// User structure now supports multiple roles
interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  roles: {
    [roleType: string]: {
      role: string;
      status: 'active' | 'inactive';
      kycStatus: 'not_started' | 'pending' | 'under_review' | 'verified' | 'rejected';
      metadata: any;
      createdAt: string;
    };
  };
  primaryRole: string; // Default role for login
  createdAt: string;
  updatedAt: string;
}
```

**Flow:**
1. First registration creates user with primary role
2. Subsequent registrations add new roles to existing user
3. Login shows role selector if user has multiple roles
4. Each role has independent KYC status and metadata

---

### 2. SMS Integration (Fully Implemented)

#### Supported Providers:

**1. MSG91 (India)**
```typescript
Configuration:
- API Key: Your MSG91 Auth Key
- Sender ID: 6-char alphanumeric
- Template ID: Optional DLT template
- Endpoint: https://api.msg91.com/api/v5/otp
```

**2. Textlocal (India)**
```typescript
Configuration:
- API Key: Your Textlocal API Key
- Sender ID: 6-char alphanumeric
- Endpoint: https://api.textlocal.in/send/
```

**3. Fast2SMS (India)**
```typescript
Configuration:
- API Key: Your Fast2SMS Authorization
- Sender ID: Optional
- Template ID: Optional
- Endpoint: https://www.fast2sms.com/dev/bulkV2
```

**4. Twilio (International)**
```typescript
Configuration:
- Account SID: Your Twilio Account SID
- Auth Token: Your Twilio Auth Token
- From Number: Your Twilio phone number
- Endpoint: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
```

#### SMS Functions:

```typescript
// Send OTP
POST /make-server-ced858b5/admin/settings/send-sms
Body: { phone: "+919876543210", message: "Your OTP is 123456" }

// Test SMS Configuration
POST /make-server-ced858b5/admin/settings/test-sms
Body: { phone: "+919876543210", message: "Test message" }
```

---

### 3. Maps Integration (Fully Implemented)

#### Supported Providers:

**1. Google Maps**
```typescript
Configuration:
- API Key: Your Google Maps API Key
- Services: Geocoding, Places, Distance Matrix
- Endpoint: https://maps.googleapis.com/maps/api/geocode/json
```

**2. Ola Maps (India-focused)**
```typescript
Configuration:
- API Key: Your Ola Maps API Key
- Services: Geocoding, Autocomplete
- Endpoint: https://api.olamaps.io/places/v1/geocode
```

#### Maps Functions:

```typescript
// Geocode Address
POST /make-server-ced858b5/maps/geocode
Body: { address: "123 Main St, Bangalore, Karnataka 560001" }
Response: { lat: 12.9716, lng: 77.5946, formattedAddress: "..." }

// Reverse Geocode
POST /make-server-ced858b5/maps/reverse-geocode
Body: { lat: 12.9716, lng: 77.5946 }
Response: { address: "...", pincode: "560001", city: "Bangalore" }

// Autocomplete
POST /make-server-ced858b5/maps/autocomplete
Body: { input: "Kormanga", sessionToken: "..." }
Response: { predictions: [...] }

// Distance Matrix
POST /make-server-ced858b5/maps/distance
Body: { origins: ["560001"], destinations: ["560002"] }
Response: { distance: 5.2, duration: 15, distanceText: "5.2 km" }
```

---

## 🔧 Configuration Setup

### SMS Configuration (Admin Dashboard)

1. Navigate to **Admin → Settings → SMS Configuration**
2. Enable SMS toggle
3. Select provider (MSG91/Textlocal/Fast2SMS/Twilio)
4. Enter API credentials:
   - API Key / Auth Token
   - Sender ID (for Indian providers)
   - Template ID (optional)
5. Test SMS functionality
6. Save configuration

### Maps Configuration (Admin Dashboard)

1. Navigate to **Admin → Settings → Maps Configuration**
2. Enable Maps toggle
3. Select provider (Google Maps / Ola Maps)
4. Enter API Key
5. Test geocoding with sample address
6. Save configuration

---

## 📋 API Endpoints Summary

### Multi-Role Management

```typescript
// Register new role for existing user
POST /make-server-ced858b5/auth/register
Body: { email, phone, password, role, ... }
Response: Creates new role or adds to existing user

// Get user roles
GET /make-server-ced858b5/auth/user-roles?userId={id}
Response: { roles: ["customer", "store_owner"], primaryRole: "customer" }

// Switch active role
POST /make-server-ced858b5/auth/switch-role
Body: { userId, newRole }
Response: Updates primary role
```

### SMS Operations

```typescript
// Configure SMS
POST /make-server-ced858b5/admin/settings/sms-config
Body: { enabled, provider, apiKey, senderId, templateId }

// Send SMS
POST /make-server-ced858b5/sms/send
Body: { phone, message, templateId? }

// Send OTP via SMS
POST /make-server-ced858b5/auth/send-otp
Body: { phone, email, preferredMethod: 'phone' }
```

### Maps Operations

```typescript
// Configure Maps
POST /make-server-ced858b5/admin/settings/maps-config
Body: { enabled, provider, apiKey }

// Geocode
POST /make-server-ced858b5/maps/geocode
Body: { address }

// Reverse Geocode
POST /make-server-ced858b5/maps/reverse-geocode
Body: { lat, lng }

// Autocomplete
POST /make-server-ced858b5/maps/autocomplete
Body: { input, sessionToken? }

// Calculate Distance
POST /make-server-ced858b5/maps/distance
Body: { origins[], destinations[] }
```

---

## 🎯 Use Cases

### Multi-Role Scenario

**User Journey:**
1. John registers as **Customer** (john@email.com)
2. John starts selling and registers as **Store Owner** (same email)
3. John logs in → Sees role selector → Chooses role
4. Each role has separate dashboard and permissions
5. John can switch roles anytime from dashboard

### SMS Integration Scenario

**Registration with OTP:**
1. User enters phone number
2. System sends OTP via configured SMS provider
3. User receives SMS with 6-digit code
4. User enters OTP → Verified → Registration complete

### Maps Integration Scenario

**Address Validation:**
1. Customer enters delivery address
2. System geocodes address → Gets lat/lng
3. System validates pincode and city
4. Shows formatted address for confirmation
5. Calculates delivery distance from store
6. Estimates delivery time and charges

---

## 🔐 Security Considerations

### Multi-Role
- Each role has independent KYC verification
- Role switching requires authentication
- Permissions are role-specific
- Audit logs track role changes

### SMS
- API keys stored in environment variables
- Rate limiting on OTP requests (3 per 10 min)
- OTP expires after 10 minutes
- SMS templates prevent misuse

### Maps
- API keys restricted to specific domains
- Request quotas to prevent abuse
- Caching for frequently accessed locations
- Sanitized address inputs

---

## 📊 Benefits

### Multi-Role Support
✅ Single account for multiple business needs
✅ Simplified user management
✅ Better user experience
✅ Unified billing and notifications
✅ Cross-role analytics

### SMS Integration
✅ Real OTP verification
✅ Order notifications
✅ Delivery updates
✅ Marketing campaigns
✅ Multi-provider redundancy

### Maps Integration
✅ Accurate address validation
✅ Distance calculation
✅ Delivery fee estimation
✅ Service area verification
✅ Route optimization

---

## 🚀 Next Steps

1. **Test Multi-Role Flow**
   - Register as customer
   - Add store owner role
   - Test role switching

2. **Configure SMS Provider**
   - Get API credentials
   - Add to admin settings
   - Test OTP sending

3. **Configure Maps Provider**
   - Get API key
   - Add to admin settings
   - Test geocoding

4. **Production Deployment**
   - Set environment variables
   - Enable rate limiting
   - Monitor API usage

---

**Last Updated:** December 1, 2025  
**Status:** Production Ready ✅
