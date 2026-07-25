import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { categories, menuItems, chefs } from "./schema";

const dbSql = neon(process.env.DATABASE_URL!);
const db = drizzle(dbSql);

async function seed() {
  console.log("Seeding database...");

  const chefData = [
    {
      name: "Chef Ahmed",
      role: "Head Chef",
      bio: "With over 20 years of experience in traditional Pakistani cuisine, Chef Ahmed brings unmatched expertise in biryani, karahi, and nihari preparation.",
      imageUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
      displayOrder: 1,
      isAvailable: true,
    },
    {
      name: "Chef Ali",
      role: "Grill Specialist",
      bio: "Master of charcoal grilling and kebab preparation, Chef Ali ensures every seekh kebab and chapli kebab is perfectly cooked.",
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
      displayOrder: 2,
      isAvailable: true,
    },
    {
      name: "Chef Fatima",
      role: "Dessert Chef",
      bio: "Creates delightful traditional Pakistani sweets and desserts including kheer, gulab jamun, and jalebi with authentic recipes.",
      imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
      displayOrder: 3,
      isAvailable: true,
    },
    {
      name: "Chef Muhammad",
      role: "Pasta & Pizza Chef",
      bio: "Brings Italian flair to our kitchen with expert wood-fired pizza and pasta creations made from fresh, locally sourced ingredients.",
      imageUrl: "https://images.unsplash.com/photo-1583394293214-28ad4a0f1b0a?w=400&q=80",
      displayOrder: 4,
      isAvailable: true,
    },
    {
      name: "Chef Zain",
      role: "Sauce & Marinade Expert",
      bio: "Specializes in crafting signature marinades and sauces that give our dishes their unique and bold flavors.",
      imageUrl: "https://images.unsplash.com/photo-1603382313337-629a475860ab?w=400&q=80",
      displayOrder: 5,
      isAvailable: false,
    },
    {
      name: "Chef Sara",
      role: "Pastry Chef",
      bio: "Creates delicious baked goods, fresh naan, and artisan breads using traditional techniques and modern baking methods.",
      imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
      displayOrder: 6,
      isAvailable: true,
    },
  ];

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

  const categoryInsert = db.insert(categories).values(categoryData).onConflictDoNothing();
  await categoryInsert;

  const existingCategories = await db.select().from(categories);

  const pakistaniCategory = existingCategories.find(
    (c) => c.slug === "pakistani-cuisine"
  );
  const fastFoodCategory = existingCategories.find(
    (c) => c.slug === "fast-food"
  );
  const drinksCategory = existingCategories.find(
    (c) => c.slug === "drinks-sides"
  );

  if (!pakistaniCategory || !fastFoodCategory || !drinksCategory) {
    throw new Error("Failed to find categories");
  }

  const chefInsert = db.insert(chefs).values(chefData).onConflictDoUpdate({
    target: chefs.name,
    set: {
      role: sql`excluded.role`,
      bio: sql`excluded.bio`,
      imageUrl: sql`excluded.image_url`,
      displayOrder: sql`excluded.display_order`,
      isAvailable: sql`excluded.is_available`,
    },
  });
  await chefInsert;

  const existingMenuItems = await db.select().from(menuItems);
  if (existingMenuItems.length === 0) {
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
  }

  console.log("Seed completed successfully!");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});