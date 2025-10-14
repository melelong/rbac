import type { INameDTO } from '@packages/types'
import { ApiModel, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ROLE_NAME, ROLE_NAME_MAX, ROLE_NAME_MIN } from '../role.constant'

@ApiModel(
  {
    name: { type: String, description: ROLE_NAME, minLength: ROLE_NAME_MIN, maxLength: ROLE_NAME_MAX, example: ROLE_NAME },
  },
  { description: ROLE_NAME },
)
export class RoleNameDTO implements INameDTO {
  @InputStringLength(ROLE_NAME_MIN, ROLE_NAME_MAX, ROLE_NAME)
  @InputSpace(ROLE_NAME)
  @NotEmpty(ROLE_NAME)
  name: string
}
