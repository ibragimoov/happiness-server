import { Module } from '@nestjs/common';
import { CourseChapterService } from './course_chapter.service';
import { CourseChapterController } from './course_chapter.controller';

@Module({
  providers: [CourseChapterService],
  controllers: [CourseChapterController]
})
export class CourseChapterModule {}
