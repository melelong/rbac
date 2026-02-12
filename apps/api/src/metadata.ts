/* eslint-disable */
export default async () => {
  const t = {
    ['../../../packages/types/dist/index']: await import('../../../packages/types/dist/index'),
    ['./modules/rbac/role/domain/entities/impl/role.entity']: await import('./modules/rbac/role/domain/entities/impl/role.entity'),
    ['./modules/rbac/menu/domain/entities/impl/menu-tree.entity']: await import('./modules/rbac/menu/domain/entities/impl/menu-tree.entity'),
    ['./modules/rbac/menu/domain/entities/impl/menu.entity']: await import('./modules/rbac/menu/domain/entities/impl/menu.entity'),
    ['./modules/rbac/menu/app/vo/menu-details.vo']: await import('./modules/rbac/menu/app/vo/menu-details.vo'),
    ['./modules/rbac/menu/app/vo/menu-tree.vo']: await import('./modules/rbac/menu/app/vo/menu-tree.vo'),
    ['./modules/rbac/user/domain/entities/impl/user-profile.entity']: await import('./modules/rbac/user/domain/entities/impl/user-profile.entity'),
    ['./modules/rbac/user/domain/entities/impl/user.entity']: await import('./modules/rbac/user/domain/entities/impl/user.entity'),
    ['./modules/rbac/user/app/vo/user-profile.vo']: await import('./modules/rbac/user/app/vo/user-profile.vo'),
    ['./modules/rbac/user/app/vo/user-details.vo']: await import('./modules/rbac/user/app/vo/user-details.vo'),
    ['./modules/rbac/role/app/vo/role-details.vo']: await import('./modules/rbac/role/app/vo/role-details.vo'),
    ['./modules/rbac/role/app/vo/role-tree.vo']: await import('./modules/rbac/role/app/vo/role-tree.vo'),
    ['./modules/rbac/resource/app/vo/resource-details.vo']: await import('./modules/rbac/resource/app/vo/resource-details.vo'),
    ['./modules/rbac/resource/domain/entities/impl/resource.entity']: await import('./modules/rbac/resource/domain/entities/impl/resource.entity'),
    ['./modules/rbac/role/domain/entities/impl/role-tree.entity']: await import('./modules/rbac/role/domain/entities/impl/role-tree.entity'),
    ['./modules/auth/app/vo/auth-details.vo']: await import('./modules/auth/app/vo/auth-details.vo'),
    ['./modules/auth/app/vo/svg-captcha.vo']: await import('./modules/auth/app/vo/svg-captcha.vo'),
    ['./modules/auth/app/vo/token.vo']: await import('./modules/auth/app/vo/token.vo'),
    ['./modules/auth/app/vo/find-all-auth.vo']: await import('./modules/auth/app/vo/find-all-auth.vo'),
    ['./modules/rbac/menu/app/vo/find-all-menu.vo']: await import('./modules/rbac/menu/app/vo/find-all-menu.vo'),
    ['./modules/rbac/resource/app/vo/find-all-resource.vo']: await import('./modules/rbac/resource/app/vo/find-all-resource.vo'),
    ['./modules/rbac/menu/app/vo/menu-ids.vo']: await import('./modules/rbac/menu/app/vo/menu-ids.vo'),
    ['./modules/rbac/role/app/vo/role-ids.vo']: await import('./modules/rbac/role/app/vo/role-ids.vo'),
    ['./modules/rbac/resource/app/vo/resource-ids.vo']: await import('./modules/rbac/resource/app/vo/resource-ids.vo'),
    ['./modules/rbac/role/app/vo/find-all-role.vo']: await import('./modules/rbac/role/app/vo/find-all-role.vo'),
    ['./modules/rbac/user/app/vo/user-ids.vo']: await import('./modules/rbac/user/app/vo/user-ids.vo'),
    ['./modules/rbac/user/app/vo/find-all-user.vo']: await import('./modules/rbac/user/app/vo/find-all-user.vo'),
  }
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./common/dto/find-all.dto'),
          {
            FindAllDTO: {
              page: { required: false, type: () => Number, description: '\u7B2C\u51E0\u9875', example: 1, minimum: 1, maximum: 200 },
              limit: {
                required: false,
                type: () => Number,
                description: '\u4E00\u9875\u51E0\u6761\u6570\u636E',
                example: 10,
                minimum: 1,
                maximum: 2000,
              },
              keyword: { required: false, type: () => String, description: '\u641C\u7D22\u5173\u952E\u8BCD', example: '\u5F20\u4E09' },
              orderBy: {
                required: false,
                description: '\u6392\u5E8F\u5B57\u6BB5(\u521B\u5EFA\u65F6\u95F4:createdAt \u66F4\u65B0\u65F6\u95F4:updatedAt \u540D\u79F0:name)',
                example: 'createdAt',
                enum: t['../../../packages/types/dist/index'].OrderByTypeEnum,
              },
              orderType: {
                required: false,
                description: '\u6392\u5E8F\u65B9\u5F0F(\u5347\u5E8F:asc \u964D\u5E8F:desc)',
                example: 'asc',
                enum: t['../../../packages/types/dist/index'].OrderTypeEnum,
              },
            },
          },
        ],
        [
          import('./common/dto/get-tree-depth.dto'),
          {
            GetTreeDepthDTO: {
              depth: {
                required: false,
                type: () => Number,
                description: '\u6811\u6DF1\u5EA6,-1\u662F\u6DF1\u5EA6\u65E0\u9650\u5236',
                example: -1,
                minimum: -1,
              },
            },
          },
        ],
        [
          import('./common/dto/ids.dto'),
          {
            IdsDTO: {
              ids: {
                required: true,
                type: () => [String],
                description: '\u4E1A\u52A1ID\u5217\u8868',
                example: ['xxx', 'xxx'],
                uniqueItems: true,
                minLength: 36,
                maxLength: 36,
              },
            },
          },
        ],
        [
          import('./common/dto/get-trees.dto'),
          {
            GetTreesDTO: {
              depth: {
                required: false,
                type: () => Number,
                description: '\u6811\u6DF1\u5EA6,-1\u662F\u6DF1\u5EA6\u65E0\u9650\u5236',
                example: -1,
                minimum: -1,
              },
            },
          },
        ],
        [
          import('./common/dto/id.dto'),
          { IdDTO: { id: { required: true, type: () => String, description: '\u4E1A\u52A1ID', example: 'xxx', minLength: 36, maxLength: 36 } } },
        ],
        [
          import('./common/dto/update-sort.dto'),
          {
            UpdateSortDTO: {
              sort: {
                required: true,
                description:
                  '\u6392\u5E8F\u4F18\u5148\u7EA7(\u4F4E\u4F18\u5148\u7EA7:10 \u4E2D\u7B49\u4F18\u5148\u7EA7:20 \u9AD8\u4F18\u5148\u7EA7:30)',
                example: 10,
                default: 10,
                enum: t['../../../packages/types/dist/index'].SortEnum,
              },
            },
          },
        ],
        [
          import('./common/dto/update-status.dto'),
          {
            UpdateStatusDTO: {
              status: {
                required: true,
                description: '\u72B6\u6001(\u672A\u77E5:10 \u542F\u7528:20 \u7981\u7528:30)',
                example: 20,
                default: 20,
                enum: t['../../../packages/types/dist/index'].StatusEnum,
              },
            },
          },
        ],
        [
          import('./common/entities/common.entity'),
          {
            CommonEntity: {
              _id: { required: true, type: () => Number },
              id: { required: true, type: () => String },
              createdBy: { required: true, type: () => String },
              updatedBy: { required: true, type: () => String },
              deletedBy: { required: true, type: () => String, nullable: true },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
              deletedAt: { required: true, type: () => Date, nullable: true },
              remark: { required: true, type: () => String, nullable: true },
              status: { required: true, enum: t['../../../packages/types/dist/index'].StatusEnum },
              sort: { required: true, enum: t['../../../packages/types/dist/index'].SortEnum },
            },
          },
        ],
        [
          import('./modules/rbac/menu/domain/entities/impl/menu.entity'),
          {
            MenuEntity: {
              parentId: { required: true, type: () => String, nullable: true },
              name: { required: true, type: () => String },
              menuCode: { required: true, type: () => String },
              domain: { required: true, type: () => String },
              action: { required: true, type: () => String },
              path: { required: true, type: () => String, nullable: true },
              query: { required: true, type: () => String, nullable: true },
              component: { required: true, type: () => String, nullable: true },
              icon: { required: true, type: () => String, nullable: true },
              isCache: { required: true, enum: t['../../../packages/types/dist/index'].CheckEnum },
              isVisible: { required: true, enum: t['../../../packages/types/dist/index'].CheckEnum },
              isRefresh: { required: true, enum: t['../../../packages/types/dist/index'].CheckEnum },
              menuType: { required: true, enum: t['../../../packages/types/dist/index'].MenuTypeEnum },
              roles: { required: true, type: () => [t['./modules/rbac/role/domain/entities/impl/role.entity'].RoleEntity] },
              ancestorNodes: { required: true, type: () => [t['./modules/rbac/menu/domain/entities/impl/menu-tree.entity'].MenuTreeEntity] },
              descendantNodes: { required: true, type: () => [t['./modules/rbac/menu/domain/entities/impl/menu-tree.entity'].MenuTreeEntity] },
            },
          },
        ],
        [
          import('./modules/rbac/menu/domain/entities/impl/menu-tree.entity'),
          {
            MenuTreeEntity: {
              ancestorId: { required: true, type: () => String },
              descendantId: { required: true, type: () => String },
              depth: { required: true, type: () => Number },
              ancestorMenu: { required: true, type: () => t['./modules/rbac/menu/domain/entities/impl/menu.entity'].MenuEntity },
              descendantMenu: { required: true, type: () => t['./modules/rbac/menu/domain/entities/impl/menu.entity'].MenuEntity },
            },
          },
        ],
        [
          import('./common/vo/base.vo'),
          {
            BaseVO: {
              name: { required: true, type: () => String, description: '\u4E1A\u52A1\u540D(\u9700\u8981\u5B50\u7C7B\u5B9E\u73B0)' },
              id: { required: true, type: () => String },
              createdBy: { required: true, type: () => String, description: '\u521B\u5EFA\u8005', example: 'xxx' },
              updatedBy: { required: true, type: () => String, description: '\u66F4\u65B0\u8005', example: 'xxx' },
              createdAt: { required: true, type: () => Date, description: '\u521B\u5EFA\u65F6\u95F4', example: 'xxx' },
              updatedAt: { required: true, type: () => Date, description: '\u66F4\u65B0\u65F6\u95F4', example: 'xxx' },
              remark: { required: true, type: () => String, nullable: true, description: '\u5907\u6CE8', example: '' },
              status: {
                required: true,
                description: '\u72B6\u6001(\u672A\u77E5:10 \u542F\u7528:20 \u7981\u7528:30)',
                example: 20,
                enum: t['../../../packages/types/dist/index'].StatusEnum,
              },
              sort: {
                required: true,
                description:
                  '\u6392\u5E8F\u4F18\u5148\u7EA7(\u4F4E\u4F18\u5148\u7EA7:10 \u4E2D\u7B49\u4F18\u5148\u7EA7:20 \u9AD8\u4F18\u5148\u7EA7:30)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].SortEnum,
              },
            },
          },
        ],
        [
          import('./common/vo/find-all.vo'),
          {
            FindAllVO: {
              data: { required: true, description: '\u8BE6\u60C5\u5217\u8868(\u9700\u8981\u5B50\u7C7B\u5B9E\u73B0)' },
              total: { required: true, type: () => Number, description: '\u603B\u6570', example: 1000 },
              page: { required: true, type: () => Number, description: '\u7B2C\u51E0\u9875', example: 1 },
              limit: { required: true, type: () => Number, description: '\u4E00\u9875\u51E0\u6761\u6570\u636E', example: 100 },
              totalPages: { required: true, type: () => Number, description: '\u603B\u9875\u6570', example: 200 },
            },
          },
        ],
        [
          import('./common/vo/res.vo'),
          {
            ResVO: {
              code: { required: true, type: () => String, description: '\u4E1A\u52A1\u7801', example: '0' },
              msg: { required: true, type: () => String, description: '\u4E1A\u52A1\u4FE1\u606F', example: '\u64CD\u4F5C\u6210\u529F' },
              data: { required: true, type: () => Object, description: '\u4E1A\u52A1\u6570\u636E(\u5BF9\u8C61\u6216\u6570\u7EC4)' },
              originUrl: { required: true, type: () => String, description: '\u8BF7\u6C42\u5730\u5740', example: 'xxx' },
              referer: { required: true, type: () => String, description: '\u8BF7\u6C42\u6E90', example: 'xxx' },
              userAgent: { required: true, type: () => String, description: '\u5BA2\u6237\u7AEF\u4FE1\u606F', example: 'xxx' },
              timestamp: { required: true, type: () => Number, description: '\u65F6\u95F4\u6233', example: 1672531200000 },
              clientIp: { required: true, type: () => String, description: '\u5BA2\u6237\u7AEFIP', example: 'xxx' },
            },
          },
        ],
        [
          import('./modules/rbac/menu/app/vo/menu-details.vo'),
          {
            MenuDetailsVO: {
              parentId: {
                required: true,
                type: () => String,
                nullable: true,
                description: '\u83DC\u5355\u7236\u8282\u70B9ID',
                example: '\u83DC\u5355\u7236\u8282\u70B9ID',
              },
              id: { required: true, type: () => String, description: '\u83DC\u5355ID', example: 'xxx' },
              name: { required: true, type: () => String, description: '\u83DC\u5355\u540D', example: '\u83DC\u5355\u540D' },
              menuCode: {
                required: true,
                type: () => String,
                description: '\u83DC\u5355\u7F16\u7801(\u83DC\u5355\u7C7B\u578B:\u9886\u57DF:\u64CD\u4F5C\u7C7B\u578B)',
                example: 'MENU:USER:MANAGEMENT',
              },
              menuType: {
                required: true,
                description: '\u83DC\u5355\u7C7B\u578B',
                example: 10,
                enum: t['../../../packages/types/dist/index'].MenuTypeEnum,
              },
              domain: { required: true, type: () => String, description: '\u83DC\u5355\u9886\u57DF', example: 'USER' },
              action: { required: true, type: () => String, description: '\u83DC\u5355\u64CD\u4F5C\u7C7B\u578B', example: 'MANAGEMENT' },
              path: {
                required: true,
                type: () => String,
                nullable: true,
                description: '\u8BBF\u95EE\u8DEF\u5F84(MENU,LINK,INNER_LINK)',
                example: '/user',
              },
              query: { required: true, type: () => String, nullable: true, description: '\u8DEF\u7531\u53C2\u6570(MENU)', example: '"{id:"xxx"}"' },
              component: {
                required: true,
                type: () => String,
                nullable: true,
                description: '\u7EC4\u4EF6\u8DEF\u5F84(COMPONENT)',
                example: 'UserButton',
              },
              icon: {
                required: true,
                type: () => String,
                nullable: true,
                description: '\u56FE\u6807\u5730\u5740(MENU,DIRECTORY,LINK,INNER_LINK)',
                example: 'https://www.icon.com',
              },
              isCache: {
                required: true,
                description: '\u662F\u5426\u7F13\u5B58(MENU,COMPONENT,INNER_LINK)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              isVisible: {
                required: true,
                description: '\u662F\u5426\u9690\u85CF(MENU)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              isRefresh: {
                required: true,
                description: '\u662F\u5426\u5237\u65B0(MENU)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
            },
          },
        ],
        [
          import('./modules/rbac/menu/app/vo/find-all-menu.vo'),
          {
            FindAllMenuVO: {
              data: {
                required: true,
                type: () => [t['./modules/rbac/menu/app/vo/menu-details.vo'].MenuDetailsVO],
                description: '\u83DC\u5355\u8BE6\u60C5\u5217\u8868',
              },
            },
          },
        ],
        [
          import('./modules/rbac/menu/app/vo/menu-ids.vo'),
          { MenuIdsVO: { ids: { required: true, type: () => [String], description: '\u83DC\u5355ID\u5217\u8868', example: [] } } },
        ],
        [
          import('./modules/rbac/menu/app/vo/menu-tree.vo'),
          {
            MenuTreeVO: {
              children: {
                required: true,
                type: () => [t['./modules/rbac/menu/app/vo/menu-tree.vo'].MenuTreeVO],
                description: '\u83DC\u5355\u5B50\u8282\u70B9\u5217\u8868',
                example: [],
              },
            },
          },
        ],
        [
          import('./modules/rbac/menu/app/dto/create-menu.dto'),
          {
            CreateMenuDTO: {
              parentId: { required: false, type: () => String, description: '\u7236\u8282\u70B9ID', example: 'xxx', minLength: 36, maxLength: 36 },
              name: {
                required: true,
                type: () => String,
                description: '\u83DC\u5355\u540D',
                example: '\u83DC\u5355\u540D',
                minLength: 2,
                maxLength: 64,
              },
              menuType: {
                required: true,
                description:
                  '\u83DC\u5355\u7C7B\u578B(10:\u83DC\u5355 20:\u6309\u94AE 30:\u7EC4\u4EF6 40:\u76EE\u5F55 50:\u5916\u94FE 60:\u5185\u94FE)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].MenuTypeEnum,
              },
              domain: { required: true, type: () => String, description: '\u83DC\u5355\u9886\u57DF', example: 'USER', minLength: 2, maxLength: 40 },
              action: {
                required: true,
                type: () => String,
                description: '\u83DC\u5355\u64CD\u4F5C\u7C7B\u578B',
                example: 'MANAGEMENT',
                minLength: 2,
                maxLength: 40,
              },
              path: {
                required: true,
                type: () => String,
                description: '\u8BBF\u95EE\u8DEF\u5F84(MENU,LINK,INNER_LINK)',
                example: '/user',
                minLength: 1,
                maxLength: 2048,
              },
              query: {
                required: false,
                type: () => String,
                description: '\u8DEF\u7531\u53C2\u6570(MENU)',
                example: '"{id:"xxx"}"',
                minLength: 1,
                maxLength: 2048,
              },
              component: {
                required: false,
                type: () => String,
                description: '\u7EC4\u4EF6\u8DEF\u5F84(COMPONENT)',
                example: 'UserButton',
                minLength: 1,
                maxLength: 2048,
              },
              icon: {
                required: false,
                type: () => String,
                description: '\u56FE\u6807\u5730\u5740(MENU,DIRECTORY,LINK,INNER_LINK)',
                example: 'https://www.icon.com',
                minLength: 1,
                maxLength: 2048,
              },
              isCache: {
                required: false,
                description: '\u662F\u5426\u7F13\u5B58(MENU,COMPONENT,INNER_LINK)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              isVisible: {
                required: false,
                description: '\u662F\u5426\u9690\u85CF(MENU)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              isRefresh: {
                required: false,
                description: '\u662F\u5426\u5237\u65B0(MENU)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [import('./modules/rbac/menu/app/dto/menu-id.dto'), { MenuIdDTO: {} }],
        [import('./modules/rbac/menu/app/dto/menu-ids.dto'), { MenuIdsDTO: {} }],
        [
          import('./modules/rbac/menu/app/dto/menu-name.dto'),
          {
            MenuNameDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u83DC\u5355\u540D',
                example: '\u83DC\u5355\u540D',
                minLength: 2,
                maxLength: 64,
              },
            },
          },
        ],
        [
          import('./modules/rbac/menu/app/dto/move-menu.dto'),
          {
            MoveMenuDTO: {
              parentId: { required: false, type: () => String, description: '\u7236\u8282\u70B9ID', example: 'xxx', minLength: 36, maxLength: 36 },
            },
          },
        ],
        [
          import('./modules/rbac/menu/app/dto/update-menu.dto'),
          {
            UpdateMenuDTO: {
              name: {
                required: false,
                type: () => String,
                description: '\u83DC\u5355\u540D',
                example: '\u83DC\u5355\u540D',
                minLength: 2,
                maxLength: 64,
              },
              menuType: {
                required: false,
                description:
                  '\u83DC\u5355\u7C7B\u578B(10:\u83DC\u5355 20:\u6309\u94AE 30:\u7EC4\u4EF6 40:\u76EE\u5F55 50:\u5916\u94FE 60:\u5185\u94FE)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].MenuTypeEnum,
              },
              domain: { required: false, type: () => String, description: '\u83DC\u5355\u9886\u57DF', example: 'USER', minLength: 2, maxLength: 40 },
              action: {
                required: false,
                type: () => String,
                description: '\u83DC\u5355\u64CD\u4F5C\u7C7B\u578B',
                example: 'MANAGEMENT',
                minLength: 2,
                maxLength: 40,
              },
              path: {
                required: false,
                type: () => String,
                description: '\u8BBF\u95EE\u8DEF\u5F84(MENU,LINK,INNER_LINK)',
                example: '/user',
                minLength: 1,
                maxLength: 2048,
              },
              query: {
                required: false,
                type: () => String,
                description: '\u8DEF\u7531\u53C2\u6570(MENU)',
                example: '"{id:"xxx"}"',
                minLength: 1,
                maxLength: 2048,
              },
              component: {
                required: false,
                type: () => String,
                description: '\u7EC4\u4EF6\u8DEF\u5F84(COMPONENT)',
                example: 'UserButton',
                minLength: 1,
                maxLength: 2048,
              },
              icon: {
                required: false,
                type: () => String,
                description: '\u56FE\u6807\u5730\u5740(MENU,DIRECTORY,LINK,INNER_LINK)',
                example: 'https://www.icon.com',
                minLength: 1,
                maxLength: 2048,
              },
              isCache: {
                required: false,
                description: '\u662F\u5426\u7F13\u5B58(MENU,COMPONENT,INNER_LINK)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              isVisible: {
                required: false,
                description: '\u662F\u5426\u9690\u85CF(MENU)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              isRefresh: {
                required: false,
                description: '\u662F\u5426\u5237\u65B0(MENU)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].CheckEnum,
              },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [
          import('./modules/rbac/user/domain/entities/impl/user.entity'),
          {
            UserEntity: {
              name: { required: true, type: () => String },
              pwd: { required: true, type: () => String },
              loginIp: { required: true, type: () => String, nullable: true },
              loginAt: { required: true, type: () => Date, nullable: true },
              pwdUpdateAt: { required: true, type: () => Date, nullable: true },
              pwdUpdateBy: { required: true, type: () => String, nullable: true },
              salt: { required: true, type: () => String },
              profile: { required: true, type: () => t['./modules/rbac/user/domain/entities/impl/user-profile.entity'].UserProfileEntity },
              roles: { required: true, type: () => [t['./modules/rbac/role/domain/entities/impl/role.entity'].RoleEntity] },
            },
          },
        ],
        [
          import('./modules/rbac/user/domain/entities/impl/user-profile.entity'),
          {
            UserProfileEntity: {
              nickName: { required: true, type: () => String },
              sex: { required: true, enum: t['../../../packages/types/dist/index'].SexEnum },
              birthday: { required: true, type: () => Date, nullable: true },
              email: { required: true, type: () => String, nullable: true },
              phone: { required: true, type: () => String, nullable: true },
              avatar: { required: true, type: () => String },
              user: { required: true, type: () => t['./modules/rbac/user/domain/entities/impl/user.entity'].UserEntity },
            },
          },
        ],
        [
          import('./modules/rbac/user/app/vo/user-profile.vo'),
          {
            UserProfileVO: {
              nickName: { required: true, type: () => String, description: '\u6635\u79F0', example: '\u5F20\u4E09' },
              sex: {
                required: true,
                description: '\u6027\u522B(\u672A\u77E5:10 \u7537:20 \u5973:30)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].SexEnum,
              },
              birthday: { required: true, type: () => Date, nullable: true, description: '\u51FA\u751F\u65E5\u671F', example: '2000-01-01' },
              email: { required: true, type: () => String, nullable: true, description: '\u90AE\u7BB1', example: 'zhangsan@example.com' },
              phone: { required: true, type: () => String, nullable: true, description: '\u7535\u8BDD\u53F7\u7801', example: '13800000000' },
              avatar: { required: true, type: () => String, description: '\u5934\u50CF\u5730\u5740', example: 'https://cn.cravatar.com/avatar' },
            },
          },
        ],
        [
          import('./modules/rbac/user/app/vo/user-details.vo'),
          {
            UserDetailsVO: {
              name: { required: true, type: () => String, description: '\u7528\u6237\u540D', example: '\u7528\u6237\u540D' },
              profile: {
                required: true,
                type: () => t['./modules/rbac/user/app/vo/user-profile.vo'].UserProfileVO,
                description: '\u7528\u6237\u6863\u6848',
              },
              id: { required: true, type: () => String, description: '\u7528\u6237ID', example: 'xxx' },
            },
          },
        ],
        [
          import('./modules/rbac/user/app/vo/find-all-user.vo'),
          {
            FindAllUserVO: {
              data: {
                required: true,
                type: () => [t['./modules/rbac/user/app/vo/user-details.vo'].UserDetailsVO],
                description: '\u7528\u6237\u8BE6\u60C5\u5217\u8868',
              },
            },
          },
        ],
        [
          import('./modules/rbac/user/app/vo/user-ids.vo'),
          { UserIdsVO: { ids: { required: true, type: () => [String], description: '\u7528\u6237ID\u5217\u8868', example: [] } } },
        ],
        [import('./modules/rbac/user/app/dto/user-id.dto'), { UserIdDTO: {} }],
        [
          import('./modules/rbac/user/app/dto/assign-user-role.dto'),
          {
            AssignUserRoleDTO: {
              roleIds: {
                required: true,
                type: () => [String],
                description: '\u89D2\u8272ID\u5217\u8868',
                example: ['xxx', 'xxx'],
                minLength: 36,
                maxLength: 36,
              },
            },
          },
        ],
        [import('./modules/rbac/user/app/dto/user-ids.dto'), { UserIdsDTO: {} }],
        [
          import('./modules/rbac/user/app/dto/assign-users-role.dto'),
          {
            AssignUsersRoleDTO: {
              roleIds: {
                required: true,
                type: () => [String],
                description: '\u89D2\u8272ID\u5217\u8868',
                example: ['xxx', 'xxx'],
                minLength: 36,
                maxLength: 36,
              },
            },
          },
        ],
        [
          import('./modules/rbac/user/app/dto/create-user.dto'),
          {
            CreateUserDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u7528\u6237\u540D',
                example: '\u7528\u6237\u540D',
                minLength: 2,
                maxLength: 64,
              },
              email: {
                required: false,
                type: () => String,
                description: '\u90AE\u7BB1',
                example: 'zhangsan@example.com',
                minLength: 2,
                maxLength: 191,
              },
              phone: {
                required: false,
                type: () => String,
                description: '\u7535\u8BDD\u53F7\u7801',
                example: '13800000000',
                minLength: 2,
                maxLength: 11,
              },
              pwd: { required: true, type: () => String, description: '\u5BC6\u7801', example: 'Aa123456', minLength: 8, maxLength: 64 },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [
          import('./modules/rbac/user/app/dto/update-user.dto'),
          {
            UpdateUserDTO: {
              name: { required: false, type: () => String, description: '\u7528\u6237\u540D', example: 'Admin', minLength: 2, maxLength: 64 },
              nickName: { required: false, type: () => String, description: '\u6635\u79F0', example: '\u5F20\u4E09', minLength: 2, maxLength: 64 },
              sex: {
                required: false,
                description: '\u6027\u522B(\u672A\u77E5:10 \u7537:20 \u5973:30)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].SexEnum,
              },
              birthday: { required: false, type: () => Date, description: '\u51FA\u751F\u65E5\u671F', example: '2000-01-01' },
              email: {
                required: false,
                type: () => String,
                description: '\u90AE\u7BB1',
                example: 'zhangsan@example.com',
                minLength: 2,
                maxLength: 191,
              },
              phone: { required: false, type: () => String, description: '\u624B\u673A\u53F7', example: '13800000000' },
              avatar: {
                required: false,
                type: () => String,
                description: '\u5934\u50CF\u5730\u5740',
                example: 'https://cn.cravatar.com/avatar',
                minLength: 1,
                maxLength: 2048,
              },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [
          import('./modules/rbac/user/app/dto/user-name.dto'),
          {
            UserNameDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u7528\u6237\u540D',
                example: '\u7528\u6237\u540D',
                minLength: 2,
                maxLength: 64,
              },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/vo/role-details.vo'),
          {
            RoleDetailsVO: {
              parentId: {
                required: true,
                type: () => String,
                nullable: true,
                description: '\u89D2\u8272\u7236\u8282\u70B9ID',
                example: '\u89D2\u8272\u7236\u8282\u70B9ID',
              },
              name: { required: true, type: () => String, description: '\u89D2\u8272\u540D', example: '\u8D85\u7EA7\u7BA1\u7406\u5458' },
              roleCode: { required: true, type: () => String, description: '\u89D2\u8272\u7F16\u7801', example: 'SUPER' },
              dataScope: {
                required: true,
                description:
                  '\u6570\u636E\u8303\u56F4(\u5168\u90E8:10 \u4EC5\u672C\u4EBA:20 \u672C\u90E8\u95E8:30 \u672C\u90E8\u95E8\u53CA\u4EE5\u4E0B\u90E8\u95E8:40 \u81EA\u5B9A\u4E49:50)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].DataScopeEnum,
              },
              id: { required: true, type: () => String, description: '\u89D2\u8272ID', example: 'xxx' },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/vo/find-all-role.vo'),
          {
            FindAllRoleVO: {
              data: {
                required: true,
                type: () => [t['./modules/rbac/role/app/vo/role-details.vo'].RoleDetailsVO],
                description: '\u89D2\u8272\u8BE6\u60C5\u5217\u8868',
              },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/vo/role-ids.vo'),
          { RoleIdsVO: { ids: { required: true, type: () => [String], description: '\u89D2\u8272ID\u5217\u8868', example: [] } } },
        ],
        [
          import('./modules/rbac/role/app/vo/role-tree.vo'),
          {
            RoleTreeVO: {
              children: {
                required: true,
                type: () => [t['./modules/rbac/role/app/vo/role-tree.vo'].RoleTreeVO],
                description: '\u89D2\u8272\u5B50\u8282\u70B9\u5217\u8868',
                example: [],
              },
            },
          },
        ],
        [import('./modules/rbac/role/app/dto/role-id.dto'), { RoleIdDTO: {} }],
        [
          import('./modules/rbac/role/app/dto/assign-role-menu.dto'),
          {
            AssignRoleMenuDTO: {
              menuIds: {
                required: true,
                type: () => [String],
                description: '\u83DC\u5355ID\u5217\u8868',
                example: ['xxx', 'xxx'],
                minLength: 36,
                maxLength: 36,
              },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/dto/assign-role-resource.dto'),
          {
            AssignRoleResourceDTO: {
              resourceIds: {
                required: true,
                type: () => [String],
                description: '\u8D44\u6E90ID\u5217\u8868',
                example: ['xxx', 'xxx'],
                minLength: 36,
                maxLength: 36,
              },
            },
          },
        ],
        [import('./modules/rbac/role/app/dto/role-ids.dto'), { RoleIdsDTO: {} }],
        [
          import('./modules/rbac/role/app/dto/assign-roles-menu.dto'),
          {
            AssignRolesMenuDTO: {
              menuIds: {
                required: true,
                type: () => [String],
                description: '\u83DC\u5355ID\u5217\u8868',
                example: ['xxx', 'xxx'],
                minLength: 36,
                maxLength: 36,
              },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/dto/assign-roles-resource.dto'),
          {
            AssignRolesResourceDTO: {
              resourceIds: {
                required: true,
                type: () => [String],
                description: '\u8D44\u6E90ID\u5217\u8868',
                example: ['xxx', 'xxx'],
                minLength: 36,
                maxLength: 36,
              },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/dto/create-role.dto'),
          {
            CreateRoleDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u89D2\u8272\u540D',
                example: '\u8D85\u7EA7\u7BA1\u7406\u5458',
                minLength: 2,
                maxLength: 64,
              },
              roleCode: {
                required: true,
                type: () => String,
                description: '\u89D2\u8272\u7F16\u7801',
                example: 'SUPER',
                minLength: 2,
                maxLength: 64,
              },
              dataScope: {
                required: true,
                description:
                  '\u6570\u636E\u8303\u56F4(\u5168\u90E8:10 \u4EC5\u672C\u4EBA:20 \u672C\u90E8\u95E8:30 \u672C\u90E8\u95E8\u53CA\u4EE5\u4E0B\u90E8\u95E8:40 \u81EA\u5B9A\u4E49:50)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].DataScopeEnum,
              },
              parentId: { required: false, type: () => String, description: '\u7236\u8282\u70B9ID', example: 'xxx', minLength: 36, maxLength: 36 },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/dto/move-role.dto'),
          {
            MoveRoleDTO: {
              parentId: { required: false, type: () => String, description: '\u7236\u8282\u70B9ID', example: 'xxx', minLength: 36, maxLength: 36 },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/dto/role-name.dto'),
          {
            RoleNameDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u89D2\u8272\u540D',
                example: '\u89D2\u8272\u540D',
                minLength: 2,
                maxLength: 64,
              },
            },
          },
        ],
        [
          import('./modules/rbac/role/app/dto/update-role.dto'),
          {
            UpdateRoleDTO: {
              name: {
                required: false,
                type: () => String,
                description: '\u89D2\u8272\u540D',
                example: '\u89D2\u8272\u540D',
                minLength: 2,
                maxLength: 64,
              },
              roleCode: {
                required: false,
                type: () => String,
                description: '\u89D2\u8272\u7F16\u7801',
                example: 'SUPER',
                minLength: 2,
                maxLength: 64,
              },
              dataScope: {
                required: false,
                description:
                  '\u6570\u636E\u8303\u56F4(\u5168\u90E8:10 \u4EC5\u672C\u4EBA:20 \u672C\u90E8\u95E8:30 \u672C\u90E8\u95E8\u53CA\u4EE5\u4E0B\u90E8\u95E8:40 \u81EA\u5B9A\u4E49:50)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].DataScopeEnum,
              },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [
          import('./modules/rbac/resource/app/vo/resource-details.vo'),
          {
            ResourceDetailsVO: {
              name: { required: true, type: () => String, description: '\u8D44\u6E90\u540D', example: '\u8D44\u6E90\u540D' },
              resourceCode: {
                required: true,
                type: () => String,
                description: '\u8D44\u6E90\u7F16\u7801(\u8D44\u6E90\u7C7B\u578B:\u9886\u57DF:\u65B9\u6CD5)',
                example: 'API:SYSTEM_USER:CREATE',
              },
              resourceType: {
                required: true,
                description:
                  '\u8D44\u6E90\u7C7B\u578B(\u63A5\u53E3:10 \u9759\u6001\u8D44\u6E90:20 WebSocket\u8FDE\u63A5\u70B9:30 \u5B9A\u65F6\u4EFB\u52A1:40 \u6570\u636E\u6743\u9650:50)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].ResourceTypeEnum,
              },
              domain: { required: true, type: () => String, description: '\u9886\u57DF', example: 'SYSTEM' },
              method: { required: true, type: () => String, description: '\u65B9\u6CD5', example: 'CREATE' },
              id: { required: true, type: () => String, description: '\u8D44\u6E90ID', example: 'xxx' },
            },
          },
        ],
        [
          import('./modules/rbac/resource/app/vo/find-all-resource.vo'),
          {
            FindAllResourceVO: {
              data: {
                required: true,
                type: () => [t['./modules/rbac/resource/app/vo/resource-details.vo'].ResourceDetailsVO],
                description: '\u8D44\u6E90\u8BE6\u60C5\u5217\u8868',
              },
            },
          },
        ],
        [
          import('./modules/rbac/resource/app/vo/resource-ids.vo'),
          { ResourceIdsVO: { ids: { required: true, type: () => [String], description: '\u8D44\u6E90ID\u5217\u8868', example: [] } } },
        ],
        [
          import('./modules/rbac/resource/app/dto/create-resource.dto'),
          {
            CreateResourceDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u8D44\u6E90\u540D',
                example: '\u7528\u6237\u521B\u5EFA\u63A5\u53E3',
                minLength: 2,
                maxLength: 64,
              },
              resourceType: {
                required: true,
                description:
                  '\u8D44\u6E90\u7C7B\u578B(\u63A5\u53E3:10 \u9759\u6001\u8D44\u6E90:20 WebSocket\u8FDE\u63A5\u70B9:30 \u5B9A\u65F6\u4EFB\u52A1:40 \u6570\u636E\u6743\u9650:50)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].ResourceTypeEnum,
              },
              domain: { required: true, type: () => String, description: '\u8D44\u6E90\u9886\u57DF', example: 'USER', minLength: 2, maxLength: 64 },
              method: { required: true, type: () => String, description: '\u8D44\u6E90\u65B9\u6CD5', example: 'CREATE', minLength: 2, maxLength: 64 },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [import('./modules/rbac/resource/app/dto/resource-id.dto'), { ResourceIdDTO: {} }],
        [import('./modules/rbac/resource/app/dto/resource-ids.dto'), { ResourceIdsDTO: {} }],
        [
          import('./modules/rbac/resource/app/dto/resource-name.dto'),
          {
            ResourceNameDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u8D44\u6E90\u540D',
                example: '\u8D44\u6E90\u540D',
                minLength: 2,
                maxLength: 64,
              },
            },
          },
        ],
        [
          import('./modules/rbac/resource/app/dto/update-resource.dto'),
          {
            UpdateResourceDTO: {
              name: {
                required: false,
                type: () => String,
                description: '\u8D44\u6E90\u540D',
                example: '\u8D44\u6E90\u540D',
                minLength: 2,
                maxLength: 64,
              },
              resourceType: {
                required: false,
                description:
                  '\u8D44\u6E90\u7C7B\u578B(\u63A5\u53E3:10 \u9759\u6001\u8D44\u6E90:20 WebSocket\u8FDE\u63A5\u70B9:30 \u5B9A\u65F6\u4EFB\u52A1:40 \u6570\u636E\u6743\u9650:50)',
                example: 10,
                enum: t['../../../packages/types/dist/index'].ResourceTypeEnum,
              },
              domain: { required: false, type: () => String, description: '\u8D44\u6E90\u9886\u57DF', example: 'USER', minLength: 2, maxLength: 64 },
              method: {
                required: false,
                type: () => String,
                description: '\u8D44\u6E90\u65B9\u6CD5',
                example: 'CREATE',
                minLength: 2,
                maxLength: 64,
              },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [
          import('./modules/rbac/role/domain/entities/impl/role.entity'),
          {
            RoleEntity: {
              name: { required: true, type: () => String },
              parentId: { required: true, type: () => String, nullable: true },
              roleCode: { required: true, type: () => String },
              dataScope: { required: true, enum: t['../../../packages/types/dist/index'].DataScopeEnum },
              users: { required: true, type: () => [t['./modules/rbac/user/domain/entities/impl/user.entity'].UserEntity] },
              resources: { required: true, type: () => [t['./modules/rbac/resource/domain/entities/impl/resource.entity'].ResourceEntity] },
              menus: { required: true, type: () => [t['./modules/rbac/menu/domain/entities/impl/menu.entity'].MenuEntity] },
              ancestorNodes: { required: true, type: () => [t['./modules/rbac/role/domain/entities/impl/role-tree.entity'].RoleTreeEntity] },
              descendantNodes: { required: true, type: () => [t['./modules/rbac/role/domain/entities/impl/role-tree.entity'].RoleTreeEntity] },
            },
          },
        ],
        [
          import('./modules/rbac/role/domain/entities/impl/role-tree.entity'),
          {
            RoleTreeEntity: {
              ancestorId: { required: true, type: () => String },
              descendantId: { required: true, type: () => String },
              depth: { required: true, type: () => Number },
              ancestorRole: { required: true, type: () => t['./modules/rbac/role/domain/entities/impl/role.entity'].RoleEntity },
              descendantRole: { required: true, type: () => t['./modules/rbac/role/domain/entities/impl/role.entity'].RoleEntity },
            },
          },
        ],
        [
          import('./modules/rbac/resource/domain/entities/impl/resource.entity'),
          {
            ResourceEntity: {
              name: { required: true, type: () => String },
              resourceCode: { required: true, type: () => String },
              resourceType: { required: true, enum: t['../../../packages/types/dist/index'].ResourceTypeEnum },
              domain: { required: true, type: () => String },
              method: { required: true, type: () => String },
              roles: { required: true, type: () => [t['./modules/rbac/role/domain/entities/impl/role.entity'].RoleEntity] },
            },
          },
        ],
        [import('./modules/auth/domain/entities/impl/auth.entity'), { AuthEntity: { name: { required: true, type: () => String } } }],
        [
          import('./modules/auth/app/vo/auth-details.vo'),
          {
            AuthDetailsVO: {
              name: { required: true, type: () => String, description: '\u8BA4\u8BC1\u540D', example: '\u8BA4\u8BC1\u540D' },
              id: { required: true, type: () => String, description: '\u8BA4\u8BC1ID', example: 'xxx' },
            },
          },
        ],
        [
          import('./modules/auth/app/vo/auth-ids.vo'),
          { AuthIdsVO: { ids: { required: true, type: () => [String], description: '\u8BA4\u8BC1ID\u5217\u8868', example: [] } } },
        ],
        [
          import('./modules/auth/app/vo/find-all-auth.vo'),
          {
            FindAllAuthVO: {
              data: {
                required: true,
                type: () => [t['./modules/auth/app/vo/auth-details.vo'].AuthDetailsVO],
                description: '\u8BA4\u8BC1\u8BE6\u60C5\u5217\u8868',
              },
            },
          },
        ],
        [
          import('./modules/auth/app/vo/me-info.vo'),
          {
            MeInfoVO: {
              roles: { required: true, type: () => [String], description: '\u89D2\u8272\u7F16\u7801', example: [] },
              menus: { required: true, type: () => [String], description: '\u83DC\u5355\u7F16\u7801', example: [] },
            },
          },
        ],
        [
          import('./modules/auth/app/vo/svg-captcha.vo'),
          {
            SvgCaptchaVO: {
              token: {
                required: true,
                type: () => String,
                description: 'svg\u9A8C\u8BC1\u7801\u51ED\u8BC1',
                example: 'svg\u9A8C\u8BC1\u7801\u51ED\u8BC1',
              },
              svg: { required: true, type: () => String, description: 'svg\u9A8C\u8BC1\u7801Base64', example: 'data:image/svg+xml;base64,XXXX' },
            },
          },
        ],
        [
          import('./modules/auth/app/vo/token.vo'),
          {
            TokenVO: {
              accessToken: { required: true, type: () => String, description: '\u8BBF\u95EE\u4EE4\u724C' },
              refreshToken: { required: false, type: () => String, description: '\u5237\u65B0\u4EE4\u724C' },
            },
          },
        ],
        [import('./modules/auth/app/dto/auth-id.dto'), { AuthIdDTO: {} }],
        [import('./modules/auth/app/dto/auth-ids.dto'), { AuthIdsDTO: {} }],
        [
          import('./modules/auth/app/dto/auth-name.dto'),
          {
            AuthNameDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u8BA4\u8BC1\u540D',
                example: '\u8BA4\u8BC1\u540D',
                minLength: 2,
                maxLength: 64,
              },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/captcha-name.dto'),
          {
            CaptchaNameDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u9A8C\u8BC1\u540D ["test", "register", "login", "resetPwd", "updateInfo"]',
                example: 'test',
              },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/create-auth.dto'),
          {
            CreateAuthDTO: {
              name: {
                required: true,
                type: () => String,
                description: '\u8BA4\u8BC1\u540D',
                example: '\u8BA4\u8BC1\u540D',
                minLength: 2,
                maxLength: 64,
              },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/email-captcha.dto'),
          {
            EmailCaptchaDTO: {
              email: {
                required: true,
                type: () => String,
                description: '\u90AE\u7BB1',
                example: 'zhangsan@example.com',
                minLength: 2,
                maxLength: 191,
              },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/email-login.dto'),
          {
            EmailLoginDTO: {
              email: {
                required: true,
                type: () => String,
                description: '\u90AE\u7BB1',
                example: 'zhangsan@example.com',
                minLength: 2,
                maxLength: 191,
              },
              pwd: { required: true, type: () => String, description: '\u5BC6\u7801', example: 'Aa123456', minLength: 8, maxLength: 64 },
              captcha: { required: true, type: () => String, description: '\u9A8C\u8BC1\u7801', example: '123456', minLength: 6, maxLength: 6 },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/email-register.dto'),
          {
            EmailRegisterDTO: {
              name: { required: true, type: () => String, description: '\u7528\u6237\u540D', example: 'zhangsan', minLength: 2, maxLength: 64 },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/email-reset-pwd.dto'),
          {
            EmailResetPwdDTO: {
              confirmPwd: {
                required: true,
                type: () => String,
                description: '\u786E\u8BA4\u5BC6\u7801',
                example: 'Aa123456',
                minLength: 8,
                maxLength: 64,
              },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/refresh-token.dto'),
          {
            RefreshTokenDTO: {
              refreshToken: {
                required: false,
                type: () => String,
                description: '\u5237\u65B0\u4EE4\u724C',
                example: 'xxx',
                minLength: 271,
                maxLength: 271,
              },
            },
          },
        ],
        [import('./modules/auth/app/dto/logout.dto'), { LogoutDTO: {} }],
        [
          import('./modules/auth/app/dto/phone-captcha.dto'),
          { PhoneCaptchaDTO: { phone: { required: true, type: () => String, description: '\u624B\u673A\u53F7', example: '13800000000' } } },
        ],
        [
          import('./modules/auth/app/dto/phone-login.dto'),
          {
            PhoneLoginDTO: {
              phone: { required: true, type: () => String, description: '\u624B\u673A\u53F7', example: 'zhangsan@example.com' },
              pwd: { required: true, type: () => String, description: '\u5BC6\u7801', example: 'Aa123456', minLength: 8, maxLength: 64 },
              captcha: { required: true, type: () => String, description: '\u9A8C\u8BC1\u7801', example: '123456', minLength: 6, maxLength: 6 },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/phone-register.dto'),
          {
            PhoneRegisterDTO: {
              name: { required: true, type: () => String, description: '\u7528\u6237\u540D', example: 'zhangsan', minLength: 2, maxLength: 64 },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/phone-reset-pwd.dto'),
          {
            PhoneResetPwdDTO: {
              confirmPwd: {
                required: true,
                type: () => String,
                description: '\u786E\u8BA4\u5BC6\u7801',
                example: 'Aa123456',
                minLength: 8,
                maxLength: 64,
              },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/svg-login.dto'),
          {
            SvgLoginDTO: {
              name: { required: true, type: () => String, description: '\u7528\u6237\u540D', example: 'zhangsan', minLength: 2, maxLength: 64 },
              pwd: { required: true, type: () => String, description: '\u5BC6\u7801', example: 'Aa123456', minLength: 8, maxLength: 64 },
              token: {
                required: true,
                type: () => String,
                description: '\u9A8C\u8BC1\u7801\u4EE4\u724C',
                example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                minLength: 36,
                maxLength: 36,
              },
              captcha: { required: true, type: () => String, description: '\u9A8C\u8BC1\u7801', example: '123456', minLength: 6, maxLength: 6 },
            },
          },
        ],
        [
          import('./modules/auth/app/dto/update-auth.dto'),
          {
            UpdateAuthDTO: {
              name: {
                required: false,
                type: () => String,
                description: '\u8BA4\u8BC1\u540D',
                example: '\u8BA4\u8BC1\u540D',
                minLength: 2,
                maxLength: 64,
              },
              remark: { required: false, type: () => String, description: '\u5907\u6CE8', example: 'xxx', minLength: 1, maxLength: 500 },
            },
          },
        ],
      ],
      controllers: [
        [
          import('./modules/auth/iface/controllers/impl/auth.controller'),
          {
            AuthController: {
              svgCaptcha: { type: t['./modules/auth/app/vo/svg-captcha.vo'].SvgCaptchaVO },
              emailCaptcha: {},
              svgLogin: { type: t['./modules/auth/app/vo/token.vo'].TokenVO },
              emailRegister: {},
              emailLogin: { type: t['./modules/auth/app/vo/token.vo'].TokenVO },
              emailResetPwd: {},
              refreshToken: { type: Object },
              loginOut: {},
              meInfo: { type: Object },
              create: { type: t['./modules/auth/app/vo/auth-details.vo'].AuthDetailsVO },
              delete: {},
              update: {},
              updateStatus: {},
              updateSort: {},
              list: { type: t['./modules/auth/app/vo/find-all-auth.vo'].FindAllAuthVO },
              detail: { type: t['./modules/auth/app/vo/auth-details.vo'].AuthDetailsVO },
            },
          },
        ],
        [
          import('./modules/rbac/menu/iface/controllers/impl/menu.controller'),
          {
            MenuController: {
              create: { type: t['./modules/rbac/menu/app/vo/menu-details.vo'].MenuDetailsVO },
              delete: {},
              update: {},
              updateStatus: {},
              updateSort: {},
              list: { type: t['./modules/rbac/menu/app/vo/find-all-menu.vo'].FindAllMenuVO },
              detail: { type: t['./modules/rbac/menu/app/vo/menu-details.vo'].MenuDetailsVO },
              move: { type: t['./modules/rbac/menu/app/vo/menu-details.vo'].MenuDetailsVO },
              tree: { type: Object },
              trees: { type: [Object] },
            },
          },
        ],
        [
          import('./modules/rbac/resource/iface/controllers/impl/resource.controller'),
          {
            ResourceController: {
              create: { type: t['./modules/rbac/resource/app/vo/resource-details.vo'].ResourceDetailsVO },
              delete: {},
              update: {},
              updateStatus: {},
              updateSort: {},
              list: { type: t['./modules/rbac/resource/app/vo/find-all-resource.vo'].FindAllResourceVO },
              detail: { type: t['./modules/rbac/resource/app/vo/resource-details.vo'].ResourceDetailsVO },
            },
          },
        ],
        [
          import('./modules/rbac/role/iface/controllers/impl/role-menu.controller'),
          {
            RoleMenuController: {
              assign: {},
              batchAssign: {},
              menuIds: { type: t['./modules/rbac/menu/app/vo/menu-ids.vo'].MenuIdsVO },
              roleIds: { type: t['./modules/rbac/role/app/vo/role-ids.vo'].RoleIdsVO },
            },
          },
        ],
        [
          import('./modules/rbac/role/iface/controllers/impl/role-resource.controller'),
          {
            RoleResourceController: {
              assign: {},
              batchAssign: {},
              resourceIds: { type: t['./modules/rbac/resource/app/vo/resource-ids.vo'].ResourceIdsVO },
              roleIds: { type: t['./modules/rbac/role/app/vo/role-ids.vo'].RoleIdsVO },
            },
          },
        ],
        [
          import('./modules/rbac/role/iface/controllers/impl/role.controller'),
          {
            RoleController: {
              create: { type: t['./modules/rbac/role/app/vo/role-details.vo'].RoleDetailsVO },
              delete: {},
              update: {},
              updateStatus: {},
              updateSort: {},
              list: { type: t['./modules/rbac/role/app/vo/find-all-role.vo'].FindAllRoleVO },
              detail: { type: t['./modules/rbac/role/app/vo/role-details.vo'].RoleDetailsVO },
              move: { type: t['./modules/rbac/role/app/vo/role-details.vo'].RoleDetailsVO },
              tree: { type: Object },
              trees: { type: [Object] },
            },
          },
        ],
        [
          import('./modules/rbac/user/iface/controllers/impl/user-role.controller'),
          {
            UserRoleController: {
              assign: {},
              batchAssign: {},
              roleIds: { type: t['./modules/rbac/role/app/vo/role-ids.vo'].RoleIdsVO },
              userIds: { type: t['./modules/rbac/user/app/vo/user-ids.vo'].UserIdsVO },
            },
          },
        ],
        [
          import('./modules/rbac/user/iface/controllers/impl/user.controller'),
          {
            UserController: {
              create: { type: t['./modules/rbac/user/app/vo/user-details.vo'].UserDetailsVO },
              delete: {},
              update: {},
              updateStatus: {},
              updateSort: {},
              list: { type: t['./modules/rbac/user/app/vo/find-all-user.vo'].FindAllUserVO },
              detail: { type: t['./modules/rbac/user/app/vo/user-details.vo'].UserDetailsVO },
            },
          },
        ],
        [
          import('./boot/boot.controller'),
          {
            BootController: {
              boot: {},
              setStr: {},
              getStr: { type: Object },
              delStr: {},
              updateStr: {},
              setArr: {},
              getArr: { type: Object },
              delArr: {},
              setObj: {},
              getObj: { type: Object },
              delObj: {},
              putObj: {},
              ddObj: {},
            },
          },
        ],
      ],
    },
  }
}
