// src/common/scalars/upload.scalar.ts
import { Scalar } from '@nestjs/graphql';
import { GraphQLUpload as UploadScalar } from 'graphql-upload-ts';

@Scalar('Upload', () => UploadScalar)
export class GraphQLUpload {}

export { UploadScalar };
