import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator'
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin'

/** 生成手动导入swagger需要的数据(swc对swagger不兼容，不能自动导入swagger装饰器的数据) */
const generator = new PluginMetadataGenerator()
generator.generate({
  visitors: [
    new ReadonlyVisitor({
      introspectComments: true,
      pathToSource: __dirname,
      dtoFileNameSuffix: ['.dto.ts', '.vo.ts', '.entity.ts'],
      /** 这个配置可以@Max,@Min,@Length自动生成配置(但是涉及数值的参数不能用变量) */
      classValidatorShim: true,
      parameterProperties: true,
    }),
  ],
  outputDir: __dirname,
  watch: false,
  tsconfigPath: 'tsconfig.json',
})
