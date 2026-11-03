const { Product } = require('../models/index');

// @desc    Fetch all products with search, category, and pagination
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, filter, sort, page = 1, limit = 8 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (filter === 'deals') {
      query.discount = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 8);
    const skip = (pageNum - 1) * limitNum;

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum) || 1,
      totalCount: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single product by ID (with embedded reviews)
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/products
// @desc    Create a product (Admin only)
const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      image,
      category,
      stock,
      description,
      isNewArrival,
      rating,
      numReviews,
      discount,
    } = req.body;

    const product = await Product.create({
      title,
      price: Number(price) || 0,
      image: image || '',
      category,
      stock: Number(stock) || 0,
      description,
      isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
      rating: Number(rating) || 0,
      numReviews: Number(numReviews) || 0,
      discount: Number(discount) || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const {
        title,
        price,
        image,
        category,
        stock,
        description,
        isNewArrival,
        rating,
        numReviews,
        discount,
      } = req.body;

      product.title = title !== undefined ? title : product.title;
      product.price = price !== undefined ? Number(price) : product.price;
      product.image = image !== undefined ? image : product.image;
      product.category = category !== undefined ? category : product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.description = description !== undefined ? description : product.description;
      product.isNewArrival = isNewArrival !== undefined ? Boolean(isNewArrival) : product.isNewArrival;
      product.rating = rating !== undefined ? Number(rating) : product.rating;
      product.numReviews = numReviews !== undefined ? Number(numReviews) : product.numReviews;
      product.discount = discount !== undefined ? Number(discount) : product.discount;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update product review
// @route   POST /api/products/:id/reviews
const createReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewedIndex = product.reviews.findIndex(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewedIndex > -1) {
        // Update review
        product.reviews[alreadyReviewedIndex].rating = Number(rating);
        product.reviews[alreadyReviewedIndex].comment = comment;
      } else {
        // Add new review
        product.reviews.push({
          user: req.user._id,
          name: req.user.name,
          rating: Number(rating),
          comment,
        });
      }

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({
        message: alreadyReviewedIndex > -1 ? 'Review updated!' : 'Review added!',
      });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check authorization: review author or admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    product.reviews.pull(req.params.reviewId);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        : 0;

    await product.save();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
  deleteReview,
};
