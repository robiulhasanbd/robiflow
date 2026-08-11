export const COMPANY_META = {
  'JK Lifestyle Ltd': { color: '#06b6d4', short: 'Lifestyle' },
  'Health Revolution Ltd': { color: '#8b5cf6', short: 'Health Rev' },
  'Ultimate Organic Life Ltd': { color: '#10b981', short: 'Organic' },
  'JK Tech Ltd': { color: '#f59e0b', short: 'JK Tech' },
  'JK Food Arena Ltd': { color: '#ef4444', short: 'Food Arena' },
  'JK Fitness Arena Ltd': { color: '#ec4899', short: 'Fitness' },
};

const MODULE_NAMES = ['CRM', 'Sales', 'Accounting', 'Inventory', 'HR', 'Purchase', 'Manufacturing', 'Project'];

export function getCompanyStats(companies, requirements, companyName) {
  const modules = companies[companyName] || [];
  let done = 0;
  let pending = 0;
  modules.forEach(mod => {
    mod.children.forEach(child => {
      if (child.status === 'done') done += 1;
      else pending += 1;
    });
  });
  const companyReqs = requirements.filter(r => r.company === companyName);
  return { done, pending, total: done + pending, requirements: companyReqs };
}

export function getAllCompanySummaries(companies, requirements) {
  return Object.keys(companies).map(name => {
    const stats = getCompanyStats(companies, requirements, name);
    const meta = COMPANY_META[name] || { color: '#6366f1', short: name };
    return { name, ...stats, color: meta.color, short: meta.short };
  });
}

export function getOverallProgress(companies) {
  let done = 0;
  let total = 0;
  Object.values(companies).forEach(modules => {
    modules.forEach(mod => {
      mod.children.forEach(child => {
        total += 1;
        if (child.status === 'done') done += 1;
      });
    });
  });
  return total ? Math.round((done / total) * 100) : 0;
}

export function getCompanyDNA(companies, requirements, companyName) {
  const modules = companies[companyName] || [];
  const counts = {};
  MODULE_NAMES.forEach(m => { counts[m] = 0; });

  modules.forEach(mod => {
    const key = mod.name;
    if (counts[key] !== undefined) {
      counts[key] += mod.children.length;
    }
  });

  requirements
    .filter(r => r.company === companyName)
    .forEach(r => {
      if (counts[r.module] !== undefined) counts[r.module] += 2;
    });

  const max = Math.max(...Object.values(counts), 1);
  return MODULE_NAMES.map(m => Math.round((counts[m] / max) * 100));
}

export function getTeamWorkload(requirements, team) {
  return team
    .filter(m => m.role?.includes('Developer') || m.role === 'Developer')
    .map(dev => {
      const assigned = requirements.filter(r => r.assignee === dev.name && r.status !== 'Deployed');
      const load = Math.min(100, assigned.length * 20 + assigned.reduce((s, r) => s + (100 - r.progress) / 10, 0));
      return { ...dev, load: Math.round(load), activeCount: assigned.length };
    });
}

export function getMorningBriefing(requirements) {
  const stuck = requirements.filter(r => r.status === 'Testing' && r.progress < 90);
  const low = requirements.filter(r => r.progress < 30 && r.status === 'Development');
  const uat = requirements.filter(r => r.status === 'UAT');
  const lines = [];

  if (stuck.length) {
    lines.push(`${stuck.length} item(s) stuck in Testing (${stuck.map(r => r.title).slice(0, 2).join(', ')})`);
  }
  if (low.length) {
    lines.push(`${low.length} early-stage dev item(s) under 30%`);
  }
  if (uat.length) {
    lines.push(`${uat.length} waiting for UAT approval`);
  }
  if (!lines.length) {
    lines.push('All clear — no blockers detected. Great work, team! 🎉');
  }
  return lines;
}

export function findSimilarRequirements(requirements, { title, company, module: mod }) {
  return requirements.filter(r =>
    r.company !== company &&
    r.status === 'Deployed' &&
    (r.module === mod || r.title.toLowerCase().includes(title.toLowerCase().split(' ')[0]))
  ).slice(0, 2);
}
