import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createDefaultState } from './defaultState.js';

dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

const baseConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
};

const adminPool = mysql.createPool(baseConfig);
const pool = mysql.createPool({
  ...baseConfig,
  database: process.env.MYSQL_DATABASE || 'health_food_assistant'
});

export async function initDatabase() {
  await adminPool.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE || 'health_food_assistant'}\``
  );
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(40) NOT NULL DEFAULT 'member',
      reset_token VARCHAR(255) DEFAULT NULL,
      reset_token_expires DATETIME DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_states (
      user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
      state_json JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_states_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ai_fallback_knowledge (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      input_keyword VARCHAR(255) NOT NULL,
      output_json JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_type_keyword (type, input_keyword)
    )
  `);

  // Initialize fallback knowledge if empty
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM ai_fallback_knowledge');
  if (rows[0].count === 0) {
    const fallbackData = [
      {
        type: 'symptoms',
        input_keyword: 'default',
        output_json: JSON.stringify({
          condition: 'General Fatigue or Mild Dehydration',
          severity: 'Low',
          duration: 'Variable',
          foods: ['Water-rich fruits (watermelon, cucumber)', 'Bone broth', 'Leafy greens'],
          avoid: ['High sodium foods', 'Excessive caffeine', 'Sugary drinks'],
          hydration: 'Increase water intake to at least 2.5-3 liters per day.',
          remedies: ['Rest', 'Electrolyte solution', 'Light stretching'],
          mealTiming: 'Eat smaller, frequent meals. Do not skip breakfast.',
          doctor: 'Consult a doctor if symptoms persist for more than 3-5 days or worsen.',
          bmiStatus: 'Unknown'
        })
      },
      {
        type: 'symptoms',
        input_keyword: 'headache',
        output_json: JSON.stringify({
          condition: 'Tension Headache or Dehydration',
          severity: 'Moderate',
          duration: 'Few hours to a day',
          foods: ['Bananas', 'Spicy foods (if sinus related)', 'Magnesium-rich foods like almonds'],
          avoid: ['Aged cheeses', 'Processed meats', 'Artificial sweeteners'],
          hydration: 'Drink 2 glasses of water immediately. Ensure consistent hydration.',
          remedies: ['Cold or warm compress', 'Rest in a dark room', 'Peppermint oil massage'],
          mealTiming: 'Maintain regular meal schedules to prevent blood sugar drops.',
          doctor: 'See a doctor if the headache is sudden and severe (thunderclap), or accompanied by fever/stiff neck.',
          bmiStatus: 'Unknown'
        })
      },
      {
        type: 'recipe',
        input_keyword: 'default',
        output_json: JSON.stringify({
          name: 'Healthy Mediterranean Bowl',
          prepTime: '15 mins',
          difficulty: 'Easy',
          calories: 450,
          storage: 'Store in airtight container for up to 3 days',
          reheating: 'Best served cold or at room temperature',
          ingredients: ['1 cup Quinoa', '1 cup Cherry Tomatoes', '1 Cucumber', '1/2 cup Feta Cheese', '2 tbsp Olive Oil', 'Lemon Juice'],
          steps: ['Cook quinoa according to package instructions.', 'Chop veggies finely.', 'Mix together with crumbled feta.', 'Drizzle olive oil and lemon juice, then toss well.']
        })
      },
      {
        type: 'recipe',
        input_keyword: 'vegan',
        output_json: JSON.stringify({
          name: 'Vegan Buddha Bowl',
          prepTime: '20 mins',
          difficulty: 'Easy',
          calories: 420,
          storage: 'Store in airtight container for up to 4 days',
          reheating: 'Microwave for 1-2 minutes',
          ingredients: ['1 cup Brown Rice', '1/2 cup Roasted Chickpeas', '1/2 Sweet Potato (diced)', '1 cup Kale', '2 tbsp Tahini Dressing'],
          steps: ['Cook brown rice.', 'Roast chickpeas and sweet potatoes at 400F for 15 mins.', 'Massage kale with a bit of olive oil.', 'Assemble bowl and drizzle with tahini dressing.']
        })
      },
      {
        type: 'recipe',
        input_keyword: 'keto',
        output_json: JSON.stringify({
          name: 'Keto Avocado Chicken Salad',
          prepTime: '10 mins',
          difficulty: 'Easy',
          calories: 550,
          storage: 'Store in fridge for up to 2 days. Avocado may brown.',
          reheating: 'Do not reheat. Serve cold.',
          ingredients: ['1 cup Cooked Chicken Breast (shredded)', '1 Large Avocado', '2 tbsp Mayo', '1 tbsp Lime Juice', 'Salt and Pepper to taste'],
          steps: ['Mash avocado in a bowl.', 'Mix in shredded chicken and mayo.', 'Add lime juice, salt, and pepper.', 'Stir until well combined and serve.']
        })
      },
      {
        type: 'checkFood',
        input_keyword: 'default',
        output_json: JSON.stringify({
          safe: true,
          quantity: 'Moderate',
          interactions: 'No major interactions.',
          explanation: 'This food is generally considered safe and healthy in moderate amounts.',
          alternatives: ['Fresh fruits', 'Vegetables', 'Whole grains'],
          benefits: ['Provides essential nutrients', 'Supports overall health']
        })
      },
      {
        type: 'scanFood',
        input_keyword: 'default',
        output_json: JSON.stringify({
          item: 'Generic Food Item',
          calories: 250,
          nutrition: 'Carbs: 30g, Protein: 10g, Fat: 8g',
          diseaseSafe: 'Generally safe. Monitor if diabetic (check sugar content).',
          healthier: 'Consider organic or whole-grain alternatives.'
        })
      },
      {
        type: 'weeklyPlan',
        input_keyword: 'vegan',
        output_json: JSON.stringify([
          { day: 'Monday', calories: 1800, breakfast: 'Tofu scramble', lunch: 'Quinoa and black bean salad', dinner: 'Sweet potato curry', badges: ['Vegan', 'High Protein'], shopping: ['Tofu', 'Quinoa', 'Black Beans', 'Sweet Potatoes'] },
          { day: 'Tuesday', calories: 1750, breakfast: 'Oatmeal with chia seeds', lunch: 'Lentil soup', dinner: 'Mushroom stir-fry', badges: ['Vegan', 'High Fiber'], shopping: ['Oats', 'Chia Seeds', 'Lentils', 'Mushrooms'] },
          { day: 'Wednesday', calories: 1900, breakfast: 'Smoothie bowl', lunch: 'Chickpea wrap', dinner: 'Eggplant pasta', badges: ['Vegan', 'Antioxidants'], shopping: ['Fruits', 'Chickpeas', 'Eggplant', 'Pasta'] },
          { day: 'Thursday', calories: 1850, breakfast: 'Avocado toast', lunch: 'Tomato soup', dinner: 'Tempeh tacos', badges: ['Vegan', 'Energy'], shopping: ['Avocado', 'Tomatoes', 'Tempeh', 'Taco Shells'] },
          { day: 'Friday', calories: 1950, breakfast: 'Pancakes (Flax egg)', lunch: 'Falafel salad', dinner: 'Cauliflower steaks', badges: ['Vegan', 'Omega 3'], shopping: ['Flaxseed', 'Falafel', 'Cauliflower'] },
          { day: 'Saturday', calories: 2000, breakfast: 'Fruit bowl', lunch: 'Veggie burger', dinner: 'Vegan pizza', badges: ['Vegan', 'Cheat Meal'], shopping: ['Fruits', 'Veggie Patties', 'Pizza Dough', 'Vegan Cheese'] },
          { day: 'Sunday', calories: 1800, breakfast: 'Almond yogurt', lunch: 'Pasta salad', dinner: 'Vegetable stew', badges: ['Vegan', 'Vitamins'], shopping: ['Almond Yogurt', 'Pasta', 'Mixed Veggies'] }
        ])
      },
      {
        type: 'weeklyPlan',
        input_keyword: 'keto',
        output_json: JSON.stringify([
          { day: 'Monday', calories: 1800, breakfast: 'Bacon and eggs', lunch: 'Chicken avocado salad', dinner: 'Steak with broccoli', badges: ['Keto', 'High Protein'], shopping: ['Bacon', 'Eggs', 'Chicken', 'Avocado', 'Steak', 'Broccoli'] },
          { day: 'Tuesday', calories: 1750, breakfast: 'Keto pancakes', lunch: 'Tuna salad lettuce wraps', dinner: 'Pork chops with asparagus', badges: ['Keto', 'Low Carb'], shopping: ['Almond Flour', 'Tuna', 'Lettuce', 'Pork Chops', 'Asparagus'] },
          { day: 'Wednesday', calories: 1900, breakfast: 'Sausage and spinach', lunch: 'Cauliflower rice bowl', dinner: 'Salmon with butter', badges: ['Keto', 'Healthy Fats'], shopping: ['Sausage', 'Spinach', 'Cauliflower', 'Salmon', 'Butter'] },
          { day: 'Thursday', calories: 1850, breakfast: 'Cheese omelet', lunch: 'Zucchini noodles with beef', dinner: 'Chicken thighs with green beans', badges: ['Keto', 'Iron Rich'], shopping: ['Cheese', 'Zucchini', 'Beef', 'Chicken Thighs', 'Green Beans'] },
          { day: 'Friday', calories: 1950, breakfast: 'Avocado boats', lunch: 'Egg salad', dinner: 'Shrimp scampi', badges: ['Keto', 'Omega 3'], shopping: ['Avocado', 'Eggs', 'Shrimp', 'Garlic'] },
          { day: 'Saturday', calories: 2000, breakfast: 'Keto waffles', lunch: 'Bunless burger', dinner: 'Ribeye steak', badges: ['Keto', 'Cheat Meal'], shopping: ['Keto Mix', 'Ground Beef', 'Ribeye'] },
          { day: 'Sunday', calories: 1800, breakfast: 'Macadamia porridge', lunch: 'Chicken wings', dinner: 'Lamb chops', badges: ['Keto', 'Energy'], shopping: ['Macadamia Nuts', 'Chicken Wings', 'Lamb Chops'] }
        ])
      },
      {
        type: 'weeklyPlan',
        input_keyword: 'fatigue',
        output_json: JSON.stringify([
          { day: 'Monday', calories: 1900, breakfast: 'Iron-fortified oatmeal', lunch: 'Spinach and chicken salad', dinner: 'Lentil soup with whole grain bread', badges: ['High Iron', 'Energy'], shopping: ['Oats', 'Spinach', 'Chicken', 'Lentils'] },
          { day: 'Tuesday', calories: 1850, breakfast: 'Greek yogurt with nuts', lunch: 'Quinoa bowl with sweet potato', dinner: 'Baked salmon and broccoli', badges: ['Omega-3', 'Sustained Energy'], shopping: ['Yogurt', 'Nuts', 'Quinoa', 'Salmon'] },
          { day: 'Wednesday', calories: 1950, breakfast: 'Smoothie with spinach and banana', lunch: 'Turkey and avocado wrap', dinner: 'Beef stir-fry', badges: ['Iron Rich', 'Hydrating'], shopping: ['Banana', 'Turkey', 'Avocado', 'Beef'] },
          { day: 'Thursday', calories: 1800, breakfast: 'Scrambled eggs with tomatoes', lunch: 'Tuna salad', dinner: 'Chicken thighs with green beans', badges: ['High Protein', 'B-Vitamins'], shopping: ['Eggs', 'Tuna', 'Chicken Thighs', 'Green Beans'] },
          { day: 'Friday', calories: 2000, breakfast: 'Chia seed pudding', lunch: 'Chicken noodle soup', dinner: 'Shrimp and asparagus', badges: ['Electrolytes', 'Light Meal'], shopping: ['Chia Seeds', 'Chicken Broth', 'Shrimp', 'Asparagus'] },
          { day: 'Saturday', calories: 1900, breakfast: 'Pancakes with berries', lunch: 'Veggie omelet', dinner: 'Roast chicken and carrots', badges: ['Antioxidants', 'Recovery'], shopping: ['Berries', 'Carrots', 'Whole Chicken'] },
          { day: 'Sunday', calories: 1850, breakfast: 'Avocado toast', lunch: 'Pasta salad with beans', dinner: 'Vegetable curry', badges: ['Complex Carbs', 'Vitamins'], shopping: ['Avocado', 'Bread', 'Beans', 'Curry Paste'] }
        ])
      },
      {
        type: 'weeklyPlan',
        input_keyword: 'headache',
        output_json: JSON.stringify([
          { day: 'Monday', calories: 1800, breakfast: 'Hydrating watermelon smoothie', lunch: 'Cucumber and feta salad', dinner: 'Baked salmon', badges: ['High Water', 'Magnesium'], shopping: ['Watermelon', 'Cucumber', 'Feta', 'Salmon'] },
          { day: 'Tuesday', calories: 1750, breakfast: 'Oatmeal with almonds', lunch: 'Spinach salad', dinner: 'Lentil soup', badges: ['Magnesium', 'Low Sodium'], shopping: ['Oats', 'Almonds', 'Spinach', 'Lentils'] },
          { day: 'Wednesday', calories: 1900, breakfast: 'Banana and peanut butter', lunch: 'Turkey wrap', dinner: 'Grilled chicken and broccoli', badges: ['Potassium', 'Stable Blood Sugar'], shopping: ['Banana', 'Peanut Butter', 'Turkey', 'Broccoli'] },
          { day: 'Thursday', calories: 1850, breakfast: 'Scrambled eggs', lunch: 'Tuna salad (no mayo)', dinner: 'Beef stir-fry with ginger', badges: ['Anti-inflammatory', 'Iron'], shopping: ['Eggs', 'Tuna', 'Beef', 'Ginger'] },
          { day: 'Friday', calories: 1950, breakfast: 'Avocado toast', lunch: 'Chicken broth', dinner: 'Shrimp tacos', badges: ['Hydrating', 'Omega 3'], shopping: ['Avocado', 'Bread', 'Chicken Broth', 'Shrimp'] },
          { day: 'Saturday', calories: 2000, breakfast: 'Yogurt with berries', lunch: 'Veggie burger', dinner: 'Roast chicken', badges: ['Antioxidants', 'Balanced'], shopping: ['Yogurt', 'Berries', 'Veggie Patties'] },
          { day: 'Sunday', calories: 1800, breakfast: 'Fruit salad', lunch: 'Pasta salad', dinner: 'Vegetable curry', badges: ['Hydrating', 'Vitamins'], shopping: ['Fruits', 'Pasta', 'Curry Paste', 'Mixed Veggies'] }
        ])
      },
      {
        type: 'weeklyPlan',
        input_keyword: 'default',
        output_json: JSON.stringify([
          { day: 'Monday', calories: 1800, breakfast: 'Oatmeal with berries', lunch: 'Grilled chicken salad', dinner: 'Baked salmon with asparagus', badges: ['High Protein', 'Heart Healthy'], shopping: ['Oats', 'Berries', 'Chicken', 'Salmon', 'Asparagus'] },
          { day: 'Tuesday', calories: 1750, breakfast: 'Greek yogurt', lunch: 'Quinoa bowl', dinner: 'Lentil soup', badges: ['Vegetarian', 'Gut Friendly'], shopping: ['Greek Yogurt', 'Quinoa', 'Lentils', 'Veggies'] },
          { day: 'Wednesday', calories: 1900, breakfast: 'Smoothie bowl', lunch: 'Turkey wrap', dinner: 'Stir-fried tofu', badges: ['Low Carb', 'Antioxidants'], shopping: ['Turkey', 'Tofu', 'Spinach', 'Wrap'] },
          { day: 'Thursday', calories: 1850, breakfast: 'Eggs and spinach', lunch: 'Tuna salad', dinner: 'Beef stir-fry', badges: ['Iron Rich', 'Energy'], shopping: ['Eggs', 'Tuna', 'Beef', 'Broccoli'] },
          { day: 'Friday', calories: 1950, breakfast: 'Avocado toast', lunch: 'Chicken soup', dinner: 'Shrimp tacos', badges: ['Omega 3', 'Immunity'], shopping: ['Avocado', 'Bread', 'Shrimp', 'Taco Shells'] },
          { day: 'Saturday', calories: 2000, breakfast: 'Pancakes', lunch: 'Veggie burger', dinner: 'Roast chicken', badges: ['Cheat Meal', 'High Fiber'], shopping: ['Pancake Mix', 'Veggie Patties', 'Whole Chicken'] },
          { day: 'Sunday', calories: 1800, breakfast: 'Fruit salad', lunch: 'Pasta salad', dinner: 'Vegetable curry', badges: ['Vegan', 'Vitamins'], shopping: ['Fruits', 'Pasta', 'Curry Paste', 'Mixed Veggies'] }
        ])
      }
    ];

    for (const item of fallbackData) {
      await pool.query(
        'INSERT INTO ai_fallback_knowledge (type, input_keyword, output_json) VALUES (?, ?, ?)',
        [item.type, item.input_keyword, item.output_json]
      );
    }
  }
}

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function getOrCreateState(userId, profile = {}) {
  const rows = await query('SELECT state_json FROM user_states WHERE user_id = ?', [userId]);
  if (rows.length) {
    return typeof rows[0].state_json === 'string' ? JSON.parse(rows[0].state_json) : rows[0].state_json;
  }

  const state = createDefaultState(profile);
  await query('INSERT INTO user_states (user_id, state_json) VALUES (?, ?)', [userId, JSON.stringify(state)]);
  return state;
}

export async function saveState(userId, state) {
  await query(
    `INSERT INTO user_states (user_id, state_json)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE state_json = VALUES(state_json)`,
    [userId, JSON.stringify(state)]
  );
  return state;
}
