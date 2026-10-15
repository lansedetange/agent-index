import { useEffect, useMemo, useState } from 'react';
import { agents, blindMatch, categories, sources, tasks } from './data.js';

const copy = {
  en: {
    nav: { home: 'Overview', leaderboard: 'Leaderboard', agents: 'Agents', tasks: 'Tasks', method: 'Methodology', submit: 'Submit an agent', arena: 'Blind test' },
    search: 'Search agents, tasks…',
    footer: 'An independent guide to personal agents.',
    updated: 'Public data snapshot · 9 Oct 2026',
    publicData: 'Public source data', demo: 'Demo interaction', unknown: 'Not established',
    browseAgents: 'Browse agents', viewLeaderboard: 'View leaderboard', exploreTasks: 'Explore tasks', compare: 'Compare', comparing: 'Comparing', remove: 'Remove',
    common: { all: 'All', independent: 'Independent', documented: 'Documented', vendor: 'Vendor-reported', source: 'Original source', details: 'View details', regionUS: 'United States', regionCN: 'China', cloud: 'Cloud', local: 'Local', noResults: 'No agents match these filters.', score: 'Score', sample: 'Sample', tested: 'Tested', rank: 'Source rank', coverage: 'Coverage', category: 'Category', deployment: 'Deployment', access: 'Availability', pricing: 'Pricing', updated: 'Source updated', evidence: 'Evidence', unknownLabel: 'Unknown', viewAll: 'View all', clear: 'Clear filters', search: 'Search', close: 'Close' },
    home: { title: 'Which agent would you trust with the task?', subtitle: 'Compare personal agents on independent evidence, real workflows and the boundaries that matter.', cta: 'Explore the leaderboard', secondary: 'Try a blind test', section1: 'Evidence, at a glance', stat1: 'products tracked in the source snapshot', stat2: 'independent evaluation sources', stat3: 'source-backed capability records', statNote: 'Figures refer to the public PAEval snapshot dated 9 Oct 2026.', leaderboard: 'Independent results', leaderboardSub: 'Scores stay on the scale used by each evaluator.', taskTitle: 'What do you need an agent to do?', taskSub: 'Start with a task, then compare agents on evidence that fits.', featured: 'Featured agents', featuredSub: 'Products with publicly reported evaluation results.', latest: 'A score is only useful with its context.', latestSub: 'Check sample size, coverage and test conditions before comparing products.', latestLink: 'How we evaluate' },
    leaderboard: { title: 'Personal agent leaderboard', subtitle: 'Public evaluations, shown on their original scales. Scores from different sources are never combined.', caveat: 'A leaderboard is not a universal ranking. Compare within one source, task set and product version.', source: 'Evaluation source', region: 'Market', sort: 'Sort by', sortRank: 'Source rank', sortName: 'Name', count: 'products', noScore: 'Not scored', sourceNote: 'Source notes and sample sizes are shown in each row.', table: ['Agent', 'Source score', 'Coverage / sample', 'Market', 'Source'] },
    agents: { title: 'Find a personal agent', subtitle: 'Explore products by task, deployment and public evaluation evidence.', filterTitle: 'Filter agents', selected: 'Selected for comparison', resultCount: 'agents', compareHint: 'Select up to 3 agents to compare.', categoryTitle: 'Product type', regionTitle: 'Market', deploymentTitle: 'Deployment' },
    detail: { back: 'All agents', overview: 'Overview', publicScores: 'Public evaluation results', abilities: 'Profile & capabilities', profileNote: 'Product facts are summarized from public sources. Availability and prices can change by region and plan.', noScores: 'No public task score found in the selected sources.', evidenceNote: 'A documented capability is not proof of task performance.', startCompare: 'Add to comparison', tryBlind: 'Try a blind test', scoreContext: 'Each result uses its evaluator’s native scale and conditions.' },
    tasks: { title: 'Tasks worth testing', subtitle: 'A benchmark should reflect what people delegate, and what an agent must not do without permission.', taskCount: 'task templates', evaluation: 'What we check', noSecret: 'Task prompts are examples. Hidden variants help reduce benchmark overfitting.' },
    methodology: { title: 'How Agent Index evaluates agents', subtitle: 'A useful score needs a clear task, a verifiable outcome and enough context to interpret the result.', principles: 'Our principles', p1: 'Test products, not just base models.', p2: 'Verify the final state where possible.', p3: 'Separate capability, user preference and trust.', p4: 'Show coverage, sample size, version and date.', p5: 'Keep unknown information visibly unknown.', p6: 'Disclose vendor submissions and conflicts.', flow: 'The evaluation flow', steps: [['01', 'Define the task', 'Set up the initial state, user intent, authorization and success criteria.'], ['02', 'Run the agent', 'Use the same task conditions and record product version, settings and interventions.'], ['03', 'Verify the outcome', 'Check the resulting state or artifact; do not rely on the agent’s own claim.'], ['04', 'Publish the evidence', 'Report sample size, date, score source, coverage and known limitations.']], blind: 'Blind comparison', blindText: 'Reviewers see anonymized outputs before voting. Product identity is revealed after a vote. Interfaces or distinctive response styles may reveal an agent, so we describe this as blind review rather than claiming perfect double blindness.', demoTitle: 'This prototype', demoText: 'The vote and submission form on this site are local demonstrations. They do not send data or change public results.', sources: 'Current public sources' },
    submit: { title: 'Submit a personal agent', subtitle: 'Suggest a product for the directory or request an independent evaluation.', name: 'Product name', company: 'Company or project', url: 'Product URL', email: 'Contact email', description: 'What can this agent do?', request: 'What should we test?', submitButton: 'Submit for review', success: 'Submission saved for this demo', successText: 'This prototype does not send your information. No backend is connected.', reset: 'Submit another', consent: 'I understand this demo stores nothing and does not contact the team.', required: 'Please complete the required fields.', note: 'This form is a front-end prototype. It does not transmit or persist your submission.' },
    arena: { title: 'Blind test', subtitle: 'Compare two anonymous agents on the same personal task.', taskLabel: 'Test task', promptLabel: 'User request', a: 'Agent A', b: 'Agent B', resultLabel: 'Observed outcome', choose: 'Which agent would you trust with this task?', voteA: 'Choose Agent A', voteB: 'Choose Agent B', tie: 'About the same', voted: 'Vote recorded for this demo', reveal: 'Reveal agents', chooseAgain: 'Try another task', demoBanner: 'Demo match · sample output, not a verified evaluation', rule: 'Vote on the outcome and whether the agent stayed within the user’s permission.', why: 'Why this result?', taskScore: 'Task outcome', trustScore: 'Permission handling', close: 'Back to overview' },
    regionNames: { US: 'United States', CN: 'China' },
    categories: { 'Personal agent': 'Personal agent', 'Claw-style agent': 'Claw-style agent', 'Home assistant': 'Home assistant', 'Personal / team agent': 'Personal / team agent' },
    taskCategories: { Research: 'Research', Privacy: 'Privacy', Planning: 'Planning', Transactions: 'Transactions', Memory: 'Memory', Communication: 'Communication', Productivity: 'Productivity' },
    levels: { Intermediate: 'Task quality', Trust: 'Trust & permission' },
    statuses: { public: 'Independent public evaluation', none: 'No score in these sources' },
  },
  zh: {
    nav: { home: '概览', leaderboard: '评测榜单', agents: '产品目录', tasks: '任务库', method: '评测方法', submit: '提交产品', arena: '盲测对比' },
    search: '搜索产品、任务…', footer: '面向个人 Agent 的独立评测导航。', updated: '公开数据快照 · 2026 年 10 月 9 日', publicData: '公开来源数据', demo: '演示互动', unknown: '尚未确认',
    browseAgents: '浏览 Agent', viewLeaderboard: '查看评测榜单', exploreTasks: '浏览任务', compare: '加入对比', comparing: '对比中', remove: '移除',
    common: { all: '全部', independent: '独立评测', documented: '公开资料', vendor: '厂商自述', source: '原始来源', details: '查看详情', regionUS: '美国', regionCN: '中国', cloud: '云端', local: '本地', noResults: '没有符合筛选条件的 Agent。', score: '成绩', sample: '样本', tested: '测试日期', rank: '来源排名', coverage: '覆盖度', category: '产品类型', deployment: '部署方式', access: '开放状态', pricing: '价格', updated: '来源更新', evidence: '证据类型', unknownLabel: '未知', viewAll: '查看全部', clear: '清除筛选', search: '搜索', close: '关闭' },
    home: { title: '这项任务，值得托付给哪个 Agent？', subtitle: '用独立评测、真实任务和清晰的权限边界，比较个人 Agent。', cta: '查看评测榜单', secondary: '开始盲测', section1: '公开证据，一目了然', stat1: '个产品被公开来源收录', stat2: '个独立评测来源', stat3: '条有来源依据的能力记录', statNote: '数据来自 PAEval 于 2026 年 10 月 9 日的公开快照。', leaderboard: '独立评测结果', leaderboardSub: '每项成绩保留评测方原始量表。', taskTitle: '你想让 Agent 做什么？', taskSub: '先选一个任务，再根据相关证据比较产品。', featured: '热门产品', featuredSub: '已公开报告评测结果的产品。', latest: '分数必须和测试条件一起看。', latestSub: '比较之前，先确认样本量、覆盖度和测试条件。', latestLink: '了解评测方法' },
    leaderboard: { title: 'Personal Agent 评测榜单', subtitle: '展示公开评测的原始成绩；不同来源的分数不会合并。', caveat: '榜单不是跨产品的绝对排名。请在同一来源、任务集和产品版本内比较。', source: '评测来源', region: '市场', sort: '排序方式', sortRank: '来源排名', sortName: '产品名称', count: '个产品', noScore: '暂无成绩', sourceNote: '每行展示对应来源的样本量与说明。', table: ['产品', '来源成绩', '覆盖度 / 样本', '市场', '来源'] },
    agents: { title: '找到适合你的个人 Agent', subtitle: '按任务、部署方式和公开评测证据发现产品。', filterTitle: '筛选 Agent', selected: '已选对比', resultCount: '个产品', compareHint: '最多选择 3 个产品进行对比。', categoryTitle: '产品类型', regionTitle: '市场', deploymentTitle: '部署方式' },
    detail: { back: '所有产品', overview: '产品概览', publicScores: '公开评测成绩', abilities: '资料与能力', profileNote: '产品信息来自公开来源；开放状态和价格可能随地区与套餐变化。', noScores: '所选公开来源中暂无该产品的任务成绩。', evidenceNote: '公开资料中提到某项能力，不代表该能力已通过任务测试。', startCompare: '加入产品对比', tryBlind: '体验盲测', scoreContext: '不同成绩使用各评测方自己的量表与测试条件。' },
    tasks: { title: '值得测一测的真实任务', subtitle: '基准测试应反映用户会委托什么，以及 Agent 未经授权不能做什么。', taskCount: '个任务模板', evaluation: '评测要点', noSecret: '展示的是任务示例。隐藏变体用于降低针对榜单优化的影响。' },
    methodology: { title: 'Agent Index 如何评测 Agent', subtitle: '可信成绩需要清楚的任务、可核验的结果和足够的测试背景。', principles: '评测原则', p1: '测完整产品，而不只测底层模型。', p2: '尽可能核对任务完成后的真实状态。', p3: '分别报告能力、用户偏好和可信度。', p4: '公开覆盖度、样本量、版本和日期。', p5: '未知信息明确标为未知。', p6: '披露厂商投稿和利益关系。', flow: '评测流程', steps: [['01', '定义任务', '设定初始状态、用户意图、授权范围和成功标准。'], ['02', '运行 Agent', '保持任务条件一致，并记录产品版本、设置和人工介入。'], ['03', '核验结果', '检查最终状态或交付物，不以 Agent 自述作为唯一依据。'], ['04', '公开证据', '报告样本量、日期、成绩来源、覆盖度和已知限制。']], blind: '盲测对比', blindText: '评测者投票前只看到匿名结果，投票后才揭晓产品身份。界面或表达风格仍可能暴露 Agent，因此我们称其为盲评，不宣称绝对双盲。', demoTitle: '当前原型', demoText: '本站的投票与提交表单仅为本地演示，不会传输数据，也不会改变公开成绩。', sources: '当前公开数据来源' },
    submit: { title: '提交一个 Personal Agent', subtitle: '推荐产品加入目录，或申请独立评测。', name: '产品名称', company: '公司或项目', url: '产品网址', email: '联系邮箱', description: '这个 Agent 可以做什么？', request: '你希望我们测试什么？', submitButton: '提交审核', success: '演示提交已完成', successText: '当前原型不会发送你的信息，尚未连接后端。', reset: '继续提交', consent: '我了解这是一个演示表单，不会保存信息或联系团队。', required: '请填写必填项。', note: '这是一个前端原型表单，不会传输或保存你提交的信息。' },
    arena: { title: '匿名盲测', subtitle: '用同一项个人任务，对比两个匿名 Agent。', taskLabel: '测试任务', promptLabel: '用户请求', a: 'Agent A', b: 'Agent B', resultLabel: '观察到的结果', choose: '这项任务你更愿意托付给谁？', voteA: '选择 Agent A', voteB: '选择 Agent B', tie: '表现差不多', voted: '演示投票已记录', reveal: '揭晓产品', chooseAgain: '再试一个任务', demoBanner: '演示对局 · 样例输出，不是经核验的评测结果', rule: '请同时考虑任务结果和 Agent 是否遵守用户授权。', why: '结果说明', taskScore: '任务结果', trustScore: '权限处理', close: '返回概览' },
    regionNames: { US: '美国', CN: '中国' },
    categories: { 'Personal agent': '个人 Agent', 'Claw-style agent': 'Claw 类 Agent', 'Home assistant': '家庭助手', 'Personal / team agent': '个人 / 团队 Agent' },
    taskCategories: { Research: '研究与搜索', Privacy: '隐私保护', Planning: '计划安排', Transactions: '交易与预订', Memory: '记忆', Communication: '沟通', Productivity: '效率' },
    levels: { Intermediate: '任务质量', Trust: '信任与授权' },
    statuses: { public: '独立公开评测', none: '暂无公开成绩' },
  },
};

