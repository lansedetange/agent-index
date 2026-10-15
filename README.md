# Agent Index

**A bilingual guide to personal AI agents, grounded in evaluation evidence.**

Agent Index is an early, frontend-only MVP for exploring personal agents, comparing public evaluation results, and trying a sample blind review. It keeps each evaluator's original scoring scale and makes the evidence context visible.

> **Prototype notice:** This repository does not run agent evaluations or collect submissions and votes. The blind-review examples and submission flow are local demonstrations. Public results are reproduced as a dated snapshot with links to their sources; they are not Agent Index test results.

[中文说明](#中文说明)

## What is included

- Bilingual interface with a one-click Chinese / English switch.
- Overview, source-specific leaderboards, agent directory and detail pages.
- Task library and an explanation of the evaluation approach.
- Local-only blind-review demo, comparison controls and product submission form.
- Public evaluation snapshots shown on their source scales, with source links and caveats.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  App.jsx       Pages, navigation, language copy and local interactions
  data.js       Product, task, source and demo-match snapshot
  styles.css    Responsive interface styles
  main.jsx      React entry point
docs/
  launch-post.md  Draft launch post
```

## Data and evaluation notes

- The included public-results snapshot is dated **9 October 2026**. Check the linked source before relying on a result; product availability and evaluation data can change.
- Results from different evaluators use different tasks, samples and scales. The UI keeps them separate and does not calculate a combined score.
- A product description is not proof of task performance. Missing results are shown as unknown rather than as zero.
- The blind-review screen uses illustrative sample outputs. A vote in this prototype is not stored and does not affect a ranking.
- The submission form does not transmit or persist the information entered.

Current source links are maintained in `src/data.js`, including [PAEval](https://paeval.com/leaderboards), [micro1 PersonalAgentBench](https://www.micro1.ai/personal-agent-bench), [Assistant Benchmark](https://assistantbenchmark.com/), and [SuperCLUE](https://www.superclueai.com/).

## Current scope

This is a static frontend MVP. It has no API, database, authentication, persistent voting, evaluation runner or live data refresh. The interface is a starting point for testing the navigation and evidence presentation; it is not a production benchmark service.

## 中文说明

Agent Index 是一个面向 Personal Agent 的双语评测导航站前端 MVP：浏览产品、查看公开评测证据，并体验一组示例盲评。

> **原型说明：**当前仓库不会执行 Agent 测试，也不会收集投稿或投票。盲评对局和产品提交表单都只是本地演示。公开成绩是带来源链接的时间快照，不是 Agent Index 自行测试的结果。

### 当前功能

- 中英文界面一键切换。
- 概览、按来源区分的榜单、产品目录和详情页。
- 任务库与评测方法说明。
- 本地演示的盲评、产品对比和提交表单。
- 保留评测来源的原始量表、来源链接和限制说明。

### 本地运行

需要 Node.js 20 或更新版本及 npm。

```bash
npm install
npm run dev
```

构建并预览生产版本：

```bash
npm run build
npm run preview
```

### 数据与评测说明

- 仓库内公开成绩快照截至 **2026 年 10 月 9 日**。产品状态和评测数据会变化，使用前请查看原始来源。
- 不同评测方使用不同任务、样本和量表，因此页面不会合并成一个总分。
- 产品资料不等于任务表现证据；没有成绩表示未知，不代表零分。
- 盲评页面使用示例输出。投票不会保存，也不会影响榜单。
- 提交表单不会传输或保存填写的信息。

这是一个静态前端 MVP，尚未接入 API、数据库、登录、持久化投票、评测执行器或实时数据更新。它用于验证导航与证据呈现方式，不是已经投入运营的评测服务。

## Feedback

Task scenarios, evidence-source corrections and interface feedback are welcome through GitHub issues.
