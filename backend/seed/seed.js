const connectToDB = require('../database/db'); // Correct import
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Address = require('../models/Address');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Review = require('../models/Review');
const Order = require('../models/Order');

// Import seed data
const brandsData = require('./Brand');
const categoriesData = require('./Category');
const productsData = require('./Product');
const usersData = require('./User');
const addressesData = require('./Address');
const wishlistsData = require('./Wishlist');
const cartsData = require('./Cart');
const reviewsData = require('./Review');
const ordersData = require('./Order');

async function seedCollection(Model, data) {
  try {
    await Model.deleteMany({});
    console.log(`Cleared existing ${Model.collection.name} data`);

    await Model.insertMany(data, { ordered: false });
    console.log(`Successfully seeded ${Model.collection.name}`);
  } catch (error) {
    console.error(`Error seeding ${Model.collection.name}:`, error.message);
  }
}

async function seed() {
  try {
    await connectToDB();
    console.log('Seed [started] please wait..');

    const collections = [
      { model: Brand, data: brandsData },
      { model: Category, data: categoriesData },
      { model: Product, data: productsData },
      { model: User, data: usersData },
      { model: Address, data: addressesData },
      { model: Wishlist, data: wishlistsData },
      { model: Cart, data: cartsData },
      { model: Review, data: reviewsData },
      { model: Order, data: ordersData }
    ];

    for (const { model, data } of collections) {
      await seedCollection(model, data);
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    // Optionally disconnect after seeding
    // await mongoose.disconnect();
  }
}

// Execute if this file is run directly
if (require.main === module) {
  seed();
}

module.exports = seed;