-- CreateTable
CREATE TABLE "InternationalExperience" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "order" INTEGER,

    CONSTRAINT "InternationalExperience_pkey" PRIMARY KEY ("id")
);
