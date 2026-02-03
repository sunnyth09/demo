
import { sequelize } from '../src/models/sequelize/index.js';
import { Review } from '../src/models/sequelize/index.js';

async function fixData() {
  try {
    console.log('Fixing NULL is_hidden values...');
    // Update all reviews where is_hidden is NULL to false
    await sequelize.query("UPDATE reviews SET is_hidden = false WHERE is_hidden IS NULL");
    
    console.log('Fixed data successfully.');
    
    // Check data
    const reviews = await Review.findAll();
    console.log('Total reviews:', reviews.length);
    console.log('Review data:', JSON.stringify(reviews, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Fix error:', error);
    process.exit(1);
  }
}

fixData();
