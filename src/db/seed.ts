import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, menuItems } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding database...");

  const categoryData = [
    {
      name: "Pakistani Cuisine",
      slug: "pakistani-cuisine",
      description: "Traditional Pakistani dishes with royal flavors",
      displayOrder: 1,
    },
    {
      name: "Fast Food",
      slug: "fast-food",
      description: "Pizza, burgers, and fried chicken",
      displayOrder: 2,
    },
    {
      name: "Drinks & Sides",
      slug: "drinks-sides",
      description: "Refreshing beverages and side dishes",
      displayOrder: 3,
    },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();

  const pakistaniCategory = insertedCategories.find(
    (c: { slug: string }) => c.slug === "pakistani-cuisine"
  );
  const fastFoodCategory = insertedCategories.find(
    (c: { slug: string }) => c.slug === "fast-food"
  );
  const drinksCategory = insertedCategories.find(
    (c: { slug: string }) => c.slug === "drinks-sides"
  );

  if (!pakistaniCategory || !fastFoodCategory || !drinksCategory) {
    throw new Error("Failed to insert categories");
  }

  const menuItemData = [
    {
      categoryId: pakistaniCategory.id,
      name: "Chicken Biryani",
      description: "Fragrant basmati rice layered with tender chicken, aromatic spices, and saffron",
      price: "650",
      isSpicy: true,
      isVegetarian: false,
    },
    {
      categoryId: pakistaniCategory.id,
      name: "Mutton Biryani",
      description: "Premium mutton slow-cooked with basmati rice and royal spices",
      price: "850",
      isSpicy: true,
      isVegetarian: false,
    },
    {
      categoryId: pakistaniCategory.id,
      name: "Chicken Karahi",
      description: "Wok-tossed chicken in a rich tomato-based gravy with green chilies",
      price: "750",
      isSpicy: true,
      isVegetarian: false,
    },
    {
      categoryId: pakistaniCategory.id,
      name: "Mutton Nihari",
      description: "Slow-cooked mutton stew, tender and rich, served with fresh naan",
      price: "900",
      isSpicy: true,
      isVegetarian: false,
    },
    {
      categoryId: pakistaniCategory.id,
      name: "Seekh Kebab (6 pcs)",
      description: "Minced lamb kebabs grilled over charcoal, seasoned with traditional spices",
      price: "550",
      isSpicy: false,
      isVegetarian: false,
    },
    {
      categoryId: pakistaniCategory.id,
      name: "Butter Chicken",
      description: "Tender chicken pieces in a creamy, mildly spiced tomato gravy",
      price: "700",
      isSpicy: false,
      isVegetarian: false,
    },
    {
      categoryId: pakistaniCategory.id,
      name: "Palak Paneer",
      description: "Fresh spinach curry with cubes of cottage cheese, mildly spiced",
      price: "550",
      isSpicy: false,
      isVegetarian: true,
    },
    {
      categoryId: pakistaniCategory.id,
      name: "Dal Makhani",
      description: "Creamy black lentils slow-cooked overnight with butter and spices",
      price: "400",
      isSpicy: false,
      isVegetarian: true,
    },
    {
      categoryId: fastFoodCategory.id,
      name: "Chicken Tikka Pizza",
      description: "Hand-tossed pizza topped with chicken tikka, onions, peppers, and mozzarella",
      price: "950",
      isSpicy: true,
      isVegetarian: false,
    },
    {
      categoryId: fastFoodCategory.id,
      name: "Classic Cheeseburger",
      description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
      price: "450",
      isSpicy: false,
      isVegetarian: false,
    },
    {
      categoryId: fastFoodCategory.id,
      name: "Zinger Burger",
      description: "Crispy fried chicken fillet with mayo and pickles in a toasted bun",
      price: "480",
      isSpicy: false,
      isVegetarian: false,
    },
    {
      categoryId: fastFoodCategory.id,
      name: "Fried Chicken (8 pcs)",
      description: "Golden crispy fried chicken pieces, marinated for 24 hours",
      price: "1200",
      isSpicy: false,
      isVegetarian: false,
    },
    {
      categoryId: fastFoodCategory.id,
      name: "Loaded Fries",
      description: "Crispy fries topped with cheese sauce, jalapeños, and sour cream",
      price: "350",
      isSpicy: true,
      isVegetarian: true,
    },
    {
      categoryId: fastFoodCategory.id,
      name: "Pepperoni Pizza",
      description: "Classic pepperoni pizza with mozzarella cheese and tomato sauce",
      price: "1100",
      isSpicy: false,
      isVegetarian: false,
    },
    {
      categoryId: drinksCategory.id,
      name: "Mango Lassi",
      description: "Creamy yogurt blended with fresh mango pulp, served chilled",
      price: "200",
      isSpicy: false,
      isVegetarian: true,
    },
    {
      categoryId: drinksCategory.id,
      name: "Salted Lassi",
      description: "Traditional salted yogurt drink, refreshing and cooling",
      price: "150",
      isSpicy: false,
      isVegetarian: true,
    },
    {
      categoryId: drinksCategory.id,
      name: "Raita",
      description: "Cool yogurt with cucumber and mint, perfect with spicy dishes",
      price: "100",
      isSpicy: false,
      isVegetarian: true,
    },
    {
      categoryId: drinksCategory.id,
      name: "Naan (2 pcs)",
      description: "Fresh tandoor-baked naan bread, soft and fluffy",
      price: "80",
      isSpicy: false,
      isVegetarian: true,
    },
  ];

  await db.insert(menuItems).values(menuItemData);

  console.log("Seed completed successfully!");
  console.log(`Inserted ${insertedCategories.length} categories`);
  console.log(`Inserted ${menuItemData.length} menu items`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
