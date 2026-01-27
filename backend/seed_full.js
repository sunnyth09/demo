import { db } from "./src/config/db.js";

async function seedFull() {
  try {
    console.log("Seeding started...");

    // 1. Clear tables
    console.log("Clearing existing data...");
    await db.query("DELETE FROM products");
    await db.query("DELETE FROM categories");
    await db.query("ALTER TABLE categories AUTO_INCREMENT = 1");
    await db.query("ALTER TABLE products AUTO_INCREMENT = 1");

    // 2. Seed Categories
    console.log("Seeding categories...");
    
    // Arrays to store IDs
    const categoryIds = {};

    // Helper to insert category and store ID
    async function insertCat(name, icon, parentId = null) {
      const [res] = await db.query("INSERT INTO categories(name, icon, parent_id) VALUES(?, ?, ?)", [name, icon, parentId]);
      return res.insertId;
    }

    // --- Level 1 ---
    const idVN = await insertCat('Sách Trong Nước', 'book', null);
    const idForeign = await insertCat('Sách Nước Ngoài', 'globe', null);
    const idVPP = await insertCat('VPP - Học Sinh', 'pencil', null);
    const idToys = await insertCat('Đồ Chơi', 'puzzle-piece', null);

    // --- Level 2 (VN) ---
    const idVN_VanHoc = await insertCat('Văn Học', null, idVN);
    const idVN_KinhTe = await insertCat('Kinh Tế', null, idVN);
    const idVN_ThieuNhi = await insertCat('Thiếu Nhi', null, idVN);
    const idVN_KyNang = await insertCat('Kỹ Năng Sống', null, idVN);
    const idVN_GiaoKhoa = await insertCat('Sách Giáo Khoa', null, idVN);
    const idVN_NgoaiNgu = await insertCat('Sách Ngoại Ngữ', null, idVN);

    // --- Level 2 (Foreign) ---
    const idF_Fiction = await insertCat('Văn Học', null, idForeign);
    const idF_NonFiction = await insertCat('Phi Hư Cấu', null, idForeign);
    const idF_Children = await insertCat('Sách Thiếu Nhi', null, idForeign);
    const idF_Academic = await insertCat('Giáo Trình & Học Thuật', null, idForeign);

    // --- Level 2 (VPP) ---
    const idVPP_But = await insertCat('Bút & Mực', null, idVPP);
    const idVPP_So = await insertCat('Sổ Tay', null, idVPP);
    const idVPP_DungCu = await insertCat('Dụng Cụ Học Sinh', null, idVPP);

    // --- Level 3 (VN - Văn Học) ---
    categoryIds.vn_tieuthuyet = await insertCat('Tiểu Thuyết', null, idVN_VanHoc);
    categoryIds.vn_truyenngan = await insertCat('Truyện Ngắn', null, idVN_VanHoc);
    categoryIds.vn_tho = await insertCat('Thơ', null, idVN_VanHoc);
    categoryIds.vn_trinhtham = await insertCat('Trinh Thám', null, idVN_VanHoc);
    categoryIds.vn_kiemhiep = await insertCat('Kiếm Hiệp', null, idVN_VanHoc);
    categoryIds.vn_ngontinh = await insertCat('Ngôn Tình', null, idVN_VanHoc);

    // --- Level 3 (VN - Kinh Tế) ---
    categoryIds.vn_quantri = await insertCat('Quản Trị - Lãnh Đạo', null, idVN_KinhTe);
    categoryIds.vn_marketing = await insertCat('Marketing - Bán Hàng', null, idVN_KinhTe);
    categoryIds.vn_taichinh = await insertCat('Tài Chính - Đầu Tư', null, idVN_KinhTe);
    categoryIds.vn_khoinghiep = await insertCat('Khởi Nghiệp', null, idVN_KinhTe);
    categoryIds.vn_nhanvat = await insertCat('Nhân Vật - Bài Học', null, idVN_KinhTe);

    // --- Level 3 (VN - Thiếu Nhi) ---
    categoryIds.vn_truyentranh = await insertCat('Truyện Tranh', null, idVN_ThieuNhi);
    categoryIds.vn_vhvc = await insertCat('Vừa Học Vừa Chơi', null, idVN_ThieuNhi);
    categoryIds.vn_kienthuc = await insertCat('Kiến Thức Bách Khoa', null, idVN_ThieuNhi);
    categoryIds.vn_vanhoc_tn = await insertCat('Văn Học Thiếu Nhi', null, idVN_ThieuNhi);

    // --- Level 3 (Foreign - Fiction) ---
    categoryIds.f_contemporary = await insertCat('Văn Học Đương Đại', null, idF_Fiction);
    categoryIds.f_thriller = await insertCat('Trinh Thám & Ly Kỳ', null, idF_Fiction);
    categoryIds.f_scifi = await insertCat('Khoa Học Viễn Tưởng & Fantasy', null, idF_Fiction);
    categoryIds.f_romance = await insertCat('Lãng Mạn', null, idF_Fiction);
    categoryIds.f_classics = await insertCat('Cổ Điển', null, idF_Fiction);

    // --- Level 3 (Foreign - Non-Fiction) ---
    categoryIds.f_business = await insertCat('Kinh Doanh', null, idF_NonFiction);
    categoryIds.f_selfhelp = await insertCat('Kỹ Năng Sống', null, idF_NonFiction);
    categoryIds.f_biography = await insertCat('Tiểu Sử & Hồi Ký', null, idF_NonFiction);
    categoryIds.f_history = await insertCat('Lịch Sử', null, idF_NonFiction);

    console.log("Categories seeded successfully.");

    // 3. Seed Products (50 items)
    console.log("Seeding products...");

    const products = [
      // --- VN Văn Học ---
      {
        name: "Dế Mèn Phiêu Lưu Ký",
        category_id: categoryIds.vn_vanhoc_tn,
        price: 50000,
        author: "Tô Hoài",
        publisher: "NXB Kim Đồng",
        thumbnail: "https://upload.wikimedia.org/wikipedia/vi/8/8c/De_men_phieu_luu_ky.jpg",
        description: "Câu chuyện phiêu lưu của chú dế mèn, bài học về tình bạn và lòng dũng cảm."
      },
      {
        name: "Số Đỏ",
        category_id: categoryIds.vn_tieuthuyet,
        price: 85000,
        author: "Vũ Trọng Phụng",
        publisher: "NXB Văn Học",
        thumbnail: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1606138612i/55986968.jpg",
        description: "Kiệt tác châm biếm sâu cay về xã hội Việt Nam thời giao thời."
      },
      {
        name: "Tắt Đèn",
        category_id: categoryIds.vn_tieuthuyet,
        price: 60000,
        author: "Ngô Tất Tố",
        publisher: "NXB Văn Học",
        thumbnail: "https://upload.wikimedia.org/wikipedia/vi/1/1d/Tat_den.jpg",
        description: "Bức tranh chân thực về nỗi thống khổ của người nông dân Việt Nam trước 1945."
      },
      {
        name: "Chí Phèo",
        category_id: categoryIds.vn_truyenngan,
        price: 55000,
        author: "Nam Cao",
        publisher: "NXB Văn Học",
        thumbnail: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1353383098l/16156578.jpg",
        description: "Bi kịch của người nông dân bị tha hóa trong xã hội cũ."
      },
      {
        name: "Mắt Biếc",
        category_id: categoryIds.vn_ngontinh,
        price: 110000,
        author: "Nguyễn Nhật Ánh",
        publisher: "NXB Trẻ",
        thumbnail: "https://upload.wikimedia.org/wikipedia/vi/9/91/Mat_biec.jpg",
        description: "Câu chuyện tình buồn và đẹp của Ngạn và Hà Lan."
      },
      {
        name: "Kính Vạn Hoa (Bộ)",
        category_id: categoryIds.vn_vanhoc_tn,
        price: 500000,
        author: "Nguyễn Nhật Ánh",
        publisher: "NXB Kim Đồng",
        thumbnail: "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/kinh_van_hoa_phien_ban_45_nam_tap_1/2020_08_07_11_22_19_1-390x510.jpg",
        description: "Những câu chuyện học trò tinh nghịch, hồn nhiên và đầy màu sắc."
      },
      {
        name: "Tuổi Thơ Dữ Dội",
        category_id: categoryIds.vn_tieuthuyet,
        price: 135000,
        author: "Phùng Quán",
        publisher: "NXB Kim Đồng",
        thumbnail: "https://cdn0.fahasa.com/media/catalog/product/t/u/tuoi-tho-du-doi-tap-1-tai-ban-2019.jpg",
        description: "Khúc tráng ca về những chiến sĩ nhỏ tuổi trong cuộc kháng chiến chống Pháp."
      },
      {
        name: "Đất Rừng Phương Nam",
        category_id: categoryIds.vn_tieuthuyet,
        price: 95000,
        author: "Đoàn Giỏi",
        publisher: "NXB Kim Đồng",
        thumbnail: "https://salt.tikicdn.com/cache/w1200/ts/product/7d/50/e0/7594cd394b83a005080076bf228df41c.jpg",
        description: "Hành trình khám phá vùng đất phương Nam trù phú và hào sảng."
      },
      {
        name: "Vợ Nhặt",
        category_id: categoryIds.vn_truyenngan,
        price: 45000,
        author: "Kim Lân",
        publisher: "NXB Văn Học",
        thumbnail: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1557129524i/45453625.jpg",
        description: "Truyện ngắn xuất sắc về nạn đói năm 1945 và khát vọng sống."
      },
      {
        name: "Cánh Đồng Bất Tận",
        category_id: categoryIds.vn_truyenngan,
        price: 80000,
        author: "Nguyễn Ngọc Tư",
        publisher: "NXB Trẻ",
        thumbnail: "https://isach.info/phone/images/story/canh_dong_bat_tan__nguyen_ngoc_tu.jpg",
        description: "Những phận người lênh đênh trên sông nước miền Tây."
      },
      // --- VN Kinh Tế ---
      {
        name: "Cà Phê Cùng Tony",
        category_id: categoryIds.vn_khoinghiep,
        price: 90000,
        author: "Tony Buổi Sáng",
        publisher: "NXB Trẻ",
        thumbnail: "https://salt.tikicdn.com/cache/w1200/ts/product/2e/aa/e3/941454504149954f24d350616b3f946e.jpg",
        description: "Lời khuyên chân thành và hài hước cho các bạn trẻ."
      },
      {
        name: "Trên Đường Băng",
        category_id: categoryIds.vn_khoinghiep,
        price: 85000,
        author: "Tony Buổi Sáng",
        publisher: "NXB Trẻ",
        thumbnail: "https://salt.tikicdn.com/ts/product/00/f6/8d/6841772633092571343725c88b90e9d6.jpg",
        description: "Hành trang tinh thần cho người trẻ vào đời."
      },
      {
        name: "Người Tối Giản",
        category_id: categoryIds.vn_nhanvat,
        price: 110000,
        author: "Sasaki Fumio",
        publisher: "NXB Lao Động",
        thumbnail: "https://bizweb.dktcdn.net/100/170/367/products/loi-song-toi-gian-cua-nguoi-nhat-1.jpg?v=1510283468537",
        description: "Sống hạnh phúc hơn với ít đồ đạc hơn."
      },
      {
        name: "Khởi Nghiệp Bán Lẻ",
        category_id: categoryIds.vn_khoinghiep,
        price: 150000,
        author: "Trần Thanh Phong",
        publisher: "NXB Tổng Hợp TP.HCM",
        thumbnail: "https://bizweb.dktcdn.net/100/363/455/products/khoi-nghiep-ban-le-bi-quyet-thanh-cong-va-giau-co-bang-kinh-doanh-chuoi-cua-hang-ban-le-8935251412586.jpg?v=1573200155230",
        description: "Bí quyết kinh doanh cửa hàng thực chiến."
      },
      {
        name: "Chứng Khoán Cơ Bản",
        category_id: categoryIds.vn_taichinh,
        price: 200000,
        author: "Nhiều Tác Giả",
        publisher: "NXB Tài Chính",
        thumbnail: "https://salt.tikicdn.com/cache/w1200/ts/product/f4/16/e0/f8361099b24467d013e8a4a589e491e0.jpg",
        description: "Kiến thức nền tảng cho nhà đầu tư mới."
      },
      // --- VN Kỹ Năng ---
      {
        name: "Đắc Nhân Tâm",
        category_id: categoryIds.vn_quantri,
        price: 76000,
        author: "Dale Carnegie",
        publisher: "NXB Tổng Hợp TP.HCM",
        thumbnail: "https://bizweb.dktcdn.net/100/197/269/products/dac-nhan-tam.jpg",
        description: "Nghệ thuật thu phục lòng người kinh điển."
      },
      {
        name: "Quẳng Gánh Lo Đi Mà Vui Sống",
        category_id: categoryIds.idVN_KyNang,
        price: 82000,
        author: "Dale Carnegie",
        publisher: "NXB Tổng Hợp TP.HCM",
        thumbnail: "https://salt.tikicdn.com/cache/w1200/ts/product/6e/de/c6/8e04d44549f76a59335a420b910e5251.jpg",
        description: "Cách vượt qua lo âu để sống an nhiên."
      },
      {
        name: "Hạt Giống Tâm Hồn",
        category_id: categoryIds.idVN_KyNang,
        price: 55000,
        author: "Nhiều Tác Giả",
        publisher: "NXB Tổng Hợp TP.HCM",
        thumbnail: "https://salt.tikicdn.com/ts/product/49/09/be/58203c2859c2331575ca86518151216d.jpg",
        description: "Tuyển tập những câu chuyện ý nghĩa về cuộc sống."
      },

      // --- Foreign Fiction ---
      {
        name: "Harry Potter and the Sorcerer's Stone",
        category_id: categoryIds.f_scifi,
        price: 250000,
        author: "J.K. Rowling",
        publisher: "Scholastic",
        thumbnail: "https://m.media-amazon.com/images/I/71rvtB0+CjL._AC_UF1000,1000_QL80_.jpg",
        description: "The start of a magical journey for Harry Potter."
      },
      {
        name: "The Great Gatsby",
        category_id: categoryIds.f_classics,
        price: 180000,
        author: "F. Scott Fitzgerald",
        publisher: "Scribner",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
        description: "A portrait of the Jazz Age in all its decadence and excess."
      },
      {
        name: "To Kill a Mockingbird",
        category_id: categoryIds.f_classics,
        price: 195000,
        author: "Harper Lee",
        publisher: "HarperCollins",
        thumbnail: "https://cdn.britannica.com/21/182021-050-666DB6B1/book-cover-To-Kill-a-Mockingbird-many-1961.jpg",
        description: "A novel about the serious issues of rape and racial inequality."
      },
      {
        name: "1984",
        category_id: categoryIds.f_scifi,
        price: 210000,
        author: "George Orwell",
        publisher: "Secker & Warburg",
        thumbnail: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
        description: "A dystopian social science fiction novel and cautionary tale."
      },
      {
        name: "Pride and Prejudice",
        category_id: categoryIds.f_romance,
        price: 150000,
        author: "Jane Austen",
        publisher: "T. Egerton",
        thumbnail: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
        description: "A romantic novel of manners."
      },
      {
        name: "The Da Vinci Code",
        category_id: categoryIds.f_thriller,
        price: 230000,
        author: "Dan Brown",
        publisher: "Doubleday",
        thumbnail: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579621267i/968.jpg",
        description: "A mystery thriller novel."
      },
      {
        name: "The Alchemist",
        category_id: categoryIds.f_contemporary,
        price: 185000,
        author: "Paulo Coelho",
        publisher: "HarperOne",
        thumbnail: "https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg",
        description: "A story about following your dreams."
      },
      {
        name: "It",
        category_id: categoryIds.f_thriller,
        price: 280000,
        author: "Stephen King",
        publisher: "Viking",
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/1/1a/It_%281986%29_front_cover%2C_first_edition.jpg",
        description: "A horror novel about a shape-shifting entity."
      },
      {
        name: "Gone Girl",
        category_id: categoryIds.f_thriller,
        price: 220000,
        author: "Gillian Flynn",
        publisher: "Crown Publishing Group",
        thumbnail: "https://m.media-amazon.com/images/I/71p1J+8nKLL._AC_UF1000,1000_QL80_.jpg",
        description: "A thriller about a woman who disappears on her fifth wedding anniversary."
      },
      {
        name: "Normal People",
        category_id: categoryIds.f_contemporary,
        price: 240000,
        author: "Sally Rooney",
        publisher: "Faber & Faber",
        thumbnail: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1571423190i/41057294.jpg",
        description: "A modern love story about how one person can change another's life."
      },

      // --- Foreign Non-Fiction ---
      {
        name: "Sapiens: A Brief History of Humankind",
        category_id: categoryIds.f_history,
        price: 320000,
        author: "Yuval Noah Harari",
        publisher: "Harper",
        thumbnail: "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg",
        description: "A survey of the history of humankind."
      },
      {
        name: "Educated",
        category_id: categoryIds.f_biography,
        price: 290000,
        author: "Tara Westover",
        publisher: "Random House",
        thumbnail: "https://m.media-amazon.com/images/I/81WojUxbbFL._AC_UF1000,1000_QL80_.jpg",
        description: "A memoir about growing up in a survivalist family."
      },
      {
        name: "Becoming",
        category_id: categoryIds.f_biography,
        price: 350000,
        author: "Michelle Obama",
        publisher: "Crown",
        thumbnail: "https://m.media-amazon.com/images/I/81KGjsBXQ7L._AC_UF1000,1000_QL80_.jpg",
        description: "The memoir of former United States First Lady Michelle Obama."
      },
      {
        name: "Atomic Habits",
        category_id: categoryIds.f_selfhelp,
        price: 260000,
        author: "James Clear",
        publisher: "Avery",
        thumbnail: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
        description: "An easy & proven way to build good habits & break bad ones."
      },
      {
        name: "Thinking, Fast and Slow",
        category_id: categoryIds.f_selfhelp,
        price: 300000,
        author: "Daniel Kahneman",
        publisher: "Farrar, Straus and Giroux",
        thumbnail: "https://images-na.ssl-images-amazon.com/images/I/41shR5-1vlL._SX331_BO1,204,203,200_.jpg",
        description: "A book on behavioral psychology."
      },
      {
        name: "Rich Dad Poor Dad",
        category_id: categoryIds.f_business,
        price: 220000,
        author: "Robert T. Kiyosaki",
        publisher: "Plata Publishing",
        thumbnail: "https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg",
        description: "Personal finance classic."
      },
      {
        name: "Zero to One",
        category_id: categoryIds.f_business,
        price: 240000,
        author: "Peter Thiel",
        publisher: "Crown Business",
        thumbnail: "https://m.media-amazon.com/images/I/71uAI28kJuL._AC_UF1000,1000_QL80_.jpg",
        description: "Notes on startups, or how to build the future."
      },
      {
        name: "Steve Jobs",
        category_id: categoryIds.f_biography,
        price: 310000,
        author: "Walter Isaacson",
        publisher: "Simon & Schuster",
        thumbnail: "https://m.media-amazon.com/images/I/71sVdvYaaXL._AC_UF1000,1000_QL80_.jpg",
        description: "Biography of the Apple co-founder."
      },
      {
        name: "Principles",
        category_id: categoryIds.f_business,
        price: 330000,
        author: "Ray Dalio",
        publisher: "Simon & Schuster",
        thumbnail: "https://m.media-amazon.com/images/I/61N+Rj02EUL._AC_UF1000,1000_QL80_.jpg",
        description: "Life and Work principles."
      },
      {
        name: "Guns, Germs, and Steel",
        category_id: categoryIds.f_history,
        price: 295000,
        author: "Jared Diamond",
        publisher: "W. W. Norton",
        thumbnail: "https://m.media-amazon.com/images/I/813aV273-rL._AC_UF1000,1000_QL80_.jpg",
        description: "The fates of human societies."
      },

      // --- More VN Books ---
      {
        name: "Lược Sử Nước Việt",
        category_id: categoryIds.vn_kienthuc,
        price: 180000,
        author: "Hồ Anh Thái",
        publisher: "NXB Thế Giới",
        thumbnail: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_41933.jpg",
        description: "Tóm tắt lịch sử Việt Nam bằng tranh."
      },
      {
        name: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
        category_id: categoryIds.vn_vanhoc_tn,
        price: 90000,
        author: "Nguyễn Nhật Ánh",
        publisher: "NXB Trẻ",
        thumbnail: "https://salt.tikicdn.com/cache/w1200/ts/product/d9/3c/6e/06b7a5a3df3d5260173db47c166d744f.jpg",
        description: "Vé đi tuổi thơ cho những ai đã từng là trẻ con."
      },
       {
        name: "Cô Gái Đến Từ Hôm Qua",
        category_id: categoryIds.vn_ngontinh,
        price: 95000,
        author: "Nguyễn Nhật Ánh",
        publisher: "NXB Trẻ",
        thumbnail: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1649931393i/10706431.jpg",
        description: "Mối tình đầu thơ ngây của cậu học trò."
      },
       {
        name: "Nhà Giả Kim (Bản Tiếng Việt)",
        category_id: categoryIds.vn_tieuthuyet,
        price: 79000,
        author: "Paulo Coelho",
        publisher: "NXB Văn Học",
        thumbnail: "https://bizweb.dktcdn.net/100/320/202/products/nha-gia-kim-tai-ban-2017.jpg",
        description: "Cuốn sách bán chạy chỉ sau Kinh Thánh."
      },
      {
        name: "Để Mai Tính",
        category_id: categoryIds.vn_truyenngan,
        price: 70000,
        author: "Nguyễn Ngọc Tư",
        publisher: "NXB Trẻ",
        thumbnail: "https://www.netabooks.vn/Data/Sites/1/Product/14838/de-mai-tinh.jpg",
        description: "Tập truyện ngắn của Nguyễn Ngọc Tư."
      },
      {
         name: "Búp Sen Xanh",
         category_id: categoryIds.vn_tieuthuyet,
         price: 120000,
         author: "Sơn Tùng",
         publisher: "NXB Kim Đồng",
         thumbnail: "https://bizweb.dktcdn.net/100/180/408/products/bup-sen-xanh-2020.jpg",
         description: "Tiểu thuyết về thời niên thiếu của Bác Hồ."
      },
      {
        name: "Rừng Na Uy (Bản Tiếng Việt)",
        category_id: categoryIds.vn_tieuthuyet,
        price: 145000,
        author: "Haruki Murakami",
        publisher: "NXB Hội Nhà Văn",
        thumbnail: "https://nhasachphuongnam.com/images/detailed/167/rung-na-uy-nhakimdong-tb21.jpg",
        description: "Tiểu thuyết lãng mạn, u sầu của Murakami."
      },
       {
        name: "Sherlock Holmes Toàn Tập",
        category_id: categoryIds.vn_trinhtham,
        price: 450000,
        author: "Arthur Conan Doyle",
        publisher: "NXB Văn Học",
        thumbnail: "https://bizweb.dktcdn.net/100/319/074/products/toan-tap-sherlock-holmes-3-tap-hop.jpg",
        description: "Tuyển tập các vụ án của thám tử lừng danh."
      },
      {
         name: "Doraemon Tập 1",
         category_id: categoryIds.vn_truyentranh,
         price: 25000,
         author: "Fujiko F. Fujio",
         publisher: "NXB Kim Đồng",
         thumbnail: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_234661.jpg",
         description: "Chú mèo máy đến từ tương lai."
      },
      {
         name: "Conan Tập 100",
         category_id: categoryIds.vn_truyentranh,
         price: 25000,
         author: "Gosho Aoyama",
         publisher: "NXB Kim Đồng",
         thumbnail: "https://upload.wikimedia.org/wikipedia/vi/d/d4/Tham_Tu_Lung_Danh_Conan_Vol_100.jpg",
         description: "Thám tử lừng danh Conan."
      }
    ];

    // Helper to generate slug
    const createSlug = (str) => {
        str = str.toLowerCase();
        str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        str = str.replace(/[đĐ]/g, "d");
        str = str.replace(/([^0-9a-z-\s])/g, '');
        str = str.replace(/(\s+)/g, '-');
        str = str.replace(/^-+/g, '');
        str = str.replace(/-+$/g, '');
        return str;
    };

    for (const p of products) {
        const slug = createSlug(p.name);
        const quantity = Math.floor(Math.random() * 200) + 10;
        await db.query(
         `INSERT INTO products 
         (name, slug, price, quantity, description, category_id, thumbnail, author, publisher, publication_year, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
           p.name, 
           slug + '-' + Math.floor(Math.random() * 1000), // Randomize slug slightly to avoid dupes if any
           p.price, 
           quantity, 
           p.description, 
           p.category_id || null, 
           p.thumbnail, 
           p.author, 
           p.publisher, 
           2000 + Math.floor(Math.random() * 24),
           'active'
         ]
       );
    }

    // Fill up to 50 products if needed by duplicating with slight changes? 
    // The list above has about 40 items. Let's add a loop to generate generic items if count < 50.
    // Or just generating generic items for VPP/Toys to fill the gap.
    
    console.log("Seeding generic items to reach 50+ ...");
    
    const genericItems = [
        { cat: idVPP_But, name: "Bút Bi Thiên Long", type: "VPP" },
        { cat: idVPP_So, name: "Sổ Tay Lò Xo", type: "VPP" },
        { cat: idVPP_DungCu, name: "Bộ Thước Kẻ", type: "VPP" },
        { cat: idToys, name: "Bộ Xếp Hình Lego", type: "Toy" },
        { cat: idToys, name: "Rubik 3x3", type: "Toy" },
        { cat: idVPP_But, name: "Bút Chì 2B", type: "VPP" },
        { cat: idVPP_So, name: "Vở Học Sinh 96 Trang", type: "VPP" },
        { cat: idToys, name: "Xe Điều Khiển", type: "Toy" },
        { cat: idToys, name: "Búp Bê Barbie", type: "Toy" },
        { cat: idVPP_DungCu, name: "Compa", type: "VPP" },
    ];

    for (const item of genericItems) {
         const slug = createSlug(item.name) + '-' + Math.floor(Math.random() * 10000);
         const quantity = Math.floor(Math.random() * 100) + 10;
         const price = Math.floor(Math.random() * 100) * 1000 + 10000;
         await db.query(
             `INSERT INTO products (name, slug, price, quantity, description, category_id, thumbnail, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
             [item.name, slug, price, quantity, `Sản phẩm ${item.type} chất lượng cao`, item.cat, "https://via.placeholder.com/300?text=" + item.type, 'active']
         );
    }

    console.log("Seeding complete. Products inserted.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedFull();
