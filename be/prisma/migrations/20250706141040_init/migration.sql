-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "materialCost" INTEGER NOT NULL,
    "timeInHours" DOUBLE PRECISION NOT NULL,
    "timeCost" INTEGER NOT NULL,
    "totalCost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");