const tget = (obj, path) => path.split('.').reduce((value, key) => value?.[key], obj);
const Icon = ({ name, size = 18 }) => {
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    sparkle: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

function App() {
  const [locale, setLocale] = useState(() => localStorage.getItem('agent-index-locale') || 'zh');
  const [path, setPath] = useState(window.location.pathname);
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toast, setToast] = useState('');
  const tr = copy[locale];

  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('agent-index-locale', locale);
  }, [locale]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = (href) => (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({}, '', href);
    setPath(href.split('?')[0]);
    setGlobalSearch('');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const toggleLocale = () => setLocale((value) => value === 'zh' ? 'en' : 'zh');
  const toggleCompare = (id) => setCompareIds((current) => {
    if (current.includes(id)) return current.filter((item) => item !== id);
    if (current.length >= 3) { setToast(locale === 'zh' ? '最多同时对比 3 个产品' : 'Compare up to 3 agents at a time'); return current; }
    return [...current, id];
  });
  const selectedAgents = agents.filter((agent) => compareIds.includes(agent.id));
  const productPath = path.match(/^\/agents\/([^/]+)/);
  const pageKey = path === '/' ? 'home' : path === '/leaderboard' ? 'leaderboard' : path === '/agents' ? 'agents' : path === '/tasks' ? 'tasks' : path === '/methodology' ? 'methodology' : path === '/submit' ? 'submit' : path === '/arena' ? 'arena' : productPath ? 'detail' : 'notFound';
  const agent = productPath ? agents.find((item) => item.id === productPath[1]) : null;
  const navItems = ['leaderboard', 'agents', 'tasks', 'method', 'arena'];

  return <>
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" onClick={navigate('/')} aria-label="Agent Index home">
          <span className="brand-mark"><i /><i /><i /><i /></span><span>agent<span className="brand-light">index</span></span>
        </a>
        <nav className="main-nav" aria-label={locale === 'zh' ? '主导航' : 'Main navigation'}>
          {navItems.map((item) => <a key={item} className={`${pageKey === item || (item === 'agents' && pageKey === 'detail') ? 'active' : ''} ${item === 'arena' ? 'nav-arena' : ''}`} href={`/${item === 'method' ? 'methodology' : item}`} onClick={navigate(`/${item === 'method' ? 'methodology' : item}`)}>{tr.nav[item]}</a>)}
        </nav>
        <div className="header-actions">
          <label className="header-search"><Icon name="search" size={17} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder={tr.search} aria-label={tr.search} onKeyDown={(event) => { if (event.key === 'Enter' && globalSearch.trim()) { window.history.pushState({}, '', `/agents?q=${encodeURIComponent(globalSearch.trim())}`); setPath('/agents'); } }} /></label>
          <button className="locale-toggle" onClick={toggleLocale} aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}><span>{locale === 'zh' ? '中' : 'EN'}</span><span className="locale-divider">/</span><span className="locale-muted">{locale === 'zh' ? 'EN' : '中'}</span></button>
          <a className="submit-top" href="/submit" onClick={navigate('/submit')}>{tr.nav.submit}<Icon name="arrow" size={15} /></a>
        </div>
      </header>

      {globalSearch.trim() && <div className="search-popover"><div className="search-popover-title">{locale === 'zh' ? '快速搜索' : 'Quick search'}</div>{agents.filter((item) => `${item.name} ${item.vendor}`.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 5).map((item) => <a key={item.id} href={`/agents/${item.id}`} onClick={navigate(`/agents/${item.id}`)}><BrandAvatar name={item.name} vendor={item.vendor} /><span>{item.name}<small>{item.vendor}</small></span><Icon name="arrow" size={15} /></a>)}</div>}

      <main>
        {pageKey === 'home' && <HomePage tr={tr} locale={locale} navigate={navigate} onCompare={toggleCompare} compareIds={compareIds} />}
        {pageKey === 'leaderboard' && <LeaderboardPage tr={tr} locale={locale} navigate={navigate} />}
        {pageKey === 'agents' && <AgentsPage tr={tr} locale={locale} navigate={navigate} onCompare={toggleCompare} compareIds={compareIds} />}
        {pageKey === 'detail' && agent && <AgentPage agent={agent} tr={tr} locale={locale} navigate={navigate} onCompare={toggleCompare} compareIds={compareIds} />}
        {pageKey === 'tasks' && <TasksPage tr={tr} locale={locale} navigate={navigate} />}
        {pageKey === 'methodology' && <MethodologyPage tr={tr} locale={locale} navigate={navigate} />}
        {pageKey === 'submit' && <SubmitPage tr={tr} locale={locale} />}
        {pageKey === 'arena' && <ArenaPage tr={tr} locale={locale} navigate={navigate} />}
        {pageKey === 'notFound' && <NotFound tr={tr} navigate={navigate} />}
      </main>

      <footer className="site-footer"><a className="brand footer-brand" href="/" onClick={navigate('/')}><span className="brand-mark"><i /><i /><i /><i /></span><span>agent<span className="brand-light">index</span></span></a><span>{tr.footer}</span><div className="footer-links"><a href="/methodology" onClick={navigate('/methodology')}>{tr.nav.method}</a><a href="/submit" onClick={navigate('/submit')}>{tr.nav.submit}</a><span>© 2026 Agent Index</span></div></footer>
    </div>

    {compareIds.length > 0 && <div className="compare-bar"><div><span className="compare-count">{compareIds.length}</span><span>{locale === 'zh' ? `已选择 ${compareIds.length} 个产品` : `${compareIds.length} agents selected`}</span></div><div className="compare-bar-actions"><button className="button button-quiet" onClick={() => { setCompareIds([]); setCompareOpen(false); }}>{tr.common.clear}</button><button className="button button-dark" onClick={() => setCompareOpen(true)}>{locale === 'zh' ? '打开对比' : 'Compare agents'}<Icon name="arrow" size={15} /></button></div></div>}
    {compareOpen && <CompareModal agents={selectedAgents} tr={tr} locale={locale} onClose={() => setCompareOpen(false)} onRemove={toggleCompare} />}
    {toast && <div className="toast" role="status"><Icon name="check" size={16} />{toast}</div>}
  </>;
}

