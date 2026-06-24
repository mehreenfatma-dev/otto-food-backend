require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const MenuItem = require('./models/MenuItem');

const menuItems = [
    {
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, onions, and our special sauce',
        price: 8.99,
        category: 'burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
    },
    {
        name: 'Cheese Burger',
        description: 'Double beef patty loaded with melted cheddar cheese',
        price: 10.99,
        category: 'burger',
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400'
    },
    {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil on crispy crust',
        price: 12.99,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400'
    },
    {
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni and extra cheese',
        price: 14.99,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'
    },
    {
        name: 'Chicken Sandwich',
        description: 'Grilled chicken breast with mayo, lettuce, and tomato',
        price: 7.99,
        category: 'sandwich',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400'
    },
    {
        name: 'Club Sandwich',
        description: 'Triple-decker with turkey, bacon, lettuce, and tomato',
        price: 9.99,
        category: 'sandwich',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'
    },
    {
        name: 'French Fries',
        description: 'Crispy golden fries with your choice of dipping sauce',
        price: 4.99,
        category: 'side',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'
    },
    {
        name: 'Onion Rings',
        description: 'Beer-battered crispy onion rings',
        price: 5.99,
        category: 'side',
        image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400'
    },
    {
        name: 'Coca Cola',
        description: 'Refreshing cold Coca Cola',
        price: 2.99,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'
    },
    {
        name: 'Lemonade',
        description: 'Fresh squeezed lemonade',
        price: 3.99,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe1f2c?w=400'
    },
    {
        name: 'Chocolate Brownie',
        description: 'Warm chocolate brownie with vanilla ice cream',
        price: 6.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400'
    },
    {
        name: 'Apple Pie',
        description: 'Classic apple pie with cinnamon',
        price: 5.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400'
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing menu items
        await MenuItem.deleteMany({});
        console.log('🗑️  Cleared existing menu items');

        // Insert new menu items
        const items = await MenuItem.insertMany(menuItems);
        console.log(`✅ Successfully seeded ${items.length} menu items`);

        console.log('\n📋 Menu Items:');
        items.forEach(item => {
            console.log(`   - ${item.name} ($${item.price}) [${item.category}]`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
