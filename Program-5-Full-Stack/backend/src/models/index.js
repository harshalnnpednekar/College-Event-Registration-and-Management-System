/**
 * Sequelize ORM Configuration & Model Associations for PostgreSQL
 * Database: PostgreSQL exclusively (No MongoDB/Mongoose)
 */

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/college_events';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? false : false,
  dialectOptions: process.env.DATABASE_SSL === 'true' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

// 1. User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// 2. Event Model
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('Technical', 'Cultural', 'Workshop', 'Sports', 'Seminar'),
    allowNull: false
  },
  venue: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  available_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  status: {
    type: DataTypes.ENUM('Open', 'Fast Filling', 'Closed'),
    defaultValue: 'Open',
    allowNull: false
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// 3. Registration Model (Junction Table with Unique Constraint)
const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id'
    }
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed',
    allowNull: false
  }
}, {
  tableName: 'registrations',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'event_id']
    }
  ]
});

// Relationships
User.hasMany(Registration, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Registration.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(Registration, { foreignKey: 'event_id', onDelete: 'CASCADE' });
Registration.belongsTo(Event, { foreignKey: 'event_id' });

User.belongsToMany(Event, { through: Registration, foreignKey: 'user_id', otherKey: 'event_id' });
Event.belongsToMany(User, { through: Registration, foreignKey: 'event_id', otherKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Event,
  Registration
};
