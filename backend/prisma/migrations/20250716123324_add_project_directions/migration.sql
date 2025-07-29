-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "VacancyCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VacancyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VacancyResponse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vacancyId" INTEGER NOT NULL,

    CONSTRAINT "VacancyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VacancyCategory_name_key" ON "VacancyCategory"("name");

-- AddForeignKey
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VacancyCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancyResponse" ADD CONSTRAINT "VacancyResponse_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
