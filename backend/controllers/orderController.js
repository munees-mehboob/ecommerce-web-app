// 1. IMPORTANT: We import 'sequelize' from the models index to use its functions
const { Order, OrderItem, User, sequelize } = require('../models/index');
const { Op } = require('sequelize');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 */
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, city, postalCode, paymentMethod, totalPrice } = req.body;
    
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      userId: req.user.id, 
      shippingAddress,
      city,
      postalCode,
      paymentMethod,
      totalPrice,
    });

    const itemsWithOrderId = orderItems.map((item) => ({
      title: item.title,
      qty: item.qty,
      image: item.image,
      price: item.price,
      orderId: order.id,
      productId: item.id || item._id 
    }));
    
    await OrderItem.bulkCreate(itemsWithOrderId);
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
    const orders = await Order.findAll({
      where: { userId: req.user.id }, 
      include: [
         { model: User, attributes: ['id', 'name'] },
         { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']],
    });
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
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']],
    });
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
    const order = await Order.findByPk(req.params.id);
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
    const order = await Order.findByPk(req.params.id);

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
    const totalOrders = await Order.count();
    const totalUsers = await User.count({ where: { isAdmin: false } });
    const totalEarnings = await Order.sum('totalPrice') || 0;

    // Use a simple query for the chart to avoid MySQL strict errors
    const salesData = await Order.findAll({
      attributes: [
        [sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m-%d')"), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue'],
      ],
      group: ['date'], // Grouping by the alias is safer
      order: [['date', 'ASC']],
      limit: 7,
      raw: true 
    });

    res.json({
      stats: { totalOrders, totalUsers, totalEarnings: Number(totalEarnings) },
      chartData: salesData
    });
  } catch (error) {
    console.error("DEBUG ERROR:", error); // CHECK YOUR TERMINAL FOR THIS
    res.status(500).json({ message: 'Analytics Error' });
  }
};




module.exports = { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  updateOrderToDelivered, 
  updateOrderToPaid,
  getAdminStats 
};
