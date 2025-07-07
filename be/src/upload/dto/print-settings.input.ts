import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class PrintSettingsInput {
  @Field(() => Float) layerHeight: number;
  @Field(() => Int) wallCount: number;
  @Field(() => Int) topLayerCount: number;
  @Field(() => Int) bottomLayerCount: number;
  @Field(() => Int) infillPercentage: number;
  @Field() material: 'PLA' | 'PETG';

  @Field(() => Float, { defaultValue: 0.4 }) nozzleWidth: number;
  @Field(() => Float, { defaultValue: 210 }) printSpeed: number;
  @Field(() => Float, { defaultValue: 1.24 }) density: number;
}
