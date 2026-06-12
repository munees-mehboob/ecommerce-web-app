

const { Product, Review } = require('../models/index');
const { Op } = require('sequelize');

// @desc    Fetch all products with search, category, and pagination
// @route   GET /api/products
// backend/controllers/productController.js
// Make sure Op is imported at the very top: const { Op } = require('sequelize');

const getProducts = async (req, res) => {
  try {
    const { category, search, filter, sort, page = 1, limit = 8 } = req.query; // 1. Extract 'sort'
    const where = {};

    if (category) where.category = category;
    if (search) where.title = { [Op.like]: `%${search}%` };

    if (filter === 'deals') {
      where.discount = { [Op.gt]: 0 };
    }

    // 2. Define the sorting logic
      // 2. Define the sorting logic (Standard Sequelize format)
    let order = [['createdAt', 'DESC']]; 

    if (sort === 'price_asc') {
      order = [['price', 'ASC']];
    } else if (sort === 'price_desc') {
      order = [['price', 'DESC']];
    } else if (sort === 'rating') {
      order = [['rating', 'DESC']];
    } else if (sort === 'newest') {
      order = [['createdAt', 'DESC']];
    }


    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: order // 3. Use the dynamic order here
    });

    res.json({ products, page: Number(page), totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ... Rest of your functions (getProductById, deleteProduct, createProduct, updateProduct, createReview) remain the same


// @desc  Get single product by ID (with reviews)
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews' }],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};


// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      await product.destroy();
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route   POST /api/products
// @desc    Create a product
const createProduct = async (req, res) => {
  try {
    const { 
      title, price, image, category, stock, 
      description, isNewArrival, rating, numReviews,
      discount  // ← ADD THIS
    } = req.body;

    const product = await Product.create({
      title,
      price:       Number(price),
      image,
      category,
      stock:       Number(stock)      || 0,
      description,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : true,
      rating:      Number(rating)     || 0,
      numReviews:  Number(numReviews) || 0,
      discount:    Number(discount)   || 0,  // ← ADD THIS
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/products/:id
// @desc    Update a product
const updateProduct = async (req, res) => {
  try {
    const { 
      title, price, image, category, 
      stock, description, isNewArrival, 
      rating, numReviews,
      discount  // ← ADD THIS
    } = req.body;
    
    const product = await Product.findByPk(req.params.id);

    if (product) {
      product.title       = title       || product.title;
      product.price       = price       !== undefined ? Number(price)       : product.price;
      product.image       = image       || product.image;
      product.category    = category    || product.category;
      product.stock       = stock       !== undefined ? Number(stock)       : product.stock;
      product.description = description || product.description;
      product.isNewArrival = isNewArrival !== undefined ? isNewArrival      : product.isNewArrival;
      product.rating      = rating      !== undefined ? Number(rating)      : product.rating;
      product.numReviews  = numReviews  !== undefined ? Number(numReviews)  : product.numReviews;
      product.discount    = discount    !== undefined ? Number(discount)    : product.discount; // ← ADD THIS

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
const createReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      // 1. Check if user already reviewed
      const existingReview = await Review.findOne({
        where: { productId: product.id, userId: req.user.id }
      });

      if (existingReview) {
        // --- UPDATE MODE ---
        existingReview.rating = Number(rating);
        existingReview.comment = comment;
        await existingReview.save();
      } else {
        // --- CREATE MODE ---
        await Review.create({
          productId: product.id,
          userId: req.user.id,
          name: req.user.name,
          rating: Number(rating),
          comment,
        });
      }

      // 2. Recalculate average rating for the product
      const reviews = await Review.findAll({ where: { productId: product.id } });
      product.numReviews = reviews.length;
      product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

      await product.save();
      res.status(201).json({ message: existingReview ? 'Review updated!' : 'Review added!' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { 
  getProducts, 
  getProductById, 
  deleteProduct, 
  createProduct, 
  updateProduct,
  createReview // <--- ADD THIS
};
