import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload-ts';
import { readdirSync } from 'fs';
import { join } from 'path';
import { UploadScalar } from '../common/scalars/upload.scalars';
import { PrintSettingsInput } from './dto/print-settings.input';
import { EstimationResult } from './dto/estimation-result.output';
import { EstimatorService } from '../estimator/estimator.service';

@Resolver()
export class UploadResolver {
  constructor(private readonly estimatorService: EstimatorService) {}

  @Query(() => [String])
  listUploadedFiles(): Promise<string[]> {
    const dir = join(process.cwd(), 'uploads');
    const files = readdirSync(dir);
    return Promise.resolve(files);
  }

  @Mutation(() => EstimationResult)
  async estimatePrintCost(
    @Args({ name: 'file', type: () => UploadScalar }) file: FileUpload,
    @Args('settings') settings: PrintSettingsInput,
  ): Promise<EstimationResult> {
    return this.estimatorService.estimate(file, settings);
  }
}
