-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "cuttoffHour" INTEGER NOT NULL DEFAULT 14,
    "processingDays" INTEGER NOT NULL DEFAULT 1,
    "shippingDays" INTEGER NOT NULL DEFAULT 3,
    "workingDays" TEXT NOT NULL DEFAULT '1,2,3,4,5',
    "messageTemplate" TEXT NOT NULL DEFAULT 'Get it by {date}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");

-- CreateIndex
CREATE INDEX "Holiday_shop_idx" ON "Holiday"("shop");
