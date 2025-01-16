-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Register', 'Login');

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posision" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Posision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeUnitPosition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employeeId" UUID,
    "unitId" UUID,
    "positionId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeUnitPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employeeId" UUID,
    "transaction" "TransactionType" NOT NULL,
    "isSucceed" BOOLEAN NOT NULL DEFAULT true,
    "authAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_username_key" ON "Employee"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Posision_name_key" ON "Posision"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeUnitPosition_employeeId_key" ON "EmployeeUnitPosition"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeUnitPosition_unitId_key" ON "EmployeeUnitPosition"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeUnitPosition_positionId_key" ON "EmployeeUnitPosition"("positionId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthLog_employeeId_key" ON "AuthLog"("employeeId");

-- AddForeignKey
ALTER TABLE "EmployeeUnitPosition" ADD CONSTRAINT "EmployeeUnitPosition_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeUnitPosition" ADD CONSTRAINT "EmployeeUnitPosition_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeUnitPosition" ADD CONSTRAINT "EmployeeUnitPosition_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Posision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthLog" ADD CONSTRAINT "AuthLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
