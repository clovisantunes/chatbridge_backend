import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceptsManualModule } from 'src/concepts_manual/concepts_manual.module';
import { ConceptsAutomaticModule } from 'src/concepts_automatic/concepts_automatic.module';

@Module({
  imports: [ConceptsManualModule, ConceptsAutomaticModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
