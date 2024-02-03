import { Inject, Injectable } from '@nestjs/common';
import { SnapService } from '@ruraim/nestjs-midtrans';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly snapService: SnapService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async charge(data: PaymentsCreateChargeDto) {
    const paymentIntent = await this.snapService.transaction({
      transaction_details: {
        order_id: `SANDBOX_${Date.now()}`,
        gross_amount: data.amount,
      },
      credit_card: {
        secure: true,
      },
    });

    this.notificationService.emit('notify_email', { email: data.email });

    return paymentIntent;
  }
}
