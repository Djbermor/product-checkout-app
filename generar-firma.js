import * as crypto from 'crypto';

// Concatenar los valores en orden

function generarFirmaWompi(dto, reference) {
  const integrityKey = 'stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp';

  if (!integrityKey) {
    throw new Error('❌ WOMPI_INTEGRITY_SECRET no definido en el archivo .env');
  }

  const stringToSign = `${reference}${dto.amountInCents}${dto.currency}${integrityKey}`;

  const signature = crypto.createHash('sha256').update(stringToSign).digest('hex');

  return signature;
}

const dto = {
  amountInCents: 1000000,
  currency: 'COP',
  customerEmail: 'prueba@example.com' // opcional, no se usa en este hash
};

const reference = 'checkout-32c20f7b-89b3-469c-a11c-ec37ea7b4c11';

const firma = generarFirmaWompi(dto, reference);
console.log('🧾 Firma generada:', firma);
