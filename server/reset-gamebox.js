#!/usr/bin/env node

/**
 * Script to reset game boxes to use the correct winner distribution
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false
    }
);

async function resetGameBoxes() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connected successfully.');

        // Delete all existing game boxes
        const result = await sequelize.query(
            'DELETE FROM game_boxes',
            { type: Sequelize.QueryTypes.DELETE }
        );
        
        console.log('✅ All existing game boxes have been deleted.');
        console.log('📦 New game boxes will be created with the correct distribution:');
        console.log('   • $100: 1 winner');
        console.log('   • $20: 2 winners');
        console.log('   • $10: 5 winners');
        console.log('   • $5: 5 winners');
        console.log('   • $2: 48 winners');
        console.log('   • $1: 64 winners');
        console.log('   • Total: 125 winners (25% win rate)');
        console.log('   • Payout: $375 (75% return rate)');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

resetGameBoxes();