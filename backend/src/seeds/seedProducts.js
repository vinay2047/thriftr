import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Import your existing models (adjust paths as needed)
// Assuming you have User and Product models exported from your models folder
 import { User } from '../models/user.model.js';
 import { Product } from '../models/product.model.js';

// If you can't import, create minimal references

// Sample product data
const sampleProducts = [
  // Electronics
  {
    title: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 299.99,
    category: "Electronics"
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with excellent sound quality and 20-hour battery life. Waterproof design for outdoor use.",
    price: 89.99,
    category: "Electronics"
  },
  {
    title: "Fitness Tracker Watch",
    description: "Smart fitness tracker with heart rate monitoring, sleep tracking, and 7-day battery life. Compatible with iOS and Android.",
    price: 149.99,
    category: "Electronics"
  },
  {
    title: "Wireless Phone Charger",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
    price: 34.99,
    category: "Electronics"
  },
  {
    title: "Laptop Stand",
    description: "Adjustable laptop stand made from premium aluminum. Improves ergonomics and reduces neck strain during work.",
    price: 69.99,
    category: "Electronics"
  },
  
  // Clothing
  {
    title: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
    price: 29.99,
    category: "Clothing"
  },
  {
    title: "Denim Jeans",
    description: "Classic fit denim jeans made from premium cotton. Comfortable and durable for everyday wear. Available in multiple sizes.",
    price: 79.99,
    category: "Clothing"
  },
  {
    title: "Winter Jacket",
    description: "Warm winter jacket with waterproof exterior and insulated interior. Perfect for cold weather outdoor activities.",
    price: 159.99,
    category: "Clothing"
  },

  // Books
  {
    title: "The Art of Programming",
    description: "Comprehensive guide to modern programming techniques and best practices. Perfect for beginners and experienced developers.",
    price: 49.99,
    category: "Books"
  },
  {
    title: "Mindfulness Meditation Guide",
    description: "Learn the fundamentals of mindfulness and meditation with this practical guide. Includes exercises and techniques.",
    price: 24.99,
    category: "Books"
  },

  // Home
  {
    title: "Stainless Steel Water Bottle",
    description: "Eco-friendly stainless steel water bottle that keeps drinks cold for 24 hours and hot for 12 hours. 750ml capacity.",
    price: 39.99,
    category: "Home"
  },
  {
    title: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic coffee mugs with unique designs. Perfect for your morning coffee or tea. Microwave safe.",
    price: 34.99,
    category: "Home"
  },
  {
    title: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with touch control and USB charging port. Energy-efficient with multiple brightness levels.",
    price: 79.99,
    category: "Home"
  },
  {
    title: "Essential Oil Diffuser",
    description: "Ultrasonic essential oil diffuser with 7 LED colors and timer function. Creates a relaxing atmosphere in any room.",
    price: 49.99,
    category: "Home"
  },

  // Furniture
  {
    title: "Ergonomic Office Chair",
    description: "Comfortable ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.",
    price: 199.99,
    category: "Furniture"
  },
  {
    title: "Wooden Coffee Table",
    description: "Handcrafted wooden coffee table with modern design. Made from sustainable oak wood with natural finish.",
    price: 249.99,
    category: "Furniture"
  },

  // Sports
  {
    title: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials. Extra thick for comfort and durability. Includes carrying strap.",
    price: 45.99,
    category: "Sports"
  },
  {
    title: "Running Shoes",
    description: "Lightweight running shoes with excellent cushioning and breathable mesh upper. Perfect for daily runs and workouts.",
    price: 119.99,
    category: "Sports"
  },
  {
    title: "Resistance Bands Set",
    description: "Complete resistance bands set with multiple resistance levels. Perfect for home workouts and strength training.",
    price: 29.99,
    category: "Sports"
  },

  // Toys
  {
    title: "Educational Building Blocks",
    description: "Creative building blocks set that promotes learning and imagination. Safe for children ages 3+. 200 pieces included.",
    price: 39.99,
    category: "Toys"
  },
  {
    title: "Remote Control Car",
    description: "High-speed remote control car with rechargeable battery. Perfect for outdoor fun and racing. Ages 8+.",
    price: 79.99,
    category: "Toys"
  },

  // Health
  {
    title: "Digital Blood Pressure Monitor",
    description: "Accurate digital blood pressure monitor with large display and memory storage. Easy to use at home.",
    price: 59.99,
    category: "Health"
  },
  {
    title: "Vitamin D3 Supplements",
    description: "High-quality Vitamin D3 supplements for bone health and immune support. 60 capsules per bottle.",
    price: 19.99,
    category: "Health"
  },

  // Beauty
  {
    title: "Facial Cleansing Brush",
    description: "Electric facial cleansing brush with multiple speed settings. Removes makeup and impurities for glowing skin.",
    price: 49.99,
    category: "Beauty"
  },
  {
    title: "Natural Face Moisturizer",
    description: "Organic face moisturizer with hyaluronic acid and vitamin E. Suitable for all skin types. 50ml bottle.",
    price: 34.99,
    category: "Beauty"
  },

  // Grocery
  {
    title: "Organic Honey",
    description: "Pure organic honey harvested from wildflowers. Rich in antioxidants and natural enzymes. 500g jar.",
    price: 24.99,
    category: "Grocery"
  },
  {
    title: "Premium Coffee Beans",
    description: "Single-origin coffee beans roasted to perfection. Rich flavor profile with notes of chocolate and caramel. 1kg bag.",
    price: 29.99,
    category: "Grocery"
  },

  // Jewelry
  {
    title: "Sterling Silver Necklace",
    description: "Elegant sterling silver necklace with pendant. Hypoallergenic and tarnish-resistant. Perfect for special occasions.",
    price: 89.99,
    category: "Jewelry"
  },
  {
    title: "Titanium Watch",
    description: "Premium titanium watch with sapphire crystal and water resistance. Elegant design suitable for any occasion.",
    price: 299.99,
    category: "Jewelry"
  },

  // Automotive
  {
    title: "Car Phone Mount",
    description: "Universal car phone mount with 360-degree rotation. Compatible with all smartphone sizes. Easy installation.",
    price: 19.99,
    category: "Automotive"
  },
  {
    title: "Tire Pressure Gauge",
    description: "Digital tire pressure gauge with LED display and automatic shut-off. Essential tool for vehicle maintenance.",
    price: 24.99,
    category: "Automotive"
  },

  // Other
  {
    title: "Portable Power Bank",
    description: "High-capacity portable power bank with fast charging technology. Compatible with all USB devices. 20000mAh capacity.",
    price: 39.99,
    category: "Other"
  },
  {
    title: "Travel Luggage Set",
    description: "Durable travel luggage set with wheels and telescopic handles. Available in multiple colors. 3-piece set.",
    price: 199.99,
    category: "Other"
  }
];

