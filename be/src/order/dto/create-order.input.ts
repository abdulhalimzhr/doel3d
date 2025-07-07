import { Field, InputType, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field() name: string;
  @Field() email: string;
  @Field(() => Float) layerHeight: number;
  @Field(() => Int) wallCount: number;
  @Field(() => Int) topLayerCount: number;
  @Field(() => Int) bottomLayerCount: number;
  @Field(() => Int) infillPercentage: number;
  @Field() material: 'PLA' | 'PETG';
  @Field(() => Float) nozzleWidth: number;
  @Field(() => Float) printSpeed: number;
  @Field(() => Float) density: number;
}
