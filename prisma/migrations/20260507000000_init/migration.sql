-- ============================================================
-- Saaviya — single consolidated initial migration
-- ============================================================

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING_VERIFICATION',
  'PLACED',
  'VERIFIED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REJECTED'
);

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- ──────────────────────────────────────────────────────────
-- Tables
-- ──────────────────────────────────────────────────────────

CREATE TABLE "users" (
    "id"             TEXT        NOT NULL,
    "name"           TEXT        NOT NULL,
    "email"          TEXT        NOT NULL,
    "password"       TEXT        NOT NULL,
    "role"           "Role"      NOT NULL DEFAULT 'USER',
    "isVerified"     BOOLEAN     NOT NULL DEFAULT false,
    "verifyToken"    TEXT,
    "verifyTokenExp" TIMESTAMP(3),
    "resetToken"     TEXT,
    "resetTokenExp"  TIMESTAMP(3),
    "avatar"         TEXT,
    "phone"          TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "categories" (
    "id"          TEXT        NOT NULL,
    "name"        TEXT        NOT NULL,
    "slug"        TEXT        NOT NULL,
    "description" TEXT,
    "image"       TEXT,
    "isActive"    BOOLEAN     NOT NULL DEFAULT true,
    "sortOrder"   INTEGER     NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
    "id"               TEXT           NOT NULL,
    "name"             TEXT           NOT NULL,
    "slug"             TEXT           NOT NULL,
    "shortDescription" TEXT,
    "description"      TEXT,
    "price"            DECIMAL(10,2)  NOT NULL,
    "comparePrice"     DECIMAL(10,2),
    "images"           TEXT[]         NOT NULL,
    "categoryId"       TEXT           NOT NULL,
    "isFeatured"       BOOLEAN        NOT NULL DEFAULT false,
    "isTrending"       BOOLEAN        NOT NULL DEFAULT false,
    "isOffer"          BOOLEAN        NOT NULL DEFAULT false,
    "isActive"         BOOLEAN        NOT NULL DEFAULT true,
    "tags"             TEXT[]         NOT NULL,
    "createdAt"        TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3)   NOT NULL,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_sizes" (
    "id"        TEXT    NOT NULL,
    "productId" TEXT    NOT NULL,
    "size"      "Size"  NOT NULL,
    "stock"     INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "product_sizes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "addresses" (
    "id"        TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "phone"     TEXT         NOT NULL,
    "line1"     TEXT         NOT NULL,
    "line2"     TEXT,
    "city"      TEXT         NOT NULL,
    "state"     TEXT         NOT NULL,
    "pincode"   TEXT         NOT NULL,
    "isDefault" BOOLEAN      NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cart_items" (
    "id"        TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "productId" TEXT         NOT NULL,
    "size"      "Size"       NOT NULL,
    "quantity"  INTEGER      NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- orders: addressId is a plain text reference (no FK) — address data is
-- snapshotted into the shipping* columns at order creation time so that
-- subsequent edits/deletes of the address do not affect order history.
CREATE TABLE "orders" (
    "id"                TEXT           NOT NULL,
    "orderNumber"       TEXT           NOT NULL,
    "userId"            TEXT           NOT NULL,
    "addressId"         TEXT,                        -- soft reference only, no FK
    "shippingName"      TEXT,
    "shippingPhone"     TEXT,
    "shippingLine1"     TEXT,
    "shippingLine2"     TEXT,
    "shippingCity"      TEXT,
    "shippingState"     TEXT,
    "shippingPincode"   TEXT,
    "status"            "OrderStatus"  NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "subtotal"          DECIMAL(10,2)  NOT NULL,
    "shippingCharge"    DECIMAL(10,2)  NOT NULL DEFAULT 0,
    "discount"          DECIMAL(10,2)  NOT NULL DEFAULT 0,
    "couponCode"        TEXT,
    "couponDiscount"    DECIMAL(10,2)  NOT NULL DEFAULT 0,
    "total"             DECIMAL(10,2)  NOT NULL,
    "paymentMethod"     TEXT           NOT NULL DEFAULT 'UPI',
    "paymentScreenshot" TEXT,
    "razorpayOrderId"   TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "adminNote"         TEXT,
    "createdAt"         TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3)   NOT NULL,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_items" (
    "id"        TEXT          NOT NULL,
    "orderId"   TEXT          NOT NULL,
    "productId" TEXT          NOT NULL,
    "name"      TEXT          NOT NULL,
    "image"     TEXT,
    "size"      "Size"        NOT NULL,
    "price"     DECIMAL(10,2) NOT NULL,
    "quantity"  INTEGER       NOT NULL,
    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wishlist_items" (
    "id"        TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "productId" TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "blogs" (
    "id"          TEXT         NOT NULL,
    "title"       TEXT         NOT NULL,
    "slug"        TEXT         NOT NULL,
    "excerpt"     TEXT,
    "content"     TEXT         NOT NULL,
    "image"       TEXT,
    "author"      TEXT         NOT NULL DEFAULT 'Admin',
    "tags"        TEXT[]       NOT NULL,
    "isPublished" BOOLEAN      NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "hero_slides" (
    "id"        TEXT    NOT NULL,
    "title"     TEXT    NOT NULL,
    "subtitle"  TEXT,
    "image"     TEXT    NOT NULL,
    "link"      TEXT,
    "isActive"  BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "banners" (
    "id"        TEXT    NOT NULL,
    "title"     TEXT    NOT NULL,
    "image"     TEXT    NOT NULL,
    "link"      TEXT,
    "position"  TEXT    NOT NULL DEFAULT 'home',
    "isActive"  BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "faq_items" (
    "id"        TEXT    NOT NULL,
    "question"  TEXT    NOT NULL,
    "answer"    TEXT    NOT NULL,
    "category"  TEXT    NOT NULL DEFAULT 'general',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive"  BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "testimonials" (
    "id"        TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "location"  TEXT         NOT NULL,
    "avatar"    TEXT,
    "rating"    INTEGER      NOT NULL DEFAULT 5,
    "review"    TEXT         NOT NULL,
    "isActive"  BOOLEAN      NOT NULL DEFAULT true,
    "sortOrder" INTEGER      NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "coupons" (
    "id"             TEXT           NOT NULL,
    "code"           TEXT           NOT NULL,
    "description"    TEXT,
    "discountType"   "DiscountType" NOT NULL,
    "discountValue"  DECIMAL(10,2)  NOT NULL,
    "minOrderAmount" DECIMAL(10,2),
    "maxUses"        INTEGER,
    "usedCount"      INTEGER        NOT NULL DEFAULT 0,
    "maxUsesPerUser" INTEGER        NOT NULL DEFAULT 1,
    "isActive"       BOOLEAN        NOT NULL DEFAULT true,
    "expiresAt"      TIMESTAMP(3),
    "createdAt"      TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)   NOT NULL,
    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "coupon_usages" (
    "id"        TEXT         NOT NULL,
    "couponId"  TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "orderId"   TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coupon_usages_pkey" PRIMARY KEY ("id")
);

-- ──────────────────────────────────────────────────────────
-- Unique indexes
-- ──────────────────────────────────────────────────────────

CREATE UNIQUE INDEX "users_email_key"               ON "users"("email");
CREATE UNIQUE INDEX "categories_name_key"           ON "categories"("name");
CREATE UNIQUE INDEX "categories_slug_key"           ON "categories"("slug");
CREATE UNIQUE INDEX "products_slug_key"             ON "products"("slug");
CREATE UNIQUE INDEX "product_sizes_productId_size_key" ON "product_sizes"("productId", "size");
CREATE UNIQUE INDEX "cart_items_userId_productId_size_key" ON "cart_items"("userId", "productId", "size");
CREATE UNIQUE INDEX "orders_orderNumber_key"        ON "orders"("orderNumber");
CREATE UNIQUE INDEX "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId");
CREATE UNIQUE INDEX "blogs_slug_key"                ON "blogs"("slug");
CREATE UNIQUE INDEX "coupons_code_key"              ON "coupons"("code");

-- ──────────────────────────────────────────────────────────
-- Foreign keys
-- ──────────────────────────────────────────────────────────

ALTER TABLE "products"
    ADD CONSTRAINT "products_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "product_sizes"
    ADD CONSTRAINT "product_sizes_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "addresses"
    ADD CONSTRAINT "addresses_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cart_items"
    ADD CONSTRAINT "cart_items_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cart_items"
    ADD CONSTRAINT "cart_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- orders.userId FK — no FK from orders to addresses (address is snapshotted)
ALTER TABLE "orders"
    ADD CONSTRAINT "orders_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "order_items"
    ADD CONSTRAINT "order_items_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "order_items"
    ADD CONSTRAINT "order_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "wishlist_items"
    ADD CONSTRAINT "wishlist_items_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "wishlist_items"
    ADD CONSTRAINT "wishlist_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "coupon_usages"
    ADD CONSTRAINT "coupon_usages_couponId_fkey"
    FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
