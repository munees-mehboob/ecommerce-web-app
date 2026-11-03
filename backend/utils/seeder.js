require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const { User, Product, Order } = require('../models/index');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old MongoDB collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('👤 Creating only Admin user...');
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shopnow.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const salt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash(adminPassword, salt);

    // Only Admin Account is created
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminHashedPassword,
      isAdmin: true,
    });

    console.log(`✅ Admin created: ${adminUser.email}`);

    console.log('📦 Seeding products with numeric discounts...');
    const products = [
      {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality.',
        category: 'Electronics',
        price: 8499,
        discount: 15,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        stock: 25,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 0,
        reviews: [],
      },
      {
        title: 'Nike Air Zoom Pegasus 40 Running Shoes',
        description: 'A responsive ride for everyday runs with tuned support and targeted breathability.',
        category: 'Fashion',
        price: 6499,
        discount: 20,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        stock: 30,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 0,
        reviews: [],
      },
      {
        title: 'Apple Watch Series 9 GPS 45mm',
        description: 'Smarter, brighter, and mightier with the S9 SiP chip, double tap gesture, and health insights.',
        category: 'Electronics',
        price: 14999,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        stock: 18,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 0,
        reviews: [],
      },
      {
        title: 'Ceramic Pour-Over Coffee Dripper Set',
        description: 'Artisan hand-crafted ceramic dripper that maintains water temperature for rich pour-over extraction.',
        category: 'Home',
        price: 1899,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop&q=80',
        stock: 45,
        isNewArrival: false,
        rating: 4.5,
        numReviews: 0,
        reviews: [],
      },
      {
        title: 'Everyday Travel & Commuter 30L Backpack',
        description: 'Weatherproof exterior, padded laptop sleeve up to 16", and ergonomic breathable back panel.',
        category: 'Accessories',
        price: 4499,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        stock: 35,
        isNewArrival: false,
        rating: 4.6,
        numReviews: 0,
        reviews: [],
      },
      {
        title: 'Minimalist Mechanical Keyboard RGB',
        description: 'Hot-swappable tactile mechanical switches with custom PBT double-shot keycaps and wireless connectivity.',
        category: 'Electronics',
        price: 5299,
        discount: 12,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        stock: 20,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 0,
        reviews: [],
      },
      {
        title: 'Organic Vitamin C Glow Face Serum',
        description: 'Potent 20% Vitamin C serum with Hyaluronic Acid and Ferulic Acid for radiant skin tone.',
        category: 'Beauty',
        price: 2199,
        discount: 18,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
        stock: 50,
        isNewArrival: false,
        rating: 4.7,
        numReviews: 0,
        reviews: [],
      },
      {
        title: 'Pro Training Non-Slip Yoga Mat',
        description: 'High-density eco-friendly TPE foam with laser-engraved alignment guides for workouts.',
        category: 'Sports',
        price: 2799,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
        stock: 40,
        isNewArrival: false,
        rating: 4.4,
        numReviews: 0,
        reviews: [],
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products seeded successfully!`);
    console.log('✅ Users collection has ONLY the Admin account. Ready for customer registrations.');

    console.log('\n🎉 SEEDING COMPLETE! You can now log into MongoDB Compass and test the app.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

seedData();
