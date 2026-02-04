
import { sequelize } from '../src/models/sequelize/index.js';

async function addAvatarColumn() {
  try {
    console.log('Adding column avatar to users table...');
    
    // Attempt to add the column.
    // DataTypes.STRING(500) maps to VARCHAR(500)
    await sequelize.query("ALTER TABLE users ADD COLUMN avatar VARCHAR(500) DEFAULT NULL COMMENT 'URL ảnh đại diện';");
    
    console.log('Column avatar added successfully.');
    
    process.exit(0);
  } catch (error) {
    // Check for duplicate column error
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
         console.log('Column avatar already exists.');
         process.exit(0);
    }
    console.error('Add column error:', error);
    process.exit(1);
  }
}

addAvatarColumn();
