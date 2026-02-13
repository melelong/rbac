# api

## 业务模块生成

### 先清理旧的swagger数据(`./src/metadata.ts`)

> 因为`metadata.ts`更新时会检查一遍类型，过程中如果`metadata.ts`有路径丢失会更新失败

```ts
// 先清空metadata.ts并写入文件结构框架
writeFileSync(
  resolve(__dirname, './metadata.ts'),
  `/* eslint-disable */
export default async () => {
  const t = {}
  return {}
}`,
)
```

# 先清理旧的swagger数据

```shell
# 生成业务模块
pnpm g:bm
# 生成swagger元数据
pnpm g:swag
```

### 生成内容

| 路径                                                     | 作用                                      |
| -------------------------------------------------------- | ----------------------------------------- |
| @apps/api项目下的src/modules/命令生成的业务模块目录      | 业务模块主要代码                          |
| @apps/api项目下的src/common/exceptions/exception-code.ts | 业务模块业务码定义                        |
| @apps/api项目下的src/common/constants/SwaggerTags.ts     | swagger模块标签定义                       |
| @packages/types项目下的src/dto和src/vo                   | 定义了dto和vo类型，方便提供给其他项目使用 |

### 开发顺序(建议)

1. 生成业务模块
2. 实现业务模块的应用层的VO和DTO
3. 实现业务模块的领域层的实体类和仓库接口
4. 实现业务模块的基建层的仓库
5. 实现业务模块的领域层的服务
6. 实现业务模块的应用层的服务
7. 实现业务模块的应用层的command和query
8. 实现业务模块的控制器

### 删除业务模块

> 主要删除业务模块相关的代码(参考上面讲到的生成内容)
