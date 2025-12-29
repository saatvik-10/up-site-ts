-- CreateTable
CREATE TABLE "alert" (
    "id" TEXT NOT NULL,
    "status" "website_status" NOT NULL,
    "time_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_alertTowebsite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_alertTowebsite_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_alertTowebsite_B_index" ON "_alertTowebsite"("B");

-- AddForeignKey
ALTER TABLE "_alertTowebsite" ADD CONSTRAINT "_alertTowebsite_A_fkey" FOREIGN KEY ("A") REFERENCES "alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alertTowebsite" ADD CONSTRAINT "_alertTowebsite_B_fkey" FOREIGN KEY ("B") REFERENCES "website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
