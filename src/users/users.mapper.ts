import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

export class UsersMapper {
  static toResponse(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.role = user.role;
    dto.image = user.image;
    return dto;
  }
}
