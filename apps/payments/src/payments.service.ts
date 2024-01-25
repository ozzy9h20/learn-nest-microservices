import { Injectable } from '@nestjs/common';
import { SnapService } from '@ruraim/nestjs-midtrans';
import { CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
  constructor(private readonly snapService: SnapService) {}

  charge(data: CreateChargeDto) {
    return this.snapService.transaction({
      transaction_details: {
        order_id: `SANDBOX_${Date.now()}`,
        gross_amount: data.amount,
      },
      credit_card: {
        secure: true,
      },
    });
  }
}
