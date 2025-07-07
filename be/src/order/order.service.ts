import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { FileUpload } from 'graphql-upload-ts';
import { Order } from './entities/order.entity';
import { EstimatorService } from '../estimator/estimator.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '../../generated/prisma';
import { nanoid } from 'nanoid/non-secure';

@Injectable()
export class OrderService {
  constructor(
    private readonly estimatorService: EstimatorService,
    private readonly prisma: PrismaService,
  ) {}

  async createOrder(file: FileUpload, input: CreateOrderInput): Promise<Order> {
    const estimation = await this.estimatorService.estimate(file, input);

    const orderId = `DOEL-${nanoid(8)}`;

    const created = await (this.prisma as PrismaClient).order.create({
      data: {
        orderId: orderId,
        name: input.name,
        email: input.email,
        filename: estimation.filename,
        volume: estimation.volume,
        weight: estimation.weight,
        materialCost: estimation.materialCost,
        timeInHours: estimation.timeInHours,
        timeCost: estimation.timeCost,
        totalCost: estimation.totalCost,
      },
    });

    return created;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { orderId } });
  }
}
