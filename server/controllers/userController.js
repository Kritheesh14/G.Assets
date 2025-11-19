// server/controllers/userController.js
const User = require('../models/User');

// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/me
exports.updateMe = async (req, res) => {
  try {
    // only allow these fields to be updated from the profile page
    const allowedFields = ['fullName', 'email', 'bio', 'website', 'avatarUrl', 'engines'];

    const update = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        update[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json(user);
  } catch (err) {
    console.error('UpdateMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
