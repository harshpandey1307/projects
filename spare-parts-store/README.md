# Spare Parts Store - E-commerce Platform

A modern, multi-language e-commerce platform for spare parts sales with OTP-based authentication. Built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

### 🌐 Multi-Language Support
- Support for 10 Indian languages: English, Hindi, Marathi, Gujarati, Telugu, Tamil, Kannada, Malayalam, Bengali, and Punjabi
- Dynamic language switching
- Fully localized UI components

### 🔐 Secure Authentication
- OTP-based authentication via mobile number
- Product serial number verification
- JWT token-based session management
- Secure password hashing with bcrypt

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Mobile-first approach

### 🛠 Technical Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens with OTP verification
- **Internationalization**: next-intl
- **Form Handling**: React Hook Form with Zod validation

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd spare-parts-store
   npm install
   ```

2. **Set Up Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

3. **Seed Sample Data**
   ```bash
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the Application

### Sample Data for Testing

The application comes with pre-seeded sample data:

#### Product Serial Numbers:
- `WM001234567` - HomeTech Auto Wash Pro (Washing Machine)
- `RF987654321` - CoolFridge Double Door Pro (Refrigerator)  
- `AC555666777` - AirCool Split AC Inverter (Air Conditioner)

#### Mobile Number:
- Use any 10-digit mobile number starting with 6-9 (e.g., `9876543210`)

### Testing Flow:
1. Select your preferred language from the dropdown
2. Enter one of the sample serial numbers
3. Enter a valid 10-digit mobile number
4. Click "Send OTP"
5. **In development mode**, the OTP will be displayed in the alert and console
6. Enter the OTP to complete login

## API Endpoints

### Authentication Routes

#### POST `/api/auth/send-otp`
Send OTP to mobile number after validating product serial number.

**Request Body:**
```json
{
  "serialNumber": "WM001234567",
  "mobileNumber": "9876543210"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "otp": "123456" // Only in development
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and authenticate user.

**Request Body:**
```json
{
  "serialNumber": "WM001234567",
  "mobileNumber": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully",
  "token": "jwt_token_here",
  "customer": {
    "id": "customer_id",
    "name": "Customer Name",
    "mobileNumber": "9876543210"
  },
  "product": {
    "id": "product_id",
    "serialNumber": "WM001234567",
    "name": "Product Name",
    "spareParts": [...]
  }
}
```

## Database Schema

### Core Models:
- **Customer**: User information and contact details
- **Product**: Registered products with serial numbers
- **SparePart**: Available spare parts for each product
- **OtpVerification**: OTP management and verification
- **Order**: Customer orders and order items

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# SMS/OTP Service (for production use)
SMS_API_KEY="your-sms-api-key"
SMS_API_URL="your-sms-service-url"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data

## Language Support

The application supports the following languages:
- English (en)
- Hindi (hi) - हिंदी
- Marathi (mr) - मराठी
- Gujarati (gu) - ગુજરાતી
- Telugu (te) - తెలుగు
- Tamil (ta) - தமிழ்
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Bengali (bn) - বাংলা
- Punjabi (pa) - ਪੰਜਾਬੀ

## Security Features

- Input validation and sanitization
- SQL injection protection via Prisma
- XSS protection
- CSRF protection
- Rate limiting ready
- Secure OTP generation and verification
- JWT token expiration handling

## Production Deployment

For production deployment:

1. Update environment variables
2. Configure SMS service for OTP delivery
3. Set up proper database (PostgreSQL recommended)
4. Enable HTTPS
5. Configure proper CORS settings
6. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**
