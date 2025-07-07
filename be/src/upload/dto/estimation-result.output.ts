import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class EstimationResult {
  @Field() filename: string;

  @Field(() => Int) volume: number; // mm³
  @Field(() => Float) weight: number; // grams
  @Field(() => Int) materialCost: number; // in IDR
  @Field(() => Float) timeInHours: number;
  @Field(() => Int) timeCost: number;
  @Field(() => Int) totalCost: number;
}
