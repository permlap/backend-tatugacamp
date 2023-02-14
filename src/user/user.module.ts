import { ClassroomModule } from './classroom/classroom.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StudentModule } from './student/student.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [StudentModule, ClassroomModule],
})
export class UserModule {}
