import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  scheduledDate: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        scheduledDate: new Date(dto.scheduledDate),
      },
      select: TASK_SELECT,
    });
  }

  findAll(userId: string, query: ListTasksQueryDto) {
    const where: Prisma.TaskWhereInput = { userId };

    if (query.scheduledDate) {
      where.scheduledDate = new Date(query.scheduledDate);
    }

    return this.prisma.task.findMany({
      where,
      select: TASK_SELECT,
      orderBy: [{ scheduledDate: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
      select: TASK_SELECT,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    await this.findOne(userId, taskId);

    const data: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      data.description = dto.description?.trim() || null;
    }

    if (dto.scheduledDate !== undefined) {
      data.scheduledDate = new Date(dto.scheduledDate);
    }

    if (dto.completed !== undefined) {
      data.completed = dto.completed;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data,
      select: TASK_SELECT,
    });
  }

  async remove(userId: string, taskId: string) {
    const result = await this.prisma.task.deleteMany({
      where: { id: taskId, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
