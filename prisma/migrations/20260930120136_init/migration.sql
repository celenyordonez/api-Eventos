-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Palestrante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EventoPalestrante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventoId" INTEGER NOT NULL,
    "palestranteId" INTEGER NOT NULL,
    CONSTRAINT "EventoPalestrante_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventoPalestrante_palestranteId_fkey" FOREIGN KEY ("palestranteId") REFERENCES "Palestrante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Palestrante_email_key" ON "Palestrante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventoPalestrante_eventoId_palestranteId_key" ON "EventoPalestrante"("eventoId", "palestranteId");
