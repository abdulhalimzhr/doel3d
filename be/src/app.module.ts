import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Modules
import { UploadModule } from './upload/upload.module';
import { OrderModule } from './order/order.module';
import { EstimatorModule } from './estimator/estimator.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      csrfPrevention: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    UploadModule,
    OrderModule,
    EstimatorModule,
    PrismaModule,
  ],
})
export class AppModule {}
