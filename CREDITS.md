# 致谢与素材来源

## 直接上游：Fairy ZZZ Plugin

- 作者／仓库：[AssassinVIX/fairy-zzz-plugin](https://github.com/AssassinVIX/fairy-zzz-plugin)
- 基于版本：`1.0.3`
- 固定来源：[71a3008f1645fd0117b115988a6bda87eaf813b9](https://github.com/AssassinVIX/fairy-zzz-plugin/tree/71a3008f1645fd0117b115988a6bda87eaf813b9)
- 代码许可：MIT，原版权声明完整保留在 [LICENSE](./LICENSE)。

感谢原作者提供 H.D.D 皮肤、Fairy 眼徽集成、开机视频播放、问候流程、拖动和状态动效等实现。本仓库从其预构建插件适配到 CodexHost Web。

适配修改包括：替换宿主接入与会话状态来源、移除全部音频和账户／日志扫描逻辑、移除 Agent 人设预设、接入原生设置与停用清理，以及重做暗色欢迎页、碳纤维背景、侧栏、输入控件和聊天气泡。

`assets/boot.mp4` 来自直接上游，已移除音轨；`assets/poster.jpg`、`assets/hero.png`、`assets/icon-180.png` 与 `icon.svg` 沿用上游资源。上游随附的动画来源声明原样保留在 [licenses/fairy-zzz-plugin-NOTICE.md](./licenses/fairy-zzz-plugin-NOTICE.md)；该声明中的 Pi／离线逐帧文件不在本仓库发行范围内。

## Fairy 眼徽与状态动画：Fairy-DSH

- 作者／仓库：[Chengzhibense/Fairy-DSH](https://github.com/Chengzhibense/Fairy-DSH)
- 固定来源：[d639887a386b0de6fef2e61c97dc268631854591](https://github.com/Chengzhibense/Fairy-DSH/tree/d639887a386b0de6fef2e61c97dc268631854591)
- 来源目录：`fairy-visual/dsh-fairy-visual/src/client/`
- 许可：[Apache License 2.0](./licenses/Apache-2.0.txt)
- 原始声明：[Fairy-DSH NOTICE](./licenses/Fairy-DSH-NOTICE.txt)、[商标与内容说明](./licenses/Fairy-DSH-TRADEMARKS.md)

Fairy 眼徽 SVG、分层几何、颜色、动画时长、眼睑、眨眼和状态变化经直接上游参考／改编后在本仓库 `client.js` 中使用。相关版权和 SPDX 声明继续保留在内嵌 SVG 与代码注释中，实际修改范围见 [NOTICE-fairy-dsh.md](./NOTICE-fairy-dsh.md)。

直接上游另注明其动画对照视频为 [「可能是全网最还原的Fairy」BV1SD4C63EZz](https://www.bilibili.com/video/BV1SD4C63EZz/)。这里保留该参考出处，不将视频视为新增的素材授权。

## 界面排版与顶部栏参考：DSH Theme ZZZ

- 作者／仓库：[AbiTssE6/dsh-theme-zzz](https://github.com/AbiTssE6/dsh-theme-zzz)
- 基于版本：`0.3.7`，固定来源 [7f3e26475e75b967d2b222a32c9fb4087f335edc](https://github.com/AbiTssE6/dsh-theme-zzz/tree/7f3e26475e75b967d2b222a32c9fb4087f335edc)
- 代码许可：[MIT](./licenses/dsh-theme-zzz-MIT.txt)；上游字体说明原样保留在 [dsh-theme-zzz-FONT-LICENSES.md](./licenses/dsh-theme-zzz-FONT-LICENSES.md)。

本主题参考其导航字体层次、白色圆润线框图标处理、深灰顶部栏与金色选中标签，改编选中标签的分层渐变，并适配 CodexHost 原生标题、标签页和按钮。上游字体说明描述的是原项目，本主题按用户要求改用本机安装的「方正综艺简体」，消息正文、代码与输入内容保留原有字体。没有复制原项目的业务功能。

「方正综艺简体 / FZZongYi-M05S」属于方正字库，产品信息见 [方正综艺](https://www.foundertype.com/index.php/FontInfo/index/id/178)。本次本机字体安装使用 [genqiaolynn/fonts 中的 TTF](https://github.com/genqiaolynn/fonts/blob/master/%E6%96%B9%E6%AD%A3%E7%BB%BC%E8%89%BA%E7%AE%80%E4%BD%93.ttf)；字体二进制仅安装在本机用户字体目录，不纳入本仓库或安装包，也不由 MIT 代码许可覆盖。其他设备按已安装的字体匹配，缺少时回退思源黑体或系统字体。

## 宿主：CodexHost

感谢 [BytePioneer-AI/codex-host](https://github.com/BytePioneer-AI/codex-host) 提供 Web 界面扩展机制、主题 token、UI 插槽、设置入口和会话状态订阅能力。扩展在运行时使用宿主提供的接口；发行包不包含宿主源码或二进制。

## 新增背景、头像与预览

- `assets/hdd-logo.png`：按用户提供的 H.D.D 界面参考图，使用 ImageGen 提取并重建遮挡区域的透明图。运行时用 CSS 调整显示颜色。
- `assets/hdd-mesh.png`：按同一参考图重建的透明网状球体线稿，运行时保持原始宽高比。
- 这两张图是参考重建素材，不是从上游仓库取得的原始游戏资产，也不代表恢复了被遮挡的原始像素。
- `assets/agent-avatar.png`：用户于 2026-11-16 提供的 1254×1254 PNG 原图，直接用于 Agent 回复头像，未重绘或修改图片像素；保留原图透明通道。
- 碳纤维面板、控件和气泡外观使用 CSS 实现。
- `assets/running-mark-source.png`：用户于 2026-11-17 提供的 87×77 游戏运行标记参考 PNG，按原文件字节复制保存。CSS sprite 从 `(30, 31)` 位置显示 20×20 火苗区域，以来源像素计算的 SVG 轮廓蒙版裁切周边；不生成或修改位图。外侧圆环使用独立 CSS 动画，未显示原图中的红色警示或数字。游戏图形权利归原权利人所有。
- `docs/screenshots/` 使用隔离 Web、合成工作区与测试消息生成，不包含真实用户聊天记录。

## 许可范围

| 范围 | 许可／说明 |
| --- | --- |
| 插件与 CodexHost 适配代码 | MIT，保留直接上游版权声明 |
| Fairy-DSH 派生眼徽与动画代码 | Apache-2.0，保留 NOTICE、版权和修改说明 |
| 游戏角色、名称、标志、开机视频及相关视觉内容 | 归 miHoYo / HoYoverse 等各自权利人所有；不由上述代码许可授予权利 |

本项目为非官方社区适配。直接上游将开机视频与角色形象标注为个人桌面视觉改造用途、请勿商用，本仓库保留该用途说明。上游的第三方名称和商标限制见 [Fairy-DSH-TRADEMARKS.md](./licenses/Fairy-DSH-TRADEMARKS.md)。
