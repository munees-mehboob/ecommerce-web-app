require('dotenv').config();
const { sequelize } = require('../config/db'); 
const Product = require('../models/Product');

const products = [
  {
    title: 'Wireless Headphones',
    description: 'Premium sound quality with noise cancellation',
    category: 'Electronics',
    price: 7999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stock: 20,
   
    numReviews: 128,
    isNewArrival: true,
  },
  {
    title: 'Running Shoes',
    description: 'Lightweight and durable for all terrains',
    category: 'Footwear',
    price: 5999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stock: 15,
  
    numReviews: 89,
    isNewArrival: true,
  },
  {
    title: 'Coffee Mug',
    description: 'Ceramic mug keeps coffee hot for hours',
    category: 'Kitchen',
    price: 1499,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop',
    stock: 50,
    // rating: 4.8,
    numReviews: 214,
    isNewArrival: false,
  },
  {
    title: 'Backpack',
    description: 'Spacious 30L waterproof backpack',
    category: 'Accessories',
    price: 4999,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    stock: 30,
    
    numReviews: 76,
    isNewArrival: false,
  },
  {
    title: 'Smart Watch',
    description: 'Fitness tracking with heart rate monitor',
    category: 'Electronics',
    price: 12999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    stock: 10,
   
    numReviews: 302,
    isNewArrival: true,
  },
  {
    title: 'Yoga Mat',
    description: 'Non-slip premium yoga mat 6mm thick',
    category: 'Fitness',
    price: 2999,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop',
    stock: 25,
    
    numReviews: 91,
    isNewArrival: true,
  },
  {
    title: 'Sunglasses',
    description: 'UV400 polarized lenses stylish design',
    category: 'Accessories',
    price: 3499,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    stock: 40,

    numReviews: 45,
    isNewArrival: false,
  },
  {
    title: 'Bluetooth Speaker',
    description: '360 sound with 12hr battery life',
    category: 'Electronics',
    price: 6999,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    stock: 18,
    
    numReviews: 167,
    isNewArrival: true,
  },
  {
    title: 'Leather Handbag',
    description: 'Genuine leather with multiple compartments',
    category: 'Fashion',
    price: 8999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
    stock: 12,
   
    numReviews: 98,
    isNewArrival: true,
  },
  {
    title: 'Desk Lamp LED',
    description: 'Adjustable brightness eye-care LED lamp',
    category: 'Home',
    price: 2499,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
    stock: 35,

    numReviews: 63,
    isNewArrival: false,
  },
  {
    title: 'Race Cycle',
    description: 'Professional lightweight carbon frame race bicycle',
    category: 'Sports',
    price: 89999,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    stock: 5,

    numReviews: 34,
    isNewArrival: true,
  },
  {
    title: 'Face Moisturizer',
    description: 'Hydrating daily moisturizer with SPF 30',
    category: 'Beauty',
    price: 1899,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    stock: 60,

    numReviews: 187,
    isNewArrival: false,
  },
   {
    title: 'Fashion clothes and all',
    description: 'modern type clothes ',
    category: 'fashion',
    price: 5000,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=500&auto=format&fit=crop',
    stock: 50,

    numReviews: 190,
    isNewArrival: false,
  },
];
const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL...');

    // 1. Disable foreign key checks so we can drop the table
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('Foreign key checks disabled.');

    // 2. Force sync (Wipe and recreate table)
    await sequelize.sync({ force: true });
    console.log('Table recreated.');

    // 3. Bulk insert the new products
    await Product.bulkCreate(products);

    // 4. Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Products seeded successfully with REAL images!');

    process.exit();
  } catch (error) {
    console.error('❌ Seeder error:', error);
    // Even if it fails, try to re-enable checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    process.exit(1);
  }
};

seed();
