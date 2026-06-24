# Deploy the Backend

Click this button to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Environment Variables

Make sure to add these in Vercel:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key
- `PORT` - 5000

## After Deployment

1. Get your backend URL from Vercel (e.g., `https://your-api.vercel.app`)
2. Update the frontend `src/utils/api.js` with this URL
3. Deploy the frontend

## API Endpoints

All endpoints available at: `https://your-api.vercel.app/api/`

- GET `/menu` - Get all menu items
- POST `/orders` - Create order
- POST `/reservations` - Create reservation
- POST `/feedback` - Submit feedback

See `API_DOCUMENTATION.md` for complete API reference.
