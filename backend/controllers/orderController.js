const { Order, Product, User } = require('../models/index');

/**
 * @desc    Create new order with server-side price calculation & stock verification
 * @route   POST /api/orders
 */
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      city,
      postalCode,
      phone,
      paymentMethod,
      isPaid,
      transactionId,
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!shippingAddress || !city || !postalCode) {
      return res.status(400).json({ message: 'Shipping address, city, and postal code are required' });
    }

    // 1. Fetch all products from DB to verify stock and calculate authoritative price
    let calculatedTotalPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const productId = item.id || item._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.title || productId}` });
      }

      const qty = Number(item.qty) || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}, requested: ${qty}`,
        });
      }

      // Decrement stock
      product.stock -= qty;
      await product.save();

      const itemPrice = Number(product.price);
      calculatedTotalPrice += itemPrice * qty;

      verifiedOrderItems.push({
        title: product.title,
        qty,
        image: product.image,
        price: itemPrice,
        product: product._id,
      });
    }

    // 2. Create the Order with server-verified total
    const isOrderPaid = Boolean(isPaid);
    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      city,
      postalCode,
      phone: phone || '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      totalPrice: Number(calculatedTotalPrice.toFixed(2)),
      isPaid: isOrderPaid,
      paidAt: isOrderPaid ? new Date() : null,
      transactionId: transactionId || '',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 */
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 */
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get Admin Dashboard Stats & Sales Chart Data
 * @route   GET /api/orders/stats
 */
const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalProducts = await Product.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalEarnings = revenueResult.length > 0 ? revenueResult[0].totalEarnings : 0;

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $project: { date: '$_id', revenue: 1, _id: 0 } },
      { $sort: { date: 1 } },
      { $limit: 7 },
    ]);

    res.json({
      stats: { totalOrders, totalUsers, totalProducts, totalEarnings: Number(totalEarnings) },
      chartData: salesData,
    });
  } catch (error) {
    console.error('DEBUG ERROR:', error);
    res.status(500).json({ message: 'Analytics Error' });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
  getAdminStats,
};