// Generate random Picsum images
const generatePicsumImages = (count = 3) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    images.push({
      url: `https://picsum.photos/400/300?random=${randomId}`,
      filename: `picsum_${randomId}_${Date.now()}_${i}`
    });
  }
  return images;
};

// Main seeding function
const seedProductsDirectly = async () => {
  console.log('Starting direct database product seeding...');
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get sellers from database
    console.log('Fetching sellers from database...');
    const sellers = await User.find({ role: 'seller' }).select('_id email role');
    
    if (sellers.length === 0) {
      console.log('No sellers found, fetching all users...');
      const allUsers = await User.find({}).select('_id email role');
      sellers.push(...allUsers);
    }
    
    if (sellers.length === 0) {
      console.log('No users found. Please seed users first.');
      return;
    }
    
    console.log(`Found ${sellers.length} sellers to work with`);
    
    let createdProducts = 0;
    let failedProducts = 0;
    
    // Create products directly in database
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i];
      const seller = sellers[i % sellers.length]; // Rotate through sellers
      
      try {
        console.log(`Creating product "${productData.title}" for seller: ${seller.email}`);
        
        // Generate random images from Picsum
        const imageCount = Math.floor(Math.random() * 2) + 2; // 2-3 images
        const images = generatePicsumImages(imageCount);
        
        const newProduct = new Product({
          title: productData.title,
          category: productData.category,
          description: productData.description,
          price: productData.price,
          images: images,
          sellerId: seller._id,
          averageRating: 0,
          reviewCount: 0
        });
        
        await newProduct.save();
        console.log(`Successfully created: ${productData.title}`);
        createdProducts++;
        
      } catch (error) {
        console.error(`Failed to create ${productData.title}:`, error.message);
        failedProducts++;
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Create additional random products
    const additionalCount = Math.min(10, sellers.length * 2);
    console.log(`Creating ${additionalCount} additional random products...`);
    
    for (let i = 0; i < additionalCount; i++) {
      const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
      
      try {
        const modifiedProduct = {
          ...randomProduct,
          title: `${randomProduct.title} - Premium Edition`,
          price: randomProduct.price + Math.floor(Math.random() * 50) + 10,
          description: `${randomProduct.description} This premium version includes additional features and enhanced quality.`
        };
        
        const images = generatePicsumImages(Math.floor(Math.random() * 2) + 2);
        
        const newProduct = new Product({
          title: modifiedProduct.title,
          category: modifiedProduct.category,
          description: modifiedProduct.description,
          price: modifiedProduct.price,
          images: images,
          sellerId: randomSeller._id,
          averageRating: 0,
          reviewCount: 0
        });
        
        await newProduct.save();
        console.log(`Successfully created additional: ${modifiedProduct.title}`);
        createdProducts++;
        
      } catch (error) {
        console.error(`Failed to create additional product:`, error.message);
        failedProducts++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\nProduct seeding completed!');
    console.log(`Successfully created: ${createdProducts} products`);
    console.log(`Failed to create: ${failedProducts} products`);
    console.log(`Products distributed among ${sellers.length} sellers`);
    
  } catch (error) {
    console.error('Seeding process failed:', error.message);
  } finally {
    // Disconnect from MongoDB
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
};

// Run the seeding
seedProductsDirectly();

export { seedProductsDirectly };