## [0.1.2] - 2026-02-26
### Fixed
- 自动修复 CI 失败（run 22429021446）：限制 Vitest 仅运行 TypeScript 测试文件，避免 CommonJS 导入冲突。

# Changelog

## [0.1.1] - 2026-02-26
### Fixed
- 修复 CI 失败根因：限制 Vitest 仅匹配 `test/**/*.test.ts`，避免误执行编译产物 `*.test.js` 触发 CommonJS 导入错误。

### Added
- 新增 `CI Auto Remediation` 工作流：支持 `workflow_run`（CI/CD 失败即触发）+ `schedule`（每 30 分钟巡检）+ `workflow_dispatch`，自动处理失败 run。
- 自动化流程覆盖：日志诊断 artifact、已知模式自动修复（分支+CHANGELOG+PR）、PR 自审评论、开启 auto-merge；未知模式自动建 issue 等待人工修复。
- 增加安全边界：仅监听 CI/CD 失败，避免自触发循环；对 fork 来源 run 禁止写操作；对同一 run/PR 做去重避免重复处理。

## [0.1.0] - 2026-02-26
### Added
- 初始 MVP：企业微信回调接入、OpenClaw 转发、回包发送
- 幂等与基础重试
- 结构化日志与健康检查
- CI（lint+test）与 CD（Docker 镜像构建推送）
