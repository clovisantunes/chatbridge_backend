import { Module } from '@nestjs/common';
import { ConceptsManualController } from './concepts_manual.controller';

@Module({
  controllers: [ConceptsManualController],
})
export class ConceptsManualModule {}
