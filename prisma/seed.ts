import { PrismaClient, Role, Size } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing seeded data (order matters for FK constraints)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.testimonial.deleteMany();
  console.log("🗑️  Cleared old seed data");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@saaviya.in" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@saaviya.in",
      password: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Categories
  const categoryData = [
    { name: "Kurtas", slug: "kurtas", sortOrder: 1, isActive: true },
    { name: "Dresses", slug: "dresses", sortOrder: 2, isActive: true },
    { name: "Tops", slug: "tops", sortOrder: 3, isActive: true },
    { name: "Lehengas", slug: "lehengas", sortOrder: 4, isActive: true },
    { name: "Sarees", slug: "sarees", sortOrder: 5, isActive: true },
    { name: "Ethnic Sets", slug: "ethnic-sets", sortOrder: 6, isActive: true },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = c.id;
  }
  console.log("✅ Categories created:", Object.keys(categories).length);

  // Products  (product images: 600×800px portrait)
  const products = [
    {
      name: "Pink Floral Anarkali Kurta",
      slug: "pink-floral-anarkali-kurta",
      description: "Elegant floral printed Anarkali kurta with fine embroidery. Perfect for festive occasions.",
      price: 1299,
      comparePrice: 1999,
      categoryId: categories["kurtas"],
      isActive: true,
      isFeatured: true,
      isTrending: true,
      isOffer: false,
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1614093302611-8efc4a99faea?w=600&h=800&fit=crop",
      ],
      tags: ["anarkali", "festive", "floral"],
      sizes: [
        { size: Size.XS, stock: 5 },
        { size: Size.S, stock: 8 },
        { size: Size.M, stock: 10 },
        { size: Size.L, stock: 7 },
        { size: Size.XL, stock: 4 },
      ],
    },
    {
      name: "Blue Embroidered Straight Kurta",
      slug: "blue-embroidered-straight-kurta",
      description: "Classic straight-cut kurta with delicate embroidery on neckline. Versatile for work and casual wear.",
      price: 899,
      comparePrice: 1499,
      categoryId: categories["kurtas"],
      isActive: true,
      isFeatured: false,
      isTrending: true,
      isOffer: true,
      images: [
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      ],
      tags: ["kurta", "casual", "embroidery"],
      sizes: [
        { size: Size.S, stock: 6 },
        { size: Size.M, stock: 12 },
        { size: Size.L, stock: 9 },
        { size: Size.XL, stock: 5 },
        { size: Size.XXL, stock: 3 },
      ],
    },
    {
      name: "Maxi Floral Dress",
      slug: "maxi-floral-dress",
      description: "Flowing maxi dress with vibrant floral print. Ideal for summer outings.",
      price: 1599,
      comparePrice: 2299,
      categoryId: categories["dresses"],
      isActive: true,
      isFeatured: true,
      isTrending: false,
      isOffer: false,
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
      ],
      tags: ["maxi", "summer", "floral"],
      sizes: [
        { size: Size.XS, stock: 4 },
        { size: Size.S, stock: 7 },
        { size: Size.M, stock: 8 },
        { size: Size.L, stock: 6 },
      ],
    },
    {
      name: "Red Lehenga Choli",
      slug: "red-lehenga-choli",
      description: "Stunning red bridal lehenga with intricate zari work. Comes with matching dupatta.",
      price: 4999,
      comparePrice: 7999,
      categoryId: categories["lehengas"],
      isActive: true,
      isFeatured: true,
      isTrending: true,
      isOffer: false,
      images: [
        "https://images.unsplash.com/photo-1583391733956-3c5f7a4b2ce0?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      ],
      tags: ["bridal", "occasion", "zari"],
      sizes: [
        { size: Size.S, stock: 3 },
        { size: Size.M, stock: 5 },
        { size: Size.L, stock: 4 },
        { size: Size.XL, stock: 2 },
      ],
    },
    {
      name: "Crop Top - Tie Dye",
      slug: "crop-top-tie-dye",
      description: "Trending tie-dye crop top for casual wear. Perfect with high-waist jeans.",
      price: 499,
      comparePrice: 799,
      categoryId: categories["tops"],
      isActive: true,
      isFeatured: false,
      isTrending: true,
      isOffer: true,
      images: [
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop",
      ],
      tags: ["crop", "casual", "tie-dye"],
      sizes: [
        { size: Size.XS, stock: 10 },
        { size: Size.S, stock: 12 },
        { size: Size.M, stock: 8 },
        { size: Size.L, stock: 5 },
      ],
    },
    {
      name: "Printed Saree with Blouse",
      slug: "printed-saree-with-blouse",
      description: "Graceful printed saree with ready-to-wear blouse. A timeless choice for every occasion.",
      price: 2199,
      comparePrice: 3499,
      categoryId: categories["sarees"],
      isActive: true,
      isFeatured: true,
      isTrending: false,
      isOffer: true,
      images: [
        "https://images.unsplash.com/photo-1583391733956-3c5f7a4b2ce0?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1614093302611-8efc4a99faea?w=600&h=800&fit=crop",
      ],
      tags: ["saree", "traditional", "printed"],
      sizes: [
        { size: Size.S, stock: 8 },
        { size: Size.M, stock: 10 },
        { size: Size.L, stock: 7 },
        { size: Size.XL, stock: 4 },
      ],
    },
    {
      name: "Ethnic Palazzo Set",
      slug: "ethnic-palazzo-set",
      description: "Comfortable ethnic palazzo suit with dupatta. Perfect for casual and semi-formal occasions.",
      price: 1099,
      comparePrice: 1699,
      categoryId: categories["ethnic-sets"],
      isActive: true,
      isFeatured: false,
      isTrending: true,
      isOffer: false,
      images: [
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
      ],
      tags: ["palazzo", "ethnic", "comfortable"],
      sizes: [
        { size: Size.S, stock: 6 },
        { size: Size.M, stock: 9 },
        { size: Size.L, stock: 7 },
        { size: Size.XL, stock: 3 },
        { size: Size.XXL, stock: 2 },
      ],
    },
    {
      name: "Off-Shoulder Midi Dress",
      slug: "off-shoulder-midi-dress",
      description: "Elegant off-shoulder midi dress with flared skirt. Great for parties and date nights.",
      price: 1399,
      comparePrice: 1999,
      categoryId: categories["dresses"],
      isActive: true,
      isFeatured: true,
      isTrending: true,
      isOffer: true,
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
      ],
      tags: ["midi", "party", "off-shoulder"],
      sizes: [
        { size: Size.XS, stock: 5 },
        { size: Size.S, stock: 8 },
        { size: Size.M, stock: 10 },
        { size: Size.L, stock: 6 },
      ],
    },
  ];

  for (const p of products) {
    const { sizes, ...productData } = p;
    const created = await prisma.product.create({ data: productData });
    await prisma.productSize.createMany({
      data: sizes.map((s) => ({ ...s, productId: created.id })),
    });
  }
  console.log("✅ Products created:", products.length);

  // FAQ items
  const faqs = [
    { question: "What is your return policy?", answer: "We offer a 7-day easy return policy. Items must be unused and in original packaging.", category: "Returns", sortOrder: 1, isActive: true },
    { question: "How long does delivery take?", answer: "Standard delivery: 5-7 business days. Express delivery: 2-3 business days.", category: "Shipping", sortOrder: 2, isActive: true },
    { question: "Do you ship across India?", answer: "Yes, we ship to all states and union territories in India.", category: "Shipping", sortOrder: 3, isActive: true },
    { question: "How do I track my order?", answer: "Once your order is shipped, you will receive an email with the tracking link.", category: "Orders", sortOrder: 4, isActive: true },
    { question: "What payment methods do you accept?", answer: "We currently accept UPI payments. More payment options coming soon!", category: "Payments", sortOrder: 5, isActive: true },
    { question: "Can I exchange for a different size?", answer: "Yes, size exchanges are possible within 7 days of delivery, subject to availability.", category: "Returns", sortOrder: 6, isActive: true },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.create({ data: faq });
  }
  console.log("✅ FAQ items created:", faqs.length);

  // Hero slides  (1920×600px)
  const heroSlides = [
    {
      title: "New Arrivals",
      subtitle: "Discover our latest collection of ethnic wear",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=600&fit=crop",
      link: "/products/kurtas",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "Festive Sale – Up to 50% Off",
      subtitle: "Stunning lehengas & sarees for every celebration",
      image: "https://images.unsplash.com/photo-1583391733956-3c5f7a4b2ce0?w=1920&h=600&fit=crop",
      link: "/products/lehengas",
      isActive: true,
      sortOrder: 2,
    },
    {
      title: "Summer Dresses",
      subtitle: "Light, breezy styles for sunny days",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1920&h=600&fit=crop",
      link: "/products/dresses",
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: slide });
  }
  console.log("✅ Hero slides created:", heroSlides.length);

  // Banners  (1200×400px wide)
  const banners = [
    {
      title: "Summer Collection 2025",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=400&fit=crop",
      link: "/products/dresses",
      isActive: true,
      position: "home",
      sortOrder: 1,
    },
    {
      title: "Kurta Fiesta",
      image: "https://images.unsplash.com/photo-1614093302611-8efc4a99faea?w=1200&h=400&fit=crop",
      link: "/products/kurtas",
      isActive: true,
      position: "home",
      sortOrder: 2,
    },
    {
      title: "Lehenga & Wedding Wear",
      image: "https://images.unsplash.com/photo-1583391733956-3c5f7a4b2ce0?w=1200&h=400&fit=crop",
      link: "/products/lehengas",
      isActive: true,
      position: "home",
      sortOrder: 3,
    },
    {
      title: "Flat 40% Off on Tops",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1200&h=400&fit=crop",
      link: "/products/tops",
      isActive: true,
      position: "home",
      sortOrder: 4,
    },
  ];

  for (const b of banners) {
    await prisma.banner.create({ data: b });
  }
  console.log("✅ Banners created:", banners.length);

  // Blog posts
  const blogPosts = [
    {
      title: "5 Must-Have Kurtas This Festive Season",
      slug: "5-must-have-kurtas-festive-season",
      excerpt: "Elevate your festive wardrobe with these stunning kurta styles that are trending this season.",
      content: "<p>Festive season calls for vibrant colors and timeless silhouettes. Here are 5 kurta styles you must have in your wardrobe this year...</p>",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=500&fit=crop",
      author: "Style Team",
      tags: ["fashion", "festive", "kurtas"],
      publishedAt: new Date("2026-03-15"),
    },
    {
      title: "How to Style a Saree for a Modern Look",
      slug: "how-to-style-saree-modern-look",
      excerpt: "Discover contemporary ways to drape and accessorize your saree for a fresh, fashion-forward appearance.",
      content: "<p>The saree is timeless, but styling it for today's woman requires a creative eye. From belt draping to pairing with sneakers, here's how to make your saree uniquely yours...</p>",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=500&fit=crop",
      author: "Priya Sharma",
      tags: ["saree", "styling", "contemporary"],
      publishedAt: new Date("2026-03-28"),
    },
    {
      title: "The Complete Guide to Choosing Ethnic Wear for Weddings",
      slug: "complete-guide-ethnic-wear-weddings",
      excerpt: "From lehengas to anarkalis — find the perfect outfit for every wedding function this season.",
      content: "<p>Wedding season is a showcase of India's most beautiful textiles and craftsmanship. Whether you're the bride, bridesmaid or a guest, this guide will help you dress perfectly for every ceremony...</p>",
      image: "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&h=500&fit=crop",
      author: "Fashion Desk",
      tags: ["wedding", "lehenga", "ethnic"],
      publishedAt: new Date("2026-04-05"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, isPublished: true },
    });
  }
  console.log("✅ Blog posts seeded:", blogPosts.length);

  // Testimonials
  const testimonialData = [
    { name: "Priya Sharma", location: "Mumbai, Maharashtra", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", review: "Absolutely love the quality! The fabric of the kurta is so soft and the embroidery is beautiful. Will definitely order again.", sortOrder: 1 },
    { name: "Ananya Krishnan", location: "Bengaluru, Karnataka", rating: 5, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face", review: "Ordered a saree for my cousin's wedding — it arrived well-packaged and looked even better in person. Got so many compliments!", sortOrder: 2 },
    { name: "Meera Joshi", location: "Pune, Maharashtra", rating: 4, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", review: "Great selection of ethnic wear. The delivery was fast and the sizing was accurate. Slight delay in customer support response but overall a great experience.", sortOrder: 3 },
    { name: "Deepika Nair", location: "Kochi, Kerala", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", review: "The lehenga I ordered was stunning! The colors were exactly as shown. Saaviya has become my go-to for ethnic fashion online.", sortOrder: 4 },
    { name: "Ritu Agarwal", location: "Jaipur, Rajasthan", rating: 5, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", review: "Super happy with my purchase! The salwar set is gorgeous and stitching quality is top-notch. Highly recommend this store.", sortOrder: 5 },
    { name: "Sneha Patel", location: "Ahmedabad, Gujarat", rating: 4, avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face", review: "Nice variety of traditional outfits at very reasonable prices. The material is good quality. Will be shopping here for all festive occasions.", sortOrder: 6 },
    { name: "Kavya Reddy", location: "Hyderabad, Telangana", rating: 5, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", review: "The kurti I received is exactly what was shown in the picture. The packaging was neat and the delivery was super quick. Loved the experience!", sortOrder: 7 },
    { name: "Tanvi Desai", location: "Surat, Gujarat", rating: 5, avatar: "https://images.unsplash.com/photo-1502767089025-6572583495f9?w=150&h=150&fit=crop&crop=face", review: "Purchased anarkali suit for Navratri and everyone was asking where I bought it! The zari work is so intricate. Very happy customer here.", sortOrder: 8 },
    { name: "Pooja Verma", location: "Delhi, NCR", rating: 4, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", review: "Great range of indo-western outfits. The crop top with palazzo combo was perfect for my office party. Received many compliments!", sortOrder: 9 },
    { name: "Ishita Bose", location: "Kolkata, West Bengal", rating: 5, avatar: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=150&h=150&fit=crop&crop=face", review: "My first order from Saaviya and I'm already a loyal customer! The cotton saree is so comfortable and the print is vibrant and beautiful.", sortOrder: 10 },
  ];
  for (const t of testimonialData) {
    await prisma.testimonial.create({ data: { ...t, isActive: true } });
  }
  console.log("✅ Testimonials seeded:", testimonialData.length);

  console.log("\n🎉 Seeding complete!");
  console.log("Admin login: admin@saaviya.in / Admin@123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
