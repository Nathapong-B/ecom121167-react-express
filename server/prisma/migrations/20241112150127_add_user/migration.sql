-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'active',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address" TEXT,
    "phone" INTEGER,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT,
    "profile_image" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL,
    "last_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
