# AI Agent Rules & Project Standards

## DTO & Mapping Patterns

### 1. Separation of Concerns
- **Strict Separation:** Never expose Database Entities directly in Controller responses.
- **Service Inputs:** Use Interfaces for Service inputs to decouple Services from HTTP-specific DTOs.
- **Service Outputs:** Services should return Entities or Domain Objects, not Response DTOs.

### 2. Response DTOs
- **Structure:** Define Response DTOs as simple **Classes**.
  - Why: Better integration with Swagger/OpenAPI compared to interfaces.
- **No Runtime Decorators:** Do **NOT** use `class-transformer` decorators (like `@Expose`, `@Exclude`) for runtime transformation.
- **Standard Properties:** Use standard public properties.
- **Example:**
  ```typescript
  export class UserResponseDto {
    id: string;
    name: string;
  }
  ```

### 3. Mapping Strategy
- **Pattern:** Use the **"Manual Mapping"** pattern via static Mapper classes.
- **Performance:** Do **NOT** use `plainToInstance` for response mapping.
  - Why: Reflection is slower and less type-safe than direct assignment.
- **Location:** Place mappers in `*.mapper.ts` files (e.g., `users.mapper.ts`).
- **Implementation:** Mappers must be pure functions or static methods.
- **Example:**
  ```typescript
  export class UsersMapper {
    static toResponse(user: User): UserResponseDto {
      const dto = new UserResponseDto();
      dto.id = user.id;
      dto.name = user.name;
      return dto;
    }
  }
  ```

### 4. Controller Implementation
- **Explicit Call:** Controllers must call the Mapper explicitly before returning.
- **Return Types:** Always specify the explicit return type (e.g., `Promise<UserResponseDto[]>`).
- **Example:**
  ```typescript
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(UsersMapper.toResponse);
  }
  ```

