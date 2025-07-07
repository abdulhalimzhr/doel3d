import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field() orderId: string;
  @Field() name: string;
  @Field() email: string;

  @Field() filename: string;

  @Field(() => Int)
  volume: number;

  @Field(() => Float)
  weight: number;

  @Field(() => Int)
  materialCost: number;

  @Field(() => Float)
  timeInHours: number;

  @Field(() => Int)
  timeCost: number;

  @Field(() => Int)
  totalCost: number;

  @Field() createdAt: Date;
}
