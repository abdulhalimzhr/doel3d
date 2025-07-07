import { Module } from '@nestjs/common';
import { UploadResolver } from './upload.resolver';
import { EstimatorModule } from '../estimator/estimator.module';

@Module({
  imports: [EstimatorModule],
  providers: [UploadResolver],
})
export class UploadModule {}
