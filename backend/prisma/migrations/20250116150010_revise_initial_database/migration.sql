/*
  Warnings:

  - You are about to drop the `EmployeeUnitPosition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posision` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmployeeUnitPosition" DROP CONSTRAINT "EmployeeUnitPosition_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeUnitPosition" DROP CONSTRAINT "EmployeeUnitPosition_positionId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeUnitPosition" DROP CONSTRAINT "EmployeeUnitPosition_unitId_fkey";

-- DropTable
DROP TABLE "EmployeeUnitPosition";

-- DropTable
DROP TABLE "Posision";

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeUnitRole" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employeeId" UUID NOT NULL,
    "unitId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeUnitRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeUnitRole_employeeId_key" ON "EmployeeUnitRole"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeUnitRole_unitId_key" ON "EmployeeUnitRole"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeUnitRole_roleId_key" ON "EmployeeUnitRole"("roleId");

-- AddForeignKey
ALTER TABLE "EmployeeUnitRole" ADD CONSTRAINT "EmployeeUnitRole_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeUnitRole" ADD CONSTRAINT "EmployeeUnitRole_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeUnitRole" ADD CONSTRAINT "EmployeeUnitRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
