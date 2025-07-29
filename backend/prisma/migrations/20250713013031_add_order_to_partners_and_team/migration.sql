-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "bgColor" SET DEFAULT '#ffffff',
ALTER COLUMN "textColor" SET DEFAULT '#222222',
ALTER COLUMN "client" SET DEFAULT '',
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "details" SET DEFAULT '',
ALTER COLUMN "industry" SET DEFAULT '',
ALTER COLUMN "technologies" SET DEFAULT '';

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "order" INTEGER;
