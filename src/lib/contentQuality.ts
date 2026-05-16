import type { ContentLocale } from '@/lib/admin/types';

const SECTION_LABELS = {
  tldr: ['tl;dr', 'tldr', 'short answer', 'кратко', 'короткий ответ'],
  faq: ['faq', 'frequently asked questions', 'вопросы и ответы', 'частые вопросы'],
  takeaways: ['key takeaways', 'key insights', 'главные выводы', 'ключевые выводы', 'итоги'],
  sources: ['sources', 'references', 'источники', 'ссылки'],
};

const WEAK_CLAIM_PATTERNS = [
  /guaranteed\s+results?/i,
  /100%\s*(success|guarantee)/i,
  /the\s+best\s+in\s+the\s+world/i,
  /instant\s+results?/i,
  /без\s+рисков/i,
  /гарантированн(ый|ые|о)\s+результат/i,
  /лучш(ий|ая|ее)\s+в\s+мире/i,
];

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function hasRequiredSection(content: string, section: keyof typeof SECTION_LABELS): boolean {
  const headings = SECTION_LABELS[section];
  return headings.some((heading) => {
    const regex = new RegExp(`^#{2,4}\\s*${escapeRegex(heading)}\\s*$`, 'gim');
    return regex.test(content);
  });
}

export function countContentWords(content: string): number {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return 0;
  return plain.split(' ').length;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function extractFaqItems(content: string): FaqItem[] {
  const items: FaqItem[] = [];
  const qaBlockRegex = /\*\*Q:\*\*\s*(.+?)\n+\*\*A:\*\*\s*([\s\S]*?)(?=\n\*\*Q:\*\*|\n## |\n# |$)/gim;
  let qaMatch: RegExpExecArray | null = qaBlockRegex.exec(content);

  while (qaMatch) {
    const question = qaMatch[1]?.trim();
    const answer = qaMatch[2]?.trim();
    if (question && answer) {
      items.push({ question, answer });
    }
    qaMatch = qaBlockRegex.exec(content);
  }

  if (items.length > 0) {
    return items.slice(0, 8);
  }

  const headingLines = content.split('\n');
  for (let index = 0; index < headingLines.length; index += 1) {
    const line = normalizeHeading(headingLines[index]);
    const isQuestionHeading = line.startsWith('### q:') || line.startsWith('### question:');
    if (!isQuestionHeading) continue;

    const question = headingLines[index].replace(/^###\s*(q:|question:)\s*/i, '').trim();
    let answer = '';
    for (let cursor = index + 1; cursor < headingLines.length; cursor += 1) {
      if (/^#{2,4}\s+/.test(headingLines[cursor])) break;
      answer += `${headingLines[cursor]}\n`;
    }
    if (question && answer.trim()) {
      items.push({ question, answer: answer.trim() });
    }
  }

  return items.slice(0, 8);
}

export function extractSectionBullets(content: string, section: keyof typeof SECTION_LABELS): string[] {
  const labels = SECTION_LABELS[section];
  const lines = content.split('\n');
  let start = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const normalized = normalizeHeading(lines[index].replace(/^#{2,4}\s*/, ''));
    if (labels.includes(normalized)) {
      start = index + 1;
      break;
    }
  }

  if (start === -1) return [];

  const bullets: string[] = [];
  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (/^#{2,4}\s+/.test(line)) break;
    if (/^[-*]\s+/.test(line)) {
      bullets.push(line.replace(/^[-*]\s+/, '').trim());
    }
  }

  return bullets.slice(0, 10);
}

export function extractSources(content: string): string[] {
  const sourceBullets = extractSectionBullets(content, 'sources');
  if (sourceBullets.length > 0) return sourceBullets;

  const links = Array.from(content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gim));
  return links.map((item) => `${item[1]} - ${item[2]}`).slice(0, 8);
}

export function validateEditorialQuality(content: string, locale: ContentLocale): string[] {
  const errors: string[] = [];
  const wordCount = countContentWords(content);

  if (wordCount < 350) {
    errors.push(`Content is too short: ${wordCount} words (minimum 350).`);
  }

  if (!hasRequiredSection(content, 'tldr')) {
    errors.push(locale === 'ru' ? 'Отсутствует обязательный раздел TL;DR/Кратко.' : 'Missing required TL;DR section.');
  }
  if (!hasRequiredSection(content, 'faq')) {
    errors.push(locale === 'ru' ? 'Отсутствует обязательный раздел FAQ.' : 'Missing required FAQ section.');
  }
  if (!hasRequiredSection(content, 'takeaways')) {
    errors.push(locale === 'ru' ? 'Отсутствует обязательный раздел Key Takeaways/Выводы.' : 'Missing required Key Takeaways section.');
  }
  if (!hasRequiredSection(content, 'sources')) {
    errors.push(locale === 'ru' ? 'Отсутствует обязательный раздел Sources/Источники.' : 'Missing required Sources section.');
  }

  for (const pattern of WEAK_CLAIM_PATTERNS) {
    if (pattern.test(content)) {
      errors.push(locale === 'ru'
        ? 'Найдены слабые/непроверяемые формулировки. Уберите гарантии и абсолютные заявления.'
        : 'Detected weak or unverifiable claims. Remove guarantees and absolute statements.');
      break;
    }
  }

  return errors;
}
