import { database } from "./database";

export async function addCategory(name: string) {
  await database.runAsync(
    "INSERT OR IGNORE INTO categories (name) VALUES (?)",
    [name],
  );
}

export async function addProduct({
  name,
  category_id,
  quantity,
  location,
  description,
}: {
  name: string;
  category_id: number;
  quantity?: number;
  location?: string;
  description?: string;
}) {
  await database.runAsync(
    `INSERT INTO products (name, category_id, quantity, location, description)
     VALUES (?, ?, ?, ?, ?)`,
    [name, category_id, quantity ?? 0, location ?? "", description ?? ""],
  );
}

export async function addTransaction({
  product_id,
  type,
  quantity,
  note,
}: {
  product_id: number;
  type: "IN" | "OUT";
  quantity: number;
  note?: string;
}) {
  await database.runAsync(
    `INSERT INTO transactions (product_id, type, quantity, note)
     VALUES (?, ?, ?, ?)`,
    [product_id, type, quantity, note ?? ""],
  );

  const factor = type === "IN" ? 1 : -1;
  await database.runAsync(
    `UPDATE products SET quantity = quantity + ? WHERE id = ?`,
    [factor * quantity, product_id],
  );
}

export async function getProductCountByCategory() {
  return await database.getAllAsync<{
    name: string;
    total: number;
  }>(
    `SELECT c.name, SUM(p.quantity) as total
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     GROUP BY c.name`,
  );
}
