import { db } from "./src/config/db.js";

async function seedCategories() {
  try {
    console.log("Seeding categories...");
    
    // Clear existing categories
    await db.query("DELETE FROM categories");
    // Reset AUTO_INCREMENT (optional, varies by DB)
    await db.query("ALTER TABLE categories AUTO_INCREMENT = 1");

    // Level 1
    const [res1] = await db.query("INSERT INTO categories(name, icon, parent_id) VALUES(?, ?, ?)", ['Sách Trong Nước', 'book', null]);
    const id1 = res1.insertId;
    
    const [res2] = await db.query("INSERT INTO categories(name, icon, parent_id) VALUES(?, ?, ?)", ['Foreign Books', 'globe', null]);
    const id2 = res2.insertId;

    const [res3] = await db.query("INSERT INTO categories(name, icon, parent_id) VALUES(?, ?, ?)", ['VPP - Học Sinh', 'pencil', null]);
    const id3 = res3.insertId;

    const [res4] = await db.query("INSERT INTO categories(name, icon, parent_id) VALUES(?, ?, ?)", ['Đồ Chơi', 'puzzle', null]);
    const id4 = res4.insertId;

    // Level 2 - Sách Trong Nước
    const [res1_1] = await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Văn Học', id1]);
    const id1_1 = res1_1.insertId;

    const [res1_2] = await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Kinh Tế', id1]);
    const id1_2 = res1_2.insertId;
    
    const [res1_3] = await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Tâm Lý - Kỹ Năng Sống', id1]);
    const id1_3 = res1_3.insertId;

    // Level 3 - Văn Học
    await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Tiểu Thuyết', id1_1]);
    await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Truyện Ngắn', id1_1]);
    await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Ngôn Tình', id1_1]);
    
    // Level 3 - Kinh Tế
    await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Bài Học Kinh Doanh', id1_2]);
    await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Quản Trị', id1_2]);

    // Level 2 - Foreign Books
    const [res2_1] = await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Fiction', id2]);
    const id2_1 = res2_1.insertId;
    
    const [res2_2] = await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Non-Fiction', id2]);
    const id2_2 = res2_2.insertId;

    // Level 3 - Fiction
    await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Contemporary', id2_1]);
    await db.query("INSERT INTO categories(name, parent_id) VALUES(?, ?)", ['Thriller', id2_1]);

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedCategories();
