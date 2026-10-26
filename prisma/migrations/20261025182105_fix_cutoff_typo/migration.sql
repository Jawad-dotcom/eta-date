/*
  Warnings:

  - You are about to drop the column `cuttoffHour` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "cutoffHour" INTEGER NOT NULL DEFAULT 14,
    "processingDays" INTEGER NOT NULL DEFAULT 1,
    "shippingDays" INTEGER NOT NULL DEFAULT 3,
    "workingDays" TEXT NOT NULL DEFAULT '1,2,3,4,5',
    "messageTemplate" TEXT NOT NULL DEFAULT 'Get it by {date}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("createdAt", "id", "messageTemplate", "processingDays", "shippingDays", "shop", "timezone", "updatedAt", "workingDays") SELECT "createdAt", "id", "messageTemplate", "processingDays", "shippingDays", "shop", "timezone", "updatedAt", "workingDays" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
