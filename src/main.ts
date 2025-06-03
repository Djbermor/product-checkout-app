import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // ✅ Headers de seguridad OWASP
  app.use(helmet())

  // ✅ Habilitar CORS para permitir peticiones desde Vite (http://localhost:5173)
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  })

  // ✅ Activar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  )

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') || 3000

  await app.listen(port)
  console.log(`🚀 App running on http://localhost:${port}`)
}
bootstrap()