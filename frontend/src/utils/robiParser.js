const COMPANY_ALIASES = [
  { keys: ['jk tech', 'jktech', 'tech ltd'], name: 'JK Tech Ltd' },
  { keys: ['jk lifestyle', 'lifestyle'], name: 'JK Lifestyle Ltd' },
  { keys: ['health revolution', 'health'], name: 'Health Revolution Ltd' },
  { keys: ['organic life', 'ultimate organic', 'organic'], name: 'Ultimate Organic Life Ltd' },
  { keys: ['food arena', 'food'], name: 'JK Food Arena Ltd' },
  { keys: ['fitness arena', 'fitness'], name: 'JK Fitness Arena Ltd' },
];

const MODULE_ALIASES = [
  { keys: ['crm', 'lead', 'customer'], name: 'CRM' },
  { keys: ['sales', 'quotation', 'order'], name: 'Sales' },
  { keys: ['accounting', 'invoice', 'vat', 'tax', 'finance', 'payment'], name: 'Accounting' },
  { keys: ['inventory', 'warehouse', 'barcode', 'stock'], name: 'Inventory' },
  { keys: ['hr', 'leave', 'payroll', 'employee'], name: 'HR' },
  { keys: ['purchase', 'vendor', 'rfq'], name: 'Purchase' },
  { keys: ['manufacturing', 'bom', 'production'], name: 'Manufacturing' },
  { keys: ['project', 'task', 'timesheet'], name: 'Project' },
];

const SUBMODULE_HINTS = {
  Accounting: ['Invoicing', 'Payments', 'Tax Management'],
  HR: ['Employees', 'Leave', 'Payroll'],
  Inventory: ['Products', 'Warehouse', 'Barcode'],
  CRM: ['Leads', 'Opportunities', 'Activities'],
  Sales: ['Quotations', 'Orders', 'Products'],
};

function matchAlias(text, aliases) {
  const lower = text.toLowerCase();
  for (const entry of aliases) {
    if (entry.keys.some(k => lower.includes(k))) return entry.name;
  }
  return null;
}

function extractTitle(text, company, module) {
  let title = text
    .replace(/^(create|add|need|we need|please|make|build)\s+(a\s+)?(new\s+)?(requirement\s+for\s+)?/i, '')
    .replace(/for\s+.+/i, '')
    .trim();

  if (!title || title.length < 3) {
    const words = text.split(/\s+/).filter(w => w.length > 3 && !/requirement|customization|module/i.test(w));
    title = words.slice(0, 4).join(' ') || 'New Customization';
  }

  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (module && !title.toLowerCase().includes(module.toLowerCase().slice(0, 4))) {
    title = `${title} (${module})`;
  }
  return title.slice(0, 80);
}

function guessSubModule(text, moduleName) {
  const hints = SUBMODULE_HINTS[moduleName] || [];
  const lower = text.toLowerCase();
  for (const hint of hints) {
    if (lower.includes(hint.toLowerCase())) return hint;
  }
  if (/vat|tax/.test(lower)) return 'Tax Management';
  if (/leave/.test(lower)) return 'Leave';
  if (/payroll/.test(lower)) return 'Payroll';
  if (/barcode/.test(lower)) return 'Barcode';
  if (/invoice/.test(lower)) return 'Invoicing';
  return hints[0] || 'General';
}

export function parseRequirementFromText(text, defaultCompany = 'JK Tech Ltd') {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const company = matchAlias(trimmed, COMPANY_ALIASES) || defaultCompany;
  const module = matchAlias(trimmed, MODULE_ALIASES) || 'Accounting';
  const subModule = guessSubModule(trimmed, module);
  const title = extractTitle(trimmed, company, module);

  const priority = /critical|urgent|asap/.test(trimmed.toLowerCase())
    ? 'Critical'
    : /high priority|important/.test(trimmed.toLowerCase())
      ? 'High'
      : 'Medium';

  return { title, company, module, subModule, status: 'Development', progress: 0, priority };
}

export function isCreateIntent(text) {
  const lower = text.toLowerCase();
  return (
    /create|add|need|build|make|new requirement|customization for/.test(lower) &&
    !/status|progress|how many|show me/.test(lower)
  );
}

export function isStatusIntent(text) {
  return /status|progress|how many|overview|summary|briefing|stuck|pending/.test(text.toLowerCase());
}
