import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/httpException.filter';
import { PrismaClientExceptionFilter } from './common/filters/prismaClientException.filter';
import { RemoveUserIdInterceptor } from './common/interceptors/removeUserID.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  dotenv.config();
	app.enableCors({
		origin: [
			'http://localhost:3000',
		],
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
	});

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	app.useGlobalFilters(
		new HttpExceptionFilter(),
		new PrismaClientExceptionFilter(),
	);
	app.useGlobalInterceptors(new RemoveUserIdInterceptor());

	const config = new DocumentBuilder()
		.setTitle('Flavor API')
		.setDescription('API documentation for Flavor application')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	const PORT = process.env.PORT;
	if (!PORT) throw new Error('No PORT specified in env file');

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
