const mongoose = require('mongoose');
const CategoryCard = require('../models/categoryCardModel');

exports.getAllCategoryCards = async (req, res) => {
  try {
    const { adminID } = req.params;
    console.log('Fetching category cards for adminID:', adminID);
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.log('Invalid adminID format:', adminID);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const categoryCards = await CategoryCard.find({
      adminID: new mongoose.Types.ObjectId(adminID),
    })
      .sort({ createdAt: -1 })
      .lean();
    console.log('Found category cards:', categoryCards);
    res.status(200).json({
      message: 'Category cards fetched successfully',
      data: categoryCards,
      count: categoryCards.length,
    });
  } catch (error) {
    console.error(`Error fetching category cards: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching category cards', error: error.message });
  }
};

exports.createCategoryCard = async (req, res) => {
  try {
    const { categoryCard, description, adminID } = req.body;
    console.log('Creating category card with payload:', { categoryCard, description, adminID });

    // Validate input
    if (!categoryCard || !adminID) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'Category card name and adminID are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.log('Invalid adminID format:', adminID);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    // Create new category card
    const newCategoryCard = new CategoryCard({
      categoryCard,
      description: description || '',
      adminID: new mongoose.Types.ObjectId(adminID),
    });

    // Save to database
    const savedCategoryCard = await newCategoryCard.save();
    console.log('Category card saved:', savedCategoryCard);

    res.status(201).json({
      message: 'Category card created successfully',
      data: savedCategoryCard,
    });
  } catch (error) {
    console.error('Error creating category card:', error.message, error.stack);
    res.status(500).json({ message: 'Server error while creating category card', error: error.message });
  }
};

exports.updateCategoryCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryCard, description, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const existingCategoryCard = await CategoryCard.findOne({
      categoryCard: { $regex: `^${categoryCard}$`, $options: 'i' },
      adminID: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: new mongoose.Types.ObjectId(id) },
    });
    if (existingCategoryCard) {
      return res.status(400).json({ message: 'Category card with this name already exists' });
    }
    const updatedCategoryCard = await CategoryCard.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), adminID: new mongoose.Types.ObjectId(adminID) },
      { categoryCard, description: description || '' },
      { new: true, runValidators: true }
    );
    if (!updatedCategoryCard) {
      return res.status(404).json({ message: 'Category card not found' });
    }
    res.status(200).json({ message: 'Category card updated successfully', data: updatedCategoryCard });
  } catch (error) {
    console.error(`Error updating category card: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating category card', error: error.message });
  }
};

exports.deleteCategoryCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const categoryCard = await CategoryCard.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      adminID: new mongoose.Types.ObjectId(adminID),
    });
    if (!categoryCard) {
      return res.status(404).json({ message: 'Category card not found' });
    }
    res.status(200).json({ message: 'Category card deleted successfully' });
  } catch (error) {
    console.error(`Error deleting category card: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting category card', error: error.message });
  }
};

exports.searchCategoryCards = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { searchQuery } = req.query;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const query = { adminID: new mongoose.Types.ObjectId(adminID) };

    if (searchQuery && typeof searchQuery === 'string') {
      query.$or = [
        { categoryCard: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const categoryCards = await CategoryCard.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: 'Category cards fetched successfully',
      data: categoryCards,
      count: categoryCards.length,
    });
  } catch (error) {
    console.error(`Error searching category cards: ${error.message}`);
    res.status(500).json({ message: 'Server error while searching category cards', error: error.message });
  }
};