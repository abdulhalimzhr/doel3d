import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { EstimatorModule } from 'src/estimator/estimator.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [EstimatorModule, PrismaModule],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
