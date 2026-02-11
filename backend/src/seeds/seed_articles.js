import { sequelize as db } from "../config/sequelize.js";

async function seedArticles() {
  try {
    console.log("Seeding articles...");

    // Clear existing articles
    await db.query("DELETE FROM articles");
    await db.query("ALTER TABLE articles AUTO_INCREMENT = 1");

    const articles = [
      {
        title: "10 Cuốn Sách Nên Đọc Trước Tuổi 30",
        excerpt: "Những tựa sách giúp thay đổi tư duy và định hướng cuộc đời bạn trước cột mốc quan trọng.",
        content: `
          <p>Tuổi 30 là một cột mốc quan trọng trong cuộc đời mỗi người. Trước khi bước sang độ tuổi này, việc trang bị cho mình những kiến thức và tư duy đúng đắn là vô cùng cần thiết. Dưới đây là danh sách 10 cuốn sách bạn nhất định phải đọc:</p>
          <h3>1. Đắc Nhân Tâm - Dale Carnegie</h3>
          <p>Cuốn sách kinh điển về nghệ thuật ứng xử và thu phục lòng người.</p>
          <h3>2. Nhà Giả Kim - Paulo Coelho</h3>
          <p>Hành trình theo đuổi ước mơ và lắng nghe tiếng gọi con tim.</p>
          <h3>3. Cha Giàu Cha Nghèo - Robert Kiyosaki</h3>
          <p>Thay đổi tư duy về tiền bạc và đầu tư tài chính.</p>
          <p>...</p>
        `,
        thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 1250
      },
      {
        title: "Bí Quyết Đọc Sách Hiệu Quả Cho Người Bận Rộn",
        excerpt: "Làm thế nào để duy trì thói quen đọc sách khi bạn luôn bận rộn với công việc?",
        content: `
          <p>Trong cuộc sống hối hả ngày nay, việc dành thời gian đọc sách dường như trở nên xa xỉ. Tuy nhiên, nếu biết cách sắp xếp, bạn vẫn có thể đọc được hàng chục cuốn sách mỗi năm.</p>
          <p><strong>1. Tận dụng thời gian chết:</strong> Hãy mang theo sách mọi lúc mọi nơi để đọc khi chờ đợi.</p>
          <p><strong>2. Nghe sách nói:</strong> Tận dụng thời gian di chuyển để nghe audiobook.</p>
          <p><strong>3. Đặt mục tiêu nhỏ:</strong> Chỉ cần đọc 15 phút mỗi ngày.</p>
        `,
        thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 980
      },
      {
        title: "Review: Rừng Na Uy - Bản Tình Ca U Sầu",
        excerpt: "Một cái nhìn sâu sắc về tác phẩm kinh điển của Haruki Murakami.",
        content: `
          <p>Rừng Na Uy không chỉ là một cuốn tiểu thuyết tình yêu, mà còn là một bức tranh về sự cô đơn, mất mát và trưởng thành.</p>
          <p>Tác phẩm đưa người đọc trôi miên man trong những cảm xúc lưng chừng của tuổi trẻ, giữa sự sống và cái chết.</p>
        `,
        thumbnail: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 3400
      },
      {
        title: "Top 5 Sách Thiếu Nhi Hay Nhất Năm 2026",
        excerpt: "Những cuốn sách giúp trẻ phát triển trí tưởng tượng và nhân cách.",
        content: `
          <p>Việc chọn sách cho trẻ luôn là nỗi trăn trở của các bậc phụ huynh. Dưới đây là những gợi ý tuyệt vời cho năm nay:</p>
          <ul>
            <li>Chuyện Con Mèo Dạy Hải Âu Bay</li>
            <li>Hoàng Tử Bé</li>
            <li>Charlotte và Wilbur</li>
          </ul>
        `,
        thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 560
      },
      {
        title: "Sách Kinh Tế: Tại Sao Nên Đọc Dù Bạn Không Làm Kinh Doanh?",
        excerpt: "Kiến thức kinh tế giúp bạn hiểu rõ hơn về cách thế giới vận hành.",
        content: `
          <p>Sách kinh tế không chỉ dành cho doanh nhân. Nó cung cấp cho bạn tư duy logic, khả năng quản lý tài chính cá nhân và cái nhìn bao quát về xã hội.</p>
        `,
        thumbnail: "https://images.unsplash.com/photo-1554774853-719586f8c277?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 720
      },
      {
        title: "Khám Phá Hiệu Sách Cổ Nhất Thế Giới",
        excerpt: "Hành trình đến thăm Bertrand - hiệu sách lâu đời nhất tại Bồ Đào Nha.",
        content: `<p>Nằm tại Lisbon, Bertrand được Guinness công nhận là hiệu sách lâu đời nhất thế giới vẫn còn hoạt động...</p>`,
        thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 1500
      },
      {
        title: "Ngày Hội Sách Mùa Xuân 2026 Có Gì Hot?",
        excerpt: "Điểm qua những hoạt động nổi bật tại sự kiện văn hóa đọc lớn nhất năm.",
        content: `<p>Hội sách năm nay quy tụ hơn 50 nhà xuất bản với hàng ngàn đầu sách giảm giá lên đến 70%...</p>`,
        thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 2100
      },
      {
        title: "Tại Sao Sách Giấy Vẫn Sống Khỏe Trong Kỷ Nguyên Số?",
        excerpt: "Cảm giác lật từng trang giấy vẫn là trải nghiệm không thể thay thế.",
        content: `<p>Mặc dù Ebook và Audiobook phát triển mạnh mẽ, sách giấy vẫn giữ vững vị thế của mình nhờ giá trị sưu tầm và trải nghiệm đọc độc đáo.</p>`,
        thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 890
      },
      {
        title: "Học Ngoại Ngữ Qua Văn Học: Phương Pháp Hiệu Quả",
        excerpt: "Đọc tiểu thuyết nguyên tác giúp bạn cải thiện vốn từ vựng và cảm thụ ngôn ngữ tự nhiên.",
        content: `<p>Thay vì học ngữ pháp khô khan, hãy thử đắm mình vào những trang sách Harry Potter bản gốc...</p>`,
        thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 1100
      },
      {
        title: "Tản Văn: Mùa Thu Và Những Trang Sách Cũ",
        excerpt: "Những dòng cảm xúc nhẹ nhàng về việc đọc sách trong những ngày thu se lạnh.",
        content: `<p>Có gì tuyệt vời hơn việc ngồi bên cửa sổ, nhâm nhi tách trà nóng và đọc lại cuốn sách yêu thích...</p>`,
        thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800",
        status: "published",
        views: 670
      }
    ];

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

    for (const article of articles) {
      const slug = createSlug(article.title);
      await db.query(
        `INSERT INTO articles (title, slug, content, excerpt, thumbnail, status, views, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        {
          replacements: [article.title, slug, article.content, article.excerpt, article.thumbnail, article.status, article.views]
        }
      );
    }

    console.log("Articles seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedArticles();
