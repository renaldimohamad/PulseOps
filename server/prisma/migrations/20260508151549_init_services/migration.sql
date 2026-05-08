-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('UP', 'DOWN', 'PENDING', 'UNKNOWN');

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'UNKNOWN',
    "latency" INTEGER DEFAULT 0,
    "lastChecked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);
