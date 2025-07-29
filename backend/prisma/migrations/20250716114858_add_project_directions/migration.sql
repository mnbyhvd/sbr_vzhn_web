-- CreateTable
CREATE TABLE "ProjectDirection" (
    "projectId" INTEGER NOT NULL,
    "directionId" INTEGER NOT NULL,

    CONSTRAINT "ProjectDirection_pkey" PRIMARY KEY ("projectId","directionId")
);

-- AddForeignKey
ALTER TABLE "ProjectDirection" ADD CONSTRAINT "ProjectDirection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDirection" ADD CONSTRAINT "ProjectDirection_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
