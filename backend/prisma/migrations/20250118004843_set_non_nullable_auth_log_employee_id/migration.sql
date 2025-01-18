/*
  Warnings:

  - Made the column `employeeId` on table `AuthLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AuthLog" DROP CONSTRAINT "AuthLog_employeeId_fkey";

-- AlterTable
ALTER TABLE "AuthLog" ALTER COLUMN "employeeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AuthLog" ADD CONSTRAINT "AuthLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
