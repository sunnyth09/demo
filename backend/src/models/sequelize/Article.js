import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'), // For HTML content
    allowNull: true,
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'articles',
  timestamps: true, // createdAt, updatedAt
});

export default Article;
