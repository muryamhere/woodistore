# **App Name**: WoodiStore

## Core Features:

- Product Catalog: Display a searchable and filterable catalog of handcrafted wooden goods with detailed product information and images.
- Admin Authentication: Secure admin panel login using email/password authentication, with role-based access control managed in Firestore. Admin panel is designed to be distinct and potentially hosted on a separate domain in the future.
- Product Management: Enable administrators to create, update, and delete products, including uploading images to Cloudinary, with validation using zod. Admin panel is designed to be distinct and potentially hosted on a separate domain in the future.
- Customer Authentication: Enable user login through Google Sign-In and email/password.
- Image Management: Integrate Cloudinary for image storage, with functionality to upload new images and delete obsolete ones.
- AI-Powered Recommendations: Suggest related products based on viewing history to help the customer, using an AI tool to make personalized suggestions.
- Real-time updates: Reflect the inventory, and customer changes without the user having to manually refresh.
- Checkout and Payment: Implement a full e-commerce checkout flow with payment processing.

## Style Guidelines:

- Deep Blue (#2C3E50)
- Warm Beige (#F5E9DA)
- Muted Gold (#C9A46C)
- Coffee Brown (#6F4E37)
- Headline font: 'Cormorant Garamond' serif font, bringing an elegant, fashionable, high-end feel, suitable for headlines and small amounts of text. Body font: 'Poppins' sans-serif font as body font for longer text passages.
- Use 'lucide-react' icons. The icons must have a hand drawn quality related to nature.
- Employ a clean and structured layout, leveraging 'shadcn/ui' components to ensure responsiveness across devices, creating a user-friendly experience.
- Incorporate subtle animations using Framer Motion for a polished and engaging user experience.