// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
    { name: 'Camisa Blanca', description: 'Camisa de algodón talla M', price: 95000, stock: 10 },
    { name: 'Pantalón Jean', description: 'Pantalón azul clásico', price: 125000, stock: 15 },
    { name: 'Zapatos Negros', description: 'Zapatos de cuero talla 42', price: 180000, stock: 5 },
    { name: 'Sudadera Gris', description: 'Sudadera de algodón unisex', price: 89000, stock: 12 },
    { name: 'Gorra Negra', description: 'Gorra ajustable con logo bordado', price: 45000, stock: 20 },
    { name: 'Camiseta Roja', description: 'Camiseta deportiva talla L', price: 65000, stock: 18 },
    { name: 'Chaqueta de Cuero', description: 'Chaqueta negra talla M', price: 250000, stock: 6 },
    { name: 'Reloj Deportivo', description: 'Reloj resistente al agua', price: 320000, stock: 9 },
    { name: 'Bufanda Azul', description: 'Bufanda de lana gruesa', price: 40000, stock: 14 },
    { name: 'Tenis Blancos', description: 'Tenis casuales talla 41', price: 160000, stock: 8 },
    { name: 'Medias Deportivas', description: 'Par de medias negras', price: 18000, stock: 50 },
    { name: 'Gafas de Sol', description: 'Gafas polarizadas unisex', price: 98000, stock: 13 },
    { name: 'Pantaloneta de Playa', description: 'Talla XL con estampado tropical', price: 72000, stock: 7 },
    { name: 'Chaleco Reflectivo', description: 'Para ciclismo nocturno', price: 30000, stock: 11 },
    { name: 'Camisa Manga Larga', description: 'Color azul cielo talla L', price: 87000, stock: 10 },
    { name: 'Bolso de Cuero', description: 'Bolso mediano marrón', price: 195000, stock: 4 },
    { name: 'Zapatos Deportivos', description: 'Para correr, talla 43', price: 210000, stock: 6 },
    { name: 'Short Deportivo', description: 'Short seco rápido', price: 54000, stock: 15 },
    { name: 'Sombrero de Paja', description: 'Talla única para verano', price: 39000, stock: 5 },
    { name: 'Camiseta Blanca', description: 'Básica cuello redondo', price: 40000, stock: 30 },
    { name: 'Correa Negra', description: 'De cuero con hebilla metálica', price: 65000, stock: 10 },
    { name: 'Maleta Escolar', description: 'Espalda acolchada', price: 130000, stock: 7 },
    { name: 'Pijama Algodón', description: 'Talla M diseño lunares', price: 59000, stock: 9 },
    { name: 'Guantes Invierno', description: 'Tejidos color gris', price: 29000, stock: 18 },
    { name: 'Blusa Elegante', description: 'Color vino manga 3/4', price: 88000, stock: 6 },
    { name: 'Vestido Floral', description: 'Vestido largo estampado talla S', price: 120000, stock: 5 },
    { name: 'Camiseta Negra', description: 'Básica cuello en V', price: 43000, stock: 25 },
    { name: 'Falda Plisada', description: 'Color beige talla M', price: 74000, stock: 10 },
    { name: 'Botas Marrones', description: 'Botas de invierno talla 38', price: 185000, stock: 4 },
    { name: 'Chaqueta Impermeable', description: 'Con capucha y cierre', price: 138000, stock: 7 },
    { name: 'Camibuso Deportivo', description: 'Para ciclismo manga larga', price: 97000, stock: 6 },
    { name: 'Leggins Deportivos', description: 'Color negro talla L', price: 65000, stock: 9 },
    { name: 'Tennis Running', description: 'Para alto impacto', price: 230000, stock: 8 },
    { name: 'Polo Hombre', description: 'Color verde oliva', price: 79000, stock: 12 },
    { name: 'Cinturón Trenzado', description: 'Café oscuro unisex', price: 47000, stock: 11 },
    { name: 'Paraguas Compacto', description: 'Resistente al viento', price: 39000, stock: 10 },
    { name: 'Reloj Casual', description: 'Correa de cuero sintético', price: 150000, stock: 6 },
    { name: 'Chaleco Acolchado', description: 'Talla XL color negro', price: 128000, stock: 5 },
    { name: 'Bermuda Cargo', description: 'Bolsillos amplios', price: 72000, stock: 14 },
    { name: 'Mono Enterizo', description: 'Talla única color vino', price: 112000, stock: 7 },
    { name: 'Calcetines Altos', description: '3 pares, talla universal', price: 25000, stock: 40 },
    { name: 'Zapatillas Casa', description: 'Suela antideslizante', price: 33000, stock: 20 },
    { name: 'Poncho Lluvia', description: 'Transparente talla única', price: 19000, stock: 10 },
    { name: 'Chaqueta Jean', description: 'Clásica con botones', price: 140000, stock: 6 },
    { name: 'Falda Larga', description: 'Color negro con abertura lateral', price: 99000, stock: 4 },
    { name: 'Blusa Casual', description: 'Manga corta con encaje', price: 73000, stock: 7 },
    { name: 'T-shirt Oversize', description: 'Color beige unisex', price: 55000, stock: 13 },
    { name: 'Sudadera Completa', description: 'Conjunto deportivo gris', price: 165000, stock: 9 },
    { name: 'Bufanda Circular', description: 'Tejida en lana suave', price: 28000, stock: 16 },
    { name: 'Bolso de Mano', description: 'Color negro elegante', price: 105000, stock: 5 }
  ]

  for (const data of products) {
    await prisma.product.create({ data })
  }

  console.log('🌱 Seed ejecutado: 50 productos creados.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
