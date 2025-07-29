-- DropForeignKey
ALTER TABLE "ProjectDirection" DROP CONSTRAINT "ProjectDirection_directionId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectDirection" DROP CONSTRAINT "ProjectDirection_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectDirection" ADD CONSTRAINT "ProjectDirection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDirection" ADD CONSTRAINT "ProjectDirection_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
