import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload-ts';
import { UploadScalar } from '../common/scalars/upload.scalars';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderOutput } from './dto/order.output';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => OrderOutput, { nullable: true })
  getOrder(@Args('orderId') orderId: string): Promise<OrderOutput | null> {
    return this.orderService.getOrder(orderId);
  }

  @Query(() => [OrderOutput])
  listOrder(): Promise<OrderOutput[]> {
    return this.orderService.listOrder();
  }

  @Mutation(() => OrderOutput)
  async submitOrder(
    @Args({ name: 'file', type: () => UploadScalar }) file: FileUpload,
    @Args('settings') settings: CreateOrderInput,
  ): Promise<OrderOutput> {
    return this.orderService.createOrder(file, settings);
  }
}
