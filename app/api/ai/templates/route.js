// GET /api/ai/templates — List all AI prompt templates

const TEMPLATES = [
  {
    id: 'tpl_001',
    title: 'SEO Blog Post',
    description: 'Generate an SEO-optimized blog post targeting a specific keyword and audience.',
    category: 'content',
    prompt: 'Write a 1200-word SEO blog post about {{topic}} targeting the keyword "{{keyword}}". Include H2 and H3 headings, a meta description, and a call to action. Target audience: {{audience}}.',
  },
  {
    id: 'tpl_002',
    title: 'Google Ads Copy',
    description: 'Create high-converting Google Ads headlines and descriptions.',
    category: 'advertising',
    prompt: 'Write 5 Google Ads variations for {{business}} in the {{industry}} industry. Each should have 3 headlines (30 char max each) and 2 descriptions (90 char max each). Focus on {{unique_selling_point}}.',
  },
  {
    id: 'tpl_003',
    title: 'Email Welcome Sequence',
    description: 'Draft a 5-email welcome sequence for new subscribers.',
    category: 'email',
    prompt: 'Create a 5-email welcome sequence for {{business}}. Email 1: Welcome & brand story. Email 2: Value proposition. Email 3: Social proof. Email 4: Exclusive offer. Email 5: Community invitation. Tone: {{tone}}.',
  },
  {
    id: 'tpl_004',
    title: 'Social Media Calendar',
    description: 'Plan a week of social media content across multiple platforms.',
    category: 'social',
    prompt: 'Create a 7-day social media content calendar for {{business}} in the {{industry}} niche. Include posts for Instagram, LinkedIn, and Facebook. Mix educational, entertaining, and promotional content. Brand voice: {{voice}}.',
  },
  {
    id: 'tpl_005',
    title: 'Client Proposal',
    description: 'Generate a professional client proposal for marketing services.',
    category: 'business',
    prompt: 'Draft a marketing services proposal for {{client_name}} at {{company}}. Services: {{services}}. Include: executive summary, scope of work, timeline, deliverables, pricing, and terms. Budget range: {{budget}}.',
  },
  {
    id: 'tpl_006',
    title: 'Competitor Analysis',
    description: 'Analyze competitors and identify strategic opportunities.',
    category: 'strategy',
    prompt: 'Perform a competitive analysis for {{business}} against these competitors: {{competitors}}. Analyze their SEO presence, social media, content strategy, and unique positioning. Identify gaps and opportunities.',
  },
  {
    id: 'tpl_007',
    title: 'Landing Page Copy',
    description: 'Write conversion-focused landing page copy with clear CTA.',
    category: 'content',
    prompt: 'Write landing page copy for {{product_service}} by {{business}}. Include: hero headline, subheadline, 3 benefit sections, social proof section, FAQ, and strong CTA. Target: {{audience}}. Goal: {{conversion_goal}}.',
  },
  {
    id: 'tpl_008',
    title: 'GBP Description Optimizer',
    description: 'Optimize a Google Business Profile description for local SEO.',
    category: 'local-seo',
    prompt: 'Write an optimized Google Business Profile description for {{business}} located in {{location}}. Services: {{services}}. Include local keywords naturally. Stay under 750 characters. Highlight: {{differentiators}}.',
  },
  {
    id: 'tpl_009',
    title: 'Review Response Templates',
    description: 'Generate professional responses to customer reviews.',
    category: 'reputation',
    prompt: 'Write 3 response templates each for: 5-star reviews, 3-star reviews, and 1-star reviews for {{business}} ({{industry}}). Tone: professional, empathetic, and solution-oriented. Include the reviewer name placeholder {{name}}.',
  },
  {
    id: 'tpl_010',
    title: 'Video Script',
    description: 'Create a short-form video script for social media.',
    category: 'video',
    prompt: 'Write a 60-second video script for {{platform}} about {{topic}} for {{business}}. Include: hook (first 3 seconds), problem, solution, proof, and CTA. Style: {{style}}. Keep it conversational and engaging.',
  },
  {
    id: 'tpl_011',
    title: 'Case Study',
    description: 'Write a compelling client case study with measurable results.',
    category: 'content',
    prompt: 'Write a case study for {{client_name}} ({{industry}}). Challenge: {{challenge}}. Solution: {{solution}}. Results: {{results}}. Include quotes, metrics, and a compelling narrative arc.',
  },
  {
    id: 'tpl_012',
    title: 'AI Overview Content',
    description: 'Create content optimized for AI Overview citations in search.',
    category: 'ai-seo',
    prompt: 'Write an AIO-optimized article about {{topic}} for {{business}} in {{location}}. Structure with clear Q&A sections, concise definitions, data points, and authoritative claims. Target featured snippet and AI Overview citation for "{{query}}".',
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let templates = TEMPLATES;
  if (category) {
    templates = templates.filter((t) => t.category === category);
  }

  const categories = [...new Set(TEMPLATES.map((t) => t.category))];

  return Response.json({
    success: true,
    data: templates,
    meta: { total: templates.length, categories },
  });
}
