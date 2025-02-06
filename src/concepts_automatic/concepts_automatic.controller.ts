import { Controller, Get } from '@nestjs/common';

@Controller('concepts_automatic')
export class ConceptsAutomaticController {
    @Get()
    home() : string {
        return 'Welcome to the concepts automatic module';
    }
}