function PageIntro({ title, subtitle, eyebrow, action }) {
  return <div className="page-intro"><div><h1>{title}</h1><p>{subtitle}</p></div>{action && <div className="intro-action">{action}</div>}</div>;
}

function BrandAvatar({ name, vendor, small = false }) {
  const initials = vendor === 'ByteDance' ? '字' : vendor === 'Baidu' ? '度' : vendor === 'Xiaomi' ? '米' : vendor === 'Alibaba' ? '阿' : name.split(/[\s·-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <span className={`brand-avatar avatar-${(vendor || '').toLowerCase().replace(/[^a-z]/g, '')} ${small ? 'avatar-small' : ''}`}>{initials}</span>;
}

function ScorePill({ score, source, tr, compact = false }) {
  const val = source === 'micro1' ? `${score.score}%` : source === 'superclue' ? score.score.toFixed(2) : score.score.toFixed(1);
  return <span className={`score-pill score-${source} ${compact ? 'score-compact' : ''}`}><strong>{val}</strong>{!compact && <small>{sources[source].short}</small>}</span>;
}

function SourceLabel({ source, locale }) {
  const label = sources[source].short;
  return <a className="source-link" href={sources[source].href} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{label}<Icon name="external" size={12} /></a>;
}

function AgentCard({ agent, tr, locale, navigate, onCompare, selected }) {
  const best = Object.keys(agent.scores)[0];
  const score = agent.scores[best];
  return <article className="agent-card">
    <div className="agent-card-top"><BrandAvatar name={agent.name} vendor={agent.vendor} /><button className={`compare-toggle ${selected ? 'selected' : ''}`} onClick={() => onCompare(agent.id)}>{selected ? <><Icon name="check" size={14} />{tr.comparing}</> : <><Icon name="plus" size={14} />{tr.compare}</>}</button></div>
    <button className="agent-card-title" onClick={() => navigate(`/agents/${agent.id}`)()}><span>{agent.name}</span><Icon name="arrow" size={15} /></button>
    <div className="agent-card-vendor">{agent.vendor}<span>·</span>{tr.regionNames[agent.region]}</div>
    <p>{locale === 'zh' ? agent.descriptionZh : agent.description}</p>
    <div className="agent-card-meta"><span>{tr.categories[agent.category] || agent.category}</span><span>{agent.deployment === 'Local' ? tr.common.local : tr.common.cloud}</span></div>
    <div className="agent-card-score">{score ? <><ScorePill score={score} source={best} tr={tr} compact /><span>{best === 'assistant' ? score.detail : score.detail}</span></> : <span className="muted">{tr.detail.noScores}</span>}</div>
    <div className="agent-card-footer"><SourceLabel source={best} locale={locale} /><button onClick={() => navigate(`/agents/${agent.id}`)()}>{tr.common.details}<Icon name="arrow" size={14} /></button></div>
  </article>;
}

function HomePage({ tr, locale, navigate, onCompare, compareIds }) {
  const featured = ['meta-muse', 'instinct', 'gemini-spark', 'wenxin-task'].map((id) => agents.find((item) => item.id === id));
  const sourcesData = [
    { id: 'assistant', rows: ['meta-muse', 'instinct', 'openai-dots', 'town'] },
    { id: 'micro1', rows: ['gemini-spark', 'instinct', 'grok-bot', 'meta-muse'] },
    { id: 'superclue', rows: ['wenxin-task', 'mimoclaw', 'workbuddy', 'kimiclaw'] },
  ];
  return <>
    <section className="hero section-wrap">
      <div className="hero-copy"><div className="hero-note"><span className="status-dot" />{tr.updated}</div><h1>{tr.home.title}</h1><p>{tr.home.subtitle}</p><div className="hero-actions"><a className="button button-blue" href="/leaderboard" onClick={navigate('/leaderboard')}>{tr.home.cta}<Icon name="arrow" size={16} /></a><a className="button button-outline" href="/arena" onClick={navigate('/arena')}>{tr.home.secondary}<span className="button-icon"><Icon name="arrow" size={15} /></span></a></div><div className="hero-assurance"><Icon name="shield" size={17} />{locale === 'zh' ? '以任务结果为依据 · 公开来源可追溯' : 'Task outcomes first · Every source traceable'}</div></div>
      <div className="hero-art" aria-label="Illustration of agents being compared"><div className="art-topline"><span>{locale === 'zh' ? '评测记录' : 'EVALUATION LOG'}</span><span><i /> LIVE DATA</span></div><div className="art-task"><span className="art-task-icon"><Icon name="sparkle" size={17} /></span><div><small>{locale === 'zh' ? '当前任务' : 'CURRENT TASK'}</small><strong>{locale === 'zh' ? '整理日程，不要发送邀请' : 'Organize a calendar, don’t send invites'}</strong></div></div><div className="art-run"><div className="art-agent"><span className="art-node node-blue">A</span><span><b>{locale === 'zh' ? 'Agent A' : 'Agent A'}</b><small>{locale === 'zh' ? '任务完成' : 'Task completed'}</small></span><strong className="ok-text"><Icon name="check" size={15} /></strong></div><div className="art-line"><span /></div><div className="art-agent"><span className="art-node node-orange">B</span><span><b>{locale === 'zh' ? 'Agent B' : 'Agent B'}</b><small>{locale === 'zh' ? '超出授权范围' : 'Outside authorization'}</small></span><strong className="warn-text">!</strong></div></div><div className="art-result"><span>{locale === 'zh' ? '任务结果' : 'TASK OUTCOME'}</span><strong>{locale === 'zh' ? '匿名 · 可核验 · 有证据' : 'BLIND · VERIFIABLE · EVIDENCED'}</strong></div><div className="art-stamp">AI<br/>≠<br/>VIBES</div></div>
    </section>

    <section className="stats-band"><div className="section-wrap stats-grid"><div className="stats-label">{tr.home.section1}<small>{tr.home.statNote}</small></div><Stat value="44" label={tr.home.stat1} /><Stat value="3" label={tr.home.stat2} /><Stat value="539" label={tr.home.stat3} /></div></section>

    <section className="section-wrap section-block"><div className="section-heading"><div><span className="section-kicker">01 / EVALUATIONS</span><h2>{tr.home.leaderboard}</h2><p>{tr.home.leaderboardSub}</p></div><a className="text-link" href="/leaderboard" onClick={navigate('/leaderboard')}>{tr.common.viewAll}<Icon name="arrow" size={16} /></a></div>
      <div className="source-panels">{sourcesData.map(({ id, rows }) => <SourcePanel key={id} sourceId={id} rows={rows} tr={tr} locale={locale} navigate={navigate} />)}</div>
    </section>

    <section className="task-band"><div className="section-wrap task-band-inner"><div><span className="section-kicker">02 / REAL-WORLD WORK</span><h2>{tr.home.taskTitle}</h2><p>{tr.home.taskSub}</p></div><div className="task-chips">{tasks.slice(0, 5).map((task) => <a key={task.id} href="/tasks" onClick={navigate('/tasks')}><span>{locale === 'zh' ? task.titleZh : task.title}</span><Icon name="arrow" size={14} /></a>)}<a className="all-tasks" href="/tasks" onClick={navigate('/tasks')}>{tr.exploreTasks}<Icon name="arrow" size={15} /></a></div></div></section>

    <section className="section-wrap section-block"><div className="section-heading"><div><span className="section-kicker">03 / PRODUCT DIRECTORY</span><h2>{tr.home.featured}</h2><p>{tr.home.featuredSub}</p></div><a className="text-link" href="/agents" onClick={navigate('/agents')}>{tr.browseAgents}<Icon name="arrow" size={16} /></a></div><div className="agent-grid">{featured.map((item) => <AgentCard key={item.id} agent={item} tr={tr} locale={locale} navigate={navigate} onCompare={onCompare} selected={compareIds.includes(item.id)} />)}</div></section>

    <section className="method-callout section-wrap"><div className="method-icon"><Icon name="shield" size={23} /></div><div><h2>{tr.home.latest}</h2><p>{tr.home.latestSub}</p></div><a className="button button-dark" href="/methodology" onClick={navigate('/methodology')}>{tr.home.latestLink}<Icon name="arrow" size={15} /></a></section>
  </>;
}

function Stat({ value, label }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div>; }

function SourcePanel({ sourceId, rows, tr, locale, navigate }) {
  const source = sources[sourceId];
  return <article className={`source-panel source-${sourceId}`}>
    <div className="source-panel-head"><span className="source-mark">{sourceId === 'assistant' ? 'AB' : sourceId === 'micro1' ? 'm1' : 'SC'}</span><div><strong>{source.short}</strong><small>{sourceId === 'assistant' ? 'United States · English' : sourceId === 'micro1' ? 'US · Real account workflows' : 'China · Chinese tasks'}</small></div><a href={source.href} target="_blank" rel="noreferrer" aria-label={tr.common.source}><Icon name="external" size={15} /></a></div>
    <div className="source-panel-scale">{locale === 'zh' ? source.scaleZh : source.scale}<span>{source.date}</span></div>
    <div className="source-results">{rows.map((id) => { const item = agents.find((agent) => agent.id === id); const score = item?.scores[sourceId]; return item && score ? <a key={id} href={`/agents/${id}`} onClick={navigate(`/agents/${id}`)} className="source-result"><span className="result-agent"><BrandAvatar name={item.name} vendor={item.vendor} small /><span><b>{item.name}</b><small>{item.vendor}</small></span></span><span className="result-score">{sourceId === 'micro1' ? `${score.score}%` : sourceId === 'superclue' ? score.score.toFixed(2) : score.score.toFixed(1)}{sourceId !== 'micro1' && sourceId !== 'superclue' && <small>/ 10</small>}</span></a> : null; })}</div>
    <p className="source-caveat"><Icon name="info" size={14} />{locale === 'zh' ? source.caveatZh : source.caveat}</p>
  </article>;
}

function LeaderboardPage({ tr, locale, navigate }) {
  const [sourceId, setSourceId] = useState('assistant');
  const [region, setRegion] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('rank');
  const source = sources[sourceId];
  const rows = useMemo(() => agents.filter((item) => item.scores[sourceId] && (region === 'all' || item.region === region) && `${item.name} ${item.vendor}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : a.scores[sourceId].score - b.scores[sourceId].score).reverse(), [sourceId, region, query, sort]);
  return <div className="section-wrap page-shell">
    <PageIntro title={tr.leaderboard.title} subtitle={tr.leaderboard.subtitle} action={<span className="snapshot-chip"><span className="status-dot" />{tr.updated}</span>} />
    <div className="notice notice-blue"><Icon name="info" size={17} /><p>{tr.leaderboard.caveat}</p></div>
    <div className="leaderboard-controls"><div className="source-tabs" role="tablist">{Object.entries(sources).map(([id, item]) => <button key={id} role="tab" aria-selected={sourceId === id} className={sourceId === id ? 'active' : ''} onClick={() => setSourceId(id)}>{item.short}</button>)}</div><div className="control-row"><label className="select-control"><span>{tr.leaderboard.region}</span><select value={region} onChange={(event) => setRegion(event.target.value)}><option value="all">{tr.common.all}</option><option value="US">{tr.common.regionUS}</option><option value="CN">{tr.common.regionCN}</option></select><Icon name="chevron" size={15} /></label><label className="select-control"><span>{tr.leaderboard.sort}</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="rank">{tr.leaderboard.sortRank}</option><option value="name">{tr.leaderboard.sortName}</option></select><Icon name="chevron" size={15} /></label><label className="inline-search"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr.common.search} /></label></div></div>
    <div className="leaderboard-source-summary"><div><span className="section-kicker">SOURCE / {source.name.toUpperCase()}</span><p>{locale === 'zh' ? source.scaleZh : source.scale}</p></div><a className="text-link" href={source.href} target="_blank" rel="noreferrer">{tr.common.source}<Icon name="external" size={14} /></a></div>
    <div className="table-wrap"><table className="leaderboard-table"><thead><tr>{tr.leaderboard.table.map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map((item, index) => { const score = item.scores[sourceId]; return <tr key={item.id}><td><div className="table-agent"><span className="table-rank">{sort === 'rank' ? String(index + 1).padStart(2, '0') : '—'}</span><BrandAvatar name={item.name} vendor={item.vendor} small /><span><a href={`/agents/${item.id}`} onClick={navigate(`/agents/${item.id}`)}>{item.name}</a><small>{item.vendor}</small></span></div></td><td><ScorePill score={score} source={sourceId} tr={tr} compact /></td><td><span className="table-sample">{sourceId === 'micro1' ? score.detail : score.detail}</span>{score.interval && <small className="table-interval">95% CI {score.interval}</small>}{sourceId === 'assistant' && <small>{score.detail}</small>}</td><td><span className={`region-flag region-${item.region}`}>{item.region === 'US' ? 'US' : 'CN'}</span>{tr.regionNames[item.region]}</td><td><SourceLabel source={sourceId} locale={locale} /></td></tr>; })}</tbody></table>{rows.length === 0 && <div className="empty-state"><Icon name="search" size={25} /><strong>{tr.common.noResults}</strong><button className="text-link" onClick={() => { setRegion('all'); setQuery(''); }}>{tr.common.clear}</button></div>}</div>
    <div className="leaderboard-footnote"><Icon name="info" size={15} /><span>{locale === 'zh' ? source.caveatZh : source.caveat}</span><span>{rows.length} {tr.leaderboard.count}</span></div>
  </div>;
}

function AgentsPage({ tr, locale, navigate, onCompare, compareIds }) {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(params.get('q') || '');
  const [region, setRegion] = useState('all');
  const [category, setCategory] = useState('All');
  const [deployment, setDeployment] = useState('all');
  const filtered = agents.filter((item) => (region === 'all' || item.region === region) && (category === 'All' || item.category === category) && (deployment === 'all' || item.deployment === deployment) && `${item.name} ${item.vendor} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="section-wrap page-shell"><PageIntro title={tr.agents.title} subtitle={tr.agents.subtitle} action={<span className="result-count"><strong>{filtered.length}</strong> {tr.agents.resultCount}</span>} />
    <div className="directory-layout"><aside className="filters"><div className="filter-heading"><strong>{tr.agents.filterTitle}</strong><button onClick={() => { setQuery(''); setRegion('all'); setCategory('All'); setDeployment('all'); }}>{tr.common.clear}</button></div>
      <label className="filter-search"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr.search} /></label>
      <FilterGroup label={tr.agents.categoryTitle}>{categories.map((item) => <button key={item} className={category === item ? 'filter-option active' : 'filter-option'} onClick={() => setCategory(item)}><span>{item === 'All' ? tr.common.all : tr.categories[item]}</span><span className="filter-count">{item === 'All' ? agents.length : agents.filter((agent) => agent.category === item).length}</span></button>)}</FilterGroup>
      <FilterGroup label={tr.agents.regionTitle}>{[['all', tr.common.all], ['US', tr.common.regionUS], ['CN', tr.common.regionCN]].map(([value, label]) => <button key={value} className={region === value ? 'filter-option active' : 'filter-option'} onClick={() => setRegion(value)}><span>{label}</span><span className="filter-radio" /></button>)}</FilterGroup>
      <FilterGroup label={tr.agents.deploymentTitle}>{[['all', tr.common.all], ['Cloud', tr.common.cloud], ['Local', tr.common.local]].map(([value, label]) => <button key={value} className={deployment === value ? 'filter-option active' : 'filter-option'} onClick={() => setDeployment(value)}><span>{label}</span><span className="filter-radio" /></button>)}</FilterGroup>
      <div className="filter-note"><Icon name="shield" size={16} /><span>{locale === 'zh' ? '无成绩不代表能力为零。我们会标出证据缺口。' : 'No score does not mean no capability. Evidence gaps stay visible.'}</span></div>
    </aside><div className="directory-results"><div className="directory-toolbar"><span>{tr.agents.compareHint}</span><span>{locale === 'zh' ? '成绩按来源分别展示' : 'Scores shown by source'}</span></div><div className="agent-grid directory-grid">{filtered.map((item) => <AgentCard key={item.id} agent={item} tr={tr} locale={locale} navigate={navigate} onCompare={onCompare} selected={compareIds.includes(item.id)} />)}</div>{filtered.length === 0 && <div className="empty-state"><Icon name="search" size={25} /><strong>{tr.common.noResults}</strong></div>}</div></div>
  </div>;
}

function FilterGroup({ label, children }) { return <section className="filter-group"><h3>{label}</h3>{children}</section>; }

function AgentPage({ agent, tr, locale, navigate, onCompare, compareIds }) {
  const isSelected = compareIds.includes(agent.id);
  const entries = Object.entries(agent.scores);
  return <div className="section-wrap page-shell detail-page"><a className="back-link" href="/agents" onClick={navigate('/agents')}>← {tr.detail.back}</a>
    <div className="detail-hero"><div className="detail-main"><BrandAvatar name={agent.name} vendor={agent.vendor} /><div><div className="detail-vendor">{agent.vendor} <span>·</span> {tr.regionNames[agent.region]}</div><h1>{agent.name}</h1><p>{locale === 'zh' ? agent.descriptionZh : agent.description}</p><div className="detail-tags"><span>{tr.categories[agent.category]}</span><span>{agent.deployment === 'Local' ? tr.common.local : tr.common.cloud}</span><span>{locale === 'zh' ? '公开资料快照' : 'Public profile snapshot'}</span></div></div></div><div className="detail-actions"><button className={`button ${isSelected ? 'button-outline' : 'button-dark'}`} onClick={() => onCompare(agent.id)}>{isSelected ? <><Icon name="check" size={15} />{tr.comparing}</> : <><Icon name="plus" size={15} />{tr.detail.startCompare}</>}</button><a className="button button-blue" href="/arena" onClick={navigate('/arena')}>{tr.detail.tryBlind}<Icon name="arrow" size={15} /></a></div></div>
    <div className="detail-grid"><div className="detail-column"><section className="content-panel"><div className="panel-heading"><div><span className="section-kicker">01 / EVIDENCE</span><h2>{tr.detail.publicScores}</h2></div><span className="snapshot-chip">{agent.updated}</span></div><p className="panel-description">{tr.detail.scoreContext}</p>{entries.length ? <div className="score-list">{entries.map(([sourceId, score]) => <div className="score-row" key={sourceId}><div><strong>{sources[sourceId].name}</strong><small>{locale === 'zh' ? sources[sourceId].scaleZh : sources[sourceId].scale}</small></div><ScorePill score={score} source={sourceId} tr={tr} /><div className="score-row-meta"><span>{tr.common.coverage}: {score.detail}</span>{score.interval && <span>95% CI {score.interval}</span>}{score.rank && <span>{tr.common.rank} #{score.rank}</span>}</div><SourceLabel source={sourceId} locale={locale} /></div>)}</div> : <div className="no-score-box"><span>—</span><p>{tr.detail.noScores}</p></div>}{entries.some(([id]) => id === 'assistant') && <div className="notice notice-amber"><Icon name="info" size={16} /><p>{locale === 'zh' ? 'Assistant Benchmark 各产品获得的已评分维度不同，不能只看均值。' : 'Assistant Benchmark scores different dimensions per product; compare the coverage as well as the mean.'}</p></div>}</section>
      <section className="content-panel"><div className="panel-heading"><div><span className="section-kicker">02 / PRODUCT PROFILE</span><h2>{tr.detail.abilities}</h2></div></div><p className="panel-description">{tr.detail.profileNote}</p><div className="profile-table"><ProfileRow label={tr.common.category} value={tr.categories[agent.category]} /><ProfileRow label={tr.common.deployment} value={agent.deployment === 'Local' ? tr.common.local : tr.common.cloud} /><ProfileRow label={tr.common.access} value={locale === 'zh' ? agent.accessZh : agent.access} /><ProfileRow label={tr.common.pricing} value={locale === 'zh' ? agent.pricingZh : agent.pricing} /><ProfileRow label={tr.common.updated} value={agent.updated} /><ProfileRow label={tr.common.evidence} value={entries.length ? tr.statuses.public : tr.statuses.none} /></div><div className="notice notice-blue"><Icon name="shield" size={16} /><p>{tr.detail.evidenceNote}</p></div></section></div>
      <aside className="detail-aside"><div className="aside-sticky"><div className="trust-card"><div className="trust-card-icon"><Icon name="shield" size={19} /></div><h3>{locale === 'zh' ? '证据强度' : 'Evidence coverage'}</h3><p>{locale === 'zh' ? '公开资料不等于独立验证。查看每项能力背后的来源。' : 'Public documentation is not independent verification. Check the source behind each claim.'}</p><div className="trust-breakdown"><span><i className="dot-blue" />{locale === 'zh' ? '独立测试' : 'Independent tests'}</span><strong>{entries.length}</strong><span><i className="dot-gray" />{locale === 'zh' ? '公开资料' : 'Public profile'}</span><strong>—</strong></div><a href={agent.sourceUrl || 'https://paeval.com/'} target="_blank" rel="noreferrer" className="button button-outline full-button">{locale === 'zh' ? '查看产品来源' : 'Open source profile'}<Icon name="external" size={14} /></a></div><div className="source-card"><span className="section-kicker">SOURCE</span><strong>{agent.vendor}</strong><p>{locale === 'zh' ? '资料快照日期' : 'Snapshot date'} · {agent.updated}</p><a href={agent.sourceUrl || 'https://paeval.com/'} target="_blank" rel="noreferrer">{tr.common.source}<Icon name="external" size={13} /></a></div></div></aside></div>
  </div>;
}

function ProfileRow({ label, value }) { return <div className="profile-row"><span>{label}</span><strong>{value || '—'}</strong></div>; }

function TasksPage({ tr, locale, navigate }) {
  const [filter, setFilter] = useState('All');
  const types = ['All', ...new Set(tasks.map((task) => task.category))];
  const filtered = filter === 'All' ? tasks : tasks.filter((task) => task.category === filter);
  return <div className="section-wrap page-shell"><PageIntro title={tr.tasks.title} subtitle={tr.tasks.subtitle} action={<span className="result-count"><strong>{tasks.length}</strong> {tr.tasks.taskCount}</span>} /><div className="task-library-layout"><aside className="task-aside"><span className="section-kicker">TASK CATEGORIES</span><div className="task-filter-list">{types.map((type) => <button key={type} className={filter === type ? 'active' : ''} onClick={() => setFilter(type)}>{type === 'All' ? tr.common.all : tr.taskCategories[type]}<span>{type === 'All' ? tasks.length : tasks.filter((task) => task.category === type).length}</span></button>)}</div><div className="task-aside-note"><Icon name="shield" size={17} /><p>{tr.tasks.noSecret}</p></div></aside><div className="task-list">{filtered.map((task, index) => <article className="task-row" key={task.id}><div className="task-number">{String(index + 1).padStart(2, '0')}</div><div className="task-row-main"><div className="task-row-meta"><span>{tr.taskCategories[task.category]}</span><span>{tr.levels[task.level]}</span></div><h2>{locale === 'zh' ? task.titleZh : task.title}</h2><p>{locale === 'zh' ? task.descriptionZh : task.description}</p><div className="task-checks">{(locale === 'zh' ? task.checksZh : task.checks).map((check) => <span key={check}><Icon name="check" size={13} />{check}</span>)}</div></div><a href="/arena" onClick={navigate('/arena')} className="task-play" aria-label={locale === 'zh' ? '用此任务体验盲测' : 'Try blind test with this task'}><Icon name="arrow" size={17} /></a></article>)}</div></div></div>;
}

function MethodologyPage({ tr, locale }) {
  return <div className="section-wrap page-shell"><PageIntro title={tr.methodology.title} subtitle={tr.methodology.subtitle} />
    <section className="principles-panel"><div><span className="section-kicker">THE STANDARD</span><h2>{tr.methodology.principles}</h2></div><div className="principles-grid">{[tr.methodology.p1, tr.methodology.p2, tr.methodology.p3, tr.methodology.p4, tr.methodology.p5, tr.methodology.p6].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div></section>
    <section className="method-flow"><div className="section-heading"><div><span className="section-kicker">REPEATABLE PROCESS</span><h2>{tr.methodology.flow}</h2></div></div><div className="flow-grid">{tr.methodology.steps.map(([number, title, text]) => <article className="flow-step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="blind-method"><div className="blind-method-mark"><span>A</span><span>B</span><i>?</i></div><div><span className="section-kicker">BLIND REVIEW</span><h2>{tr.methodology.blind}</h2><p>{tr.methodology.blindText}</p></div></section>
    <div className="method-callout prototype-callout"><div className="method-icon"><Icon name="info" size={21} /></div><div><h2>{tr.methodology.demoTitle}</h2><p>{tr.methodology.demoText}</p></div><span className="demo-tag">{tr.demo}</span></div>
    <section className="method-sources"><div className="section-heading"><div><span className="section-kicker">TRANSPARENCY</span><h2>{tr.methodology.sources}</h2></div></div><div className="source-directory">{Object.entries(sources).map(([id, source]) => <div key={id}><span className="source-mark">{id === 'assistant' ? 'AB' : id === 'micro1' ? 'm1' : 'SC'}</span><div><strong>{source.name}</strong><small>{locale === 'zh' ? source.scaleZh : source.scale}</small></div><a href={source.href} target="_blank" rel="noreferrer"><Icon name="external" size={15} /></a></div>)}</div></section>
  </div>;
}

function SubmitPage({ tr, locale }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const onSubmit = (event) => { event.preventDefault(); setError(false); setSuccess(true); };
  return <div className="section-wrap page-shell submit-page"><PageIntro title={tr.submit.title} subtitle={tr.submit.subtitle} /><div className="submit-layout"><div className="submit-copy"><div className="submit-icon"><Icon name="plus" size={22} /></div><h2>{locale === 'zh' ? '让评测覆盖更多产品。' : 'Help us cover more agents.'}</h2><p>{locale === 'zh' ? '我们会先核对产品身份、开放状态和公开资料，再决定是否进入独立评测。厂商提交不等于通过评测。' : 'We verify product identity, access and public documentation before deciding whether to run an independent evaluation. A submission is not an evaluation result.'}</p><div className="submit-steps"><span><i>01</i>{locale === 'zh' ? '核实产品信息' : 'Verify product details'}</span><span><i>02</i>{locale === 'zh' ? '确认可访问性' : 'Confirm access'}</span><span><i>03</i>{locale === 'zh' ? '独立制定测试' : 'Design an independent test'}</span></div></div><div className="form-card">{success ? <div className="form-success"><span className="success-mark"><Icon name="check" size={24} /></span><h2>{tr.submit.success}</h2><p>{tr.submit.successText}</p><button className="button button-dark" onClick={() => setSuccess(false)}>{tr.submit.reset}</button></div> : <form onSubmit={onSubmit} onInvalid={() => setError(true)}><div className="form-heading"><strong>{locale === 'zh' ? '产品推荐表' : 'Product nomination'}</strong><span>{locale === 'zh' ? '纯前端演示' : 'Front-end demo'}</span></div><FormField label={tr.submit.name} required><input required name="name" placeholder={locale === 'zh' ? '例如：Meta Muse' : 'e.g. Meta Muse'} /></FormField><FormField label={tr.submit.company}><input name="company" placeholder={locale === 'zh' ? '公司 / 开源项目' : 'Company / open-source project'} /></FormField><FormField label={tr.submit.url} required><input required name="url" type="url" placeholder="https://" /></FormField><FormField label={tr.submit.email}><input name="email" type="email" placeholder="name@example.com" /></FormField><FormField label={tr.submit.description} required><textarea required name="description" rows="3" placeholder={locale === 'zh' ? '主要任务、运行方式和目标用户' : 'Main tasks, deployment and target users'} /></FormField><FormField label={tr.submit.request}><textarea name="request" rows="2" placeholder={locale === 'zh' ? '你最想验证的能力或风险' : 'A capability or risk you want us to test'} /></FormField>{error && <p className="form-error">{tr.submit.required}</p>}<label className="consent"><input type="checkbox" required /><span>{tr.submit.consent}</span></label><button className="button button-blue form-submit" type="submit">{tr.submit.submitButton}<Icon name="arrow" size={15} /></button><p className="form-note"><Icon name="info" size={13} />{tr.submit.note}</p></form>}</div></div></div>;
}

function FormField({ label, required, children }) { return <label className="form-field"><span>{label}{required && <b>*</b>}</span>{children}</label>; }

function ArenaPage({ tr, locale, navigate }) {
  const [vote, setVote] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState(0);
  const match = round % 2 === 0 ? blindMatch : { ...blindMatch, left: blindMatch.right, right: blindMatch.left };
  const handleVote = (value) => { setVote(value); };
  const reset = () => { setVote(''); setRevealed(false); setRound((value) => value + 1); };
  return <div className="section-wrap page-shell arena-page"><PageIntro title={tr.arena.title} subtitle={tr.arena.subtitle} action={<span className="demo-tag"><i />{tr.demo}</span>} /><div className="demo-banner"><Icon name="sparkle" size={16} /><span>{tr.arena.demoBanner}</span><a href="/methodology" onClick={navigate('/methodology')}>{tr.nav.method}<Icon name="arrow" size={14} /></a></div><div className="arena-task-card"><div className="arena-task-heading"><span className="section-kicker">{tr.arena.taskLabel.toUpperCase()}</span><strong>{locale === 'zh' ? match.taskZh : match.task}</strong></div><div className="arena-prompt"><span>{tr.arena.promptLabel}</span><p>“{locale === 'zh' ? match.promptZh : match.prompt}”</p></div></div><p className="arena-rule"><Icon name="shield" size={16} />{tr.arena.rule}</p><div className="match-grid">{[match.left, match.right].map((item, index) => <article className={`match-card ${revealed ? index === 0 ? 'revealed-left' : 'revealed-right' : ''}`} key={`${round}-${index}`}><div className="match-card-top"><span className={`agent-letter letter-${index}`}>{index === 0 ? 'A' : 'B'}</span><div><span className="section-kicker">{index === 0 ? tr.arena.a : tr.arena.b}</span>{revealed && <strong className="revealed-name">{round % 2 === 0 ? index === 0 ? blindMatch.reveal.leftName : blindMatch.reveal.rightName : index === 0 ? blindMatch.reveal.rightName : blindMatch.reveal.leftName}</strong>}</div><span className="anonymous-label">{revealed ? (locale === 'zh' ? '身份已揭晓' : 'IDENTITY REVEALED') : (locale === 'zh' ? '匿名' : 'ANONYMOUS')}</span></div><p className="match-body">{locale === 'zh' ? item.bodyZh : item.body}</p><div className={`match-outcome ${index === 1 ? 'outcome-warning' : ''}`}><Icon name={index === 1 ? 'info' : 'check'} size={15} /><span>{locale === 'zh' ? item.resultZh : item.result}</span></div>{!vote && !revealed && <button className={`button ${index === 0 ? 'button-outline' : 'button-outline'} vote-button`} onClick={() => handleVote(index === 0 ? 'A' : 'B')}>{index === 0 ? tr.arena.voteA : tr.arena.voteB}<Icon name="arrow" size={14} /></button>}{vote && !revealed && <div className="vote-confirm"><span className="vote-selected"><Icon name="check" size={15} />{vote === (index === 0 ? 'A' : 'B') ? (locale === 'zh' ? '你的选择' : 'Your choice') : (locale === 'zh' ? '已完成投票' : 'Vote submitted')}</span></div>}</article>)}</div><div className="arena-bottom">{vote && !revealed ? <div className="reveal-prompt"><span><Icon name="check" size={15} />{tr.arena.voted}</span><button className="button button-blue" onClick={() => setRevealed(true)}>{tr.arena.reveal}<Icon name="arrow" size={15} /></button></div> : revealed ? <div className="reveal-prompt"><div><strong>{tr.arena.why}</strong><span>{locale === 'zh' ? 'Agent A 按要求只保存草稿；Agent B 未经授权发送了消息。' : 'Agent A saved a draft as requested; Agent B sent the message without authorization.'}</span></div><button className="button button-dark" onClick={reset}>{tr.arena.chooseAgain}<Icon name="arrow" size={15} /></button></div> : <a className="text-link" href="/" onClick={navigate('/')}>{tr.arena.close}<Icon name="arrow" size={15} /></a>}</div><p className="arena-footnote"><Icon name="info" size={14} />{locale === 'zh' ? '此处输出为演示内容。正式榜单只收录可追溯、有样本量和测试条件的结果。' : 'Outputs here are illustrative. Public rankings require traceable results, sample sizes and test conditions.'}</p></div>;
}

function CompareModal({ agents: items, tr, locale, onClose, onRemove }) {
  if (!items.length) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="compare-modal" role="dialog" aria-modal="true" aria-labelledby="compare-title"><div className="modal-header"><div><span className="section-kicker">SIDE-BY-SIDE</span><h2 id="compare-title">{locale === 'zh' ? '产品对比' : 'Compare agents'}</h2></div><button className="icon-button" onClick={onClose} aria-label={tr.common.close}><Icon name="close" size={19} /></button></div><div className="compare-table"><div className="compare-row compare-row-head"><span>{locale === 'zh' ? '产品' : 'Agent'}</span>{items.map((item) => <div key={item.id}><BrandAvatar name={item.name} vendor={item.vendor} small /><strong>{item.name}</strong><button onClick={() => onRemove(item.id)} aria-label={tr.remove}><Icon name="close" size={13} /></button></div>)}</div>{[['Vendor', locale === 'zh' ? '厂商' : 'Provider', (item) => item.vendor], ['Market', locale === 'zh' ? '市场' : 'Market', (item) => tr.regionNames[item.region]], ['Deployment', tr.common.deployment, (item) => item.deployment === 'Local' ? tr.common.local : tr.common.cloud], ['Price', tr.common.pricing, (item) => locale === 'zh' ? item.pricingZh : item.pricing]].map(([key, label, get]) => <div key={key} className="compare-row"><span>{label}</span>{items.map((item) => <strong key={item.id}>{get(item)}</strong>)}</div>)}{['assistant', 'micro1', 'superclue'].map((sourceId) => <div key={sourceId} className="compare-row"><span>{sources[sourceId].short}</span>{items.map((item) => { const score = item.scores[sourceId]; return <div className="compare-score" key={item.id}>{score ? <ScorePill score={score} source={sourceId} tr={tr} compact /> : <span className="muted">{tr.leaderboard.noScore}</span>}</div>; })}</div>)}</div><p className="compare-note"><Icon name="info" size={15} />{tr.leaderboard.caveat}</p><button className="button button-blue full-button" onClick={onClose}>{tr.common.close}</button></section></div>;
}

function NotFound({ tr, navigate }) { return <div className="section-wrap not-found"><span>404</span><h1>{tr.common.noResults}</h1><a className="button button-dark" href="/" onClick={navigate('/')}>{tr.nav.home}<Icon name="arrow" size={15} /></a></div>; }

export default App;
