import '@testing-library/jest-dom'


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
process.env.VITE_API_URL = 'http://localhost:4000'
process.env.VITE_WOMPI_PUBLIC_KEY = 'test_pusblic_key'
process.env.VITE_WOMPI_API_URL = 'https://sandbox.wompi.co/v1'