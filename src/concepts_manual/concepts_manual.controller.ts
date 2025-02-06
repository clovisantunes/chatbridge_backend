import { Controller, Get } from '@nestjs/common';

@Controller('concepts_manual')
export class ConceptsManualController {
    @Get()
    home(): string {
        return 'Welcome to the concepts manual module';
    }
}