import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { MidtransModule } from '@ruraim/nestjs-midtrans';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MIDTRANS_MERCHANT_ID: Joi.string().required(),
        MIDTRANS_CLIENT_KEY: Joi.string().required(),
        MIDTRANS_SERVER_KEY: Joi.string().required(),
        MIDTRANS_MODE: Joi.string().valid('production', 'sandbox'),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
      }),
    }),
    MidtransModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        merchantId: configService.get<string>('MIDTRANS_MERCHANT_ID'),
        clientKey: configService.get<string>('MIDTRANS_CLIENT_KEY'),
        serverKey: configService.get<string>('MIDTRANS_SERVER_KEY'),
        sandbox: configService.get<string>('MIDTRANS_MODE') === 'sandbox',
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
