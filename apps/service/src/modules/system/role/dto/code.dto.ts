import { ApiModel, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { ROLE_CODE, ROLE_CODE_MAX, ROLE_CODE_MIN } from '../role.constant'

@ApiModel(
  {
    roleCode: { type: String, description: ROLE_CODE, minLength: ROLE_CODE_MIN, maxLength: ROLE_CODE_MAX, example: ROLE_CODE },
  },
  { description: ROLE_CODE },
)
export class RoleCodeDTO {
  @InputStringLength(ROLE_CODE_MIN, ROLE_CODE_MAX, ROLE_CODE)
  @InputSpace(ROLE_CODE)
  @NotEmpty(ROLE_CODE)
  roleCode: string
}
