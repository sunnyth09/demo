
import { sequelize } from '../src/models/sequelize/index.js';

async function addColumn() {
  try {
    console.log('Adding column is_hidden...');
    
    // Check if column exists first to avoid error
    // But simplest is just try to add it.
    
    await sequelize.query("ALTER TABLE reviews ADD COLUMN is_hidden BOOLEAN DEFAULT false;");
    
    console.log('Column added successfully.');
    
    // Also update existing records just in case
    await sequelize.query("UPDATE reviews SET is_hidden = false WHERE is_hidden IS NULL;");
    
    process.exit(0);
  } catch (error) {
    // Ignore error if column already exists (duplicate column name)
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
         console.log('Column already exists.');
         process.exit(0);
    }
    console.error('Add column error:', error);
    process.exit(1);
  }
}

addColumn();
