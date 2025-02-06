import { Module } from '@nestjs/common';
import { ConceptsAutomaticController } from './concepts_automatic.controller';

@Module({
  controllers: [ConceptsAutomaticController]
})
export class ConceptsAutomaticModule {}
