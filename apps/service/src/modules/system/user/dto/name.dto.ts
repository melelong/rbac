import type { INameDTO } from '@packages/types'
import { ApiModel, InputSpace, InputStringLength, NotEmpty } from '@/common/decorators'
import { USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '../user.constant'

@ApiModel(
  {
    name: { type: String, description: USER_NAME, minLength: USER_NAME_MIN, maxLength: USER_NAME_MAX, example: 'admin' },
  },
  { description: USER_NAME },
)
export class UserNameDTO implements INameDTO {
  @InputStringLength(USER_NAME_MIN, USER_NAME_MAX, USER_NAME)
  @InputSpace(USER_NAME)
  @NotEmpty(USER_NAME)
  name: string
}
