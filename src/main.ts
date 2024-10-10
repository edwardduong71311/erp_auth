import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Auth Service')
        .setDescription('The defender you need')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Expose Swagger json file to path */swagger/json
    SwaggerModule.setup('swagger', app, document, {
        jsonDocumentUrl: 'swagger/json',
    });

    // Setup Helmet
    app.use(
        helmet({
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: {
                directives: {
                    imgSrc: [`'self'`, 'data:', 'abc.edward.com'],
                    scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
                    manifestSrc: [`'self'`, 'abc.edward.com'],
                    frameSrc: [`'self'`, 'abc.edward.com'],
                },
            },
        }),
    );

    // Setup CORS
    app.enableCors({
        origin: ['http://localhost:3001'],
        methods: ['GET', 'PUT', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Add versioning on header
    app.enableVersioning({
        type: VersioningType.HEADER,
        header: 'AppVersion',
    });

    await app.listen(3000);
}
bootstrap();
