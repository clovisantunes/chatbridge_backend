export class CreateAutomaticMessageDto {
    name: string;
    description?: string;
    sector: string;
    steps: CreateStepDto[];
  }
  
  export class CreateStepDto {
    content: string;
    options: CreateOptionDto[];
    order: number;
  }
  
  export class CreateOptionDto {
    label: string;
    nextStepId?: number; // ID da próxima etapa (opcional)
  }