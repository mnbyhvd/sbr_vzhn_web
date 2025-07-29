-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "budget" TEXT,
ADD COLUMN     "curator" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "links" TEXT,
ADD COLUMN     "presentation" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ADD COLUMN     "team" TEXT,
ADD COLUMN     "tools" TEXT;

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "bonuses" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "hrContact" TEXT,
ADD COLUMN     "links" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "pdf" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "schedule" TEXT,
ADD COLUMN     "selectionStages" TEXT,
ADD COLUMN     "stack" TEXT,
ADD COLUMN     "workFormat" TEXT;
