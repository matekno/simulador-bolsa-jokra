-- CreateTable
CREATE TABLE "Equipo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "saldo" REAL NOT NULL,
    "integrantes" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipoId" INTEGER NOT NULL,
    "symbolId" INTEGER NOT NULL,
    "precioActual" REAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "instanteId" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Compra_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_symbolId_fkey" FOREIGN KEY ("symbolId") REFERENCES "Symbol" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Compra_instanteId_fkey" FOREIGN KEY ("instanteId") REFERENCES "Instante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Instante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Precio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "instanteId" INTEGER NOT NULL,
    "symbolId" INTEGER NOT NULL,
    "precio" REAL NOT NULL,
    CONSTRAINT "Precio_instanteId_fkey" FOREIGN KEY ("instanteId") REFERENCES "Instante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Precio_symbolId_fkey" FOREIGN KEY ("symbolId") REFERENCES "Symbol" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Symbol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_nombre_key" ON "Symbol"("nombre");
