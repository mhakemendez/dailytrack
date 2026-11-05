import { IsDateString, IsOptional } from 'class-validator';

export class ListTasksQueryDto {
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;
}
