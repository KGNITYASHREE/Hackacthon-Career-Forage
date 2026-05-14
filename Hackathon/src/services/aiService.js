import { DIMENSIONS } from '../data/questions';

// ============================================================
//  🔑  PASTE YOUR GROQ API KEY HERE (only place you need to)
//  Get a free key at: https://console.groq.com/keys
// ============================================================
const GROQ_API_KEY = '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';
// ============================================================

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // ← matches your Groq account model

// ------------- Scoring helpers -------------

const SCORE_MAP = {
  '0': 0, '1–10': 40, '11–30': 75, '30+': 100,
  'Never': 0, 'Tried once or twice': 35, 'A few sessions': 70, 'Regularly practicing': 100,
  "No, it's generic": 10, 'Slightly tailored': 40, 'Tailored for this role': 80, 'Multiple versions ready': 100,
  'No practice': 0, 'Once or twice': 35, 'Several times': 70, 'Regular practice': 100,
  'I freeze up': 0, 'I get flustered but manage': 35, 'I pause, think, and answer': 75, 'I stay calm and structured': 100,
  '1–2': 40, '3–5': 80, '5+': 100,
};

const DIMENSION_WEIGHTS = { technical: 35, resume: 20, communication: 25, portfolio: 20 };

function computeRawScores(answers, questions) {
  const buckets = { technical: [], resume: [], communication: [], portfolio: [] };
  questions.forEach((q) => {
    const answer = answers[q.id];
    if (answer === undefined) return;
    let score;
    if (q.type === 'scale') {
      score = (Number(answer) / 4) * 100;
    } else {
      score = SCORE_MAP[answer] ?? 50;
    }
    buckets[q.dimension].push(score);
  });
  const dims = {};
  Object.entries(buckets).forEach(([dim, scores]) => {
    dims[dim] = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 50;
  });
  return dims;
}

function computeOverall(dimScores) {
  return Math.round(
    Object.entries(DIMENSION_WEIGHTS).reduce(
      (sum, [dim, weight]) => sum + (dimScores[dim] ?? 50) * (weight / 100),
      0
    )
  );
}

function getReadinessLevel(score) {
  if (score >= 80) return { label: 'Interview Ready 🚀', color: '#10b981' };
  if (score >= 60) return { label: 'Almost There 💪', color: '#3b82f6' };
  if (score >= 40) return { label: 'Building Up 📈', color: '#f59e0b' };
  return { label: 'Just Starting 🌱', color: '#ef4444' };
}

// ------------- Prompt builder -------------

function buildPrompt(answers, questions, role, dimScores, overallScore, resumeText) {
  const qaLines = questions
    .map((q) => {
      const ans = answers[q.id];
      const ansStr =
        q.type === 'scale' ? `${ans}/4 (${Math.round((ans / 4) * 100)}%)` : ans;
      return `[${DIMENSIONS[q.dimension].label}] Q: ${q.question}\nA: ${ansStr}`;
    })
    .join('\n\n');

  const dimSummary = Object.entries(dimScores)
    .map(([d, s]) => `${DIMENSIONS[d].label}: ${s}/100`)
    .join(', ');

  const resumeSection = resumeText
    ? `\n\nCANDIDATE RESUME (use this to personalise feedback):\n${resumeText.slice(0, 3000)}`
    : '';

  return `You are an expert career coach evaluating a ${role.replace(/_/g, ' ')} candidate's interview readiness.

OVERALL SCORE: ${overallScore}/100
DIMENSION SCORES: ${dimSummary}
${resumeSection}

CANDIDATE Q&A:
${qaLines}

Respond ONLY with a valid JSON object (no markdown, no explanation, just raw JSON) in this exact structure:
{
  "summary": "2-3 sentence personalised summary of their readiness",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "actionPlan": [
    {
      "title": "Action item title",
      "description": "Specific, concrete, actionable step",
      "priority": "High",
      "timeEstimate": "1 week",
      "dimension": "technical"
    }
  ]
}

Rules:
- Provide exactly 5-6 action items ordered High → Medium → Low priority.
- dimension must be one of: technical, resume, communication, portfolio.
- Be specific and reference tools/skills relevant to a ${role.replace(/_/g, ' ')} role.
- If resume was provided, reference actual content from it in the summary and action plan.`;
}

// ------------- Fallback (offline) -------------

function getFallbackResult(dimScores, overallScore, role) {
  const weakest = Object.entries(dimScores).sort((a, b) => a[1] - b[1])[0][0];
  const roleLabel = role.replace(/_/g, ' ');

  const allActions = {
    technical: [
      { title: 'Solve 2 LeetCode problems daily', description: `Focus on medium-difficulty problems in arrays, strings, and trees — the most common in ${roleLabel} interviews.`, priority: 'High', timeEstimate: '2 weeks', dimension: 'technical' },
      { title: 'Complete a system design session', description: 'Design a real-world system (URL shortener, chat app) using resources like "Grokking the System Design Interview".', priority: 'High', timeEstimate: '1 week', dimension: 'technical' },
    ],
    resume: [
      { title: 'Tailor your resume for each application', description: 'Mirror keywords from the job description. Use the XYZ format: "Accomplished X by doing Y, resulting in Z."', priority: 'High', timeEstimate: '2-3 days', dimension: 'resume' },
      { title: 'Add quantified achievements', description: 'Replace vague descriptions with numbers: "Improved load time by 40%", "Built API serving 10k req/day".', priority: 'Medium', timeEstimate: '1 day', dimension: 'resume' },
    ],
    communication: [
      { title: 'Prepare 5 STAR stories', description: 'Write and rehearse answers for: "Tell me about yourself", "Biggest challenge", "Disagreement with a teammate", "Failure", "Leadership".', priority: 'High', timeEstimate: '3 days', dimension: 'communication' },
      { title: 'Schedule a mock interview', description: 'Use Pramp or Interviewing.io. Record yourself to spot filler words and unclear explanations.', priority: 'Medium', timeEstimate: '1 week', dimension: 'communication' },
    ],
    portfolio: [
      { title: 'Deploy one end-to-end project', description: `Build and deploy a ${roleLabel}-relevant project to Vercel/Heroku with a live URL and clear README.`, priority: 'High', timeEstimate: '2 weeks', dimension: 'portfolio' },
      { title: 'Update LinkedIn & GitHub', description: 'Add a professional summary, pin your best 3 repos, and ensure your headline and profile photo are current.', priority: 'Medium', timeEstimate: '2 hours', dimension: 'portfolio' },
    ],
  };

  const plan = [];
  [weakest, ...Object.keys(allActions).filter((d) => d !== weakest)].forEach((dim) => {
    (allActions[dim] || []).forEach((a) => plan.push(a));
  });

  const sortedDims = Object.entries(dimScores).sort((a, b) => b[1] - a[1]);
  const strengths = [];
  sortedDims.slice(0, 2).forEach(([d, s]) => {
    if (s >= 60) strengths.push(`Strong ${DIMENSIONS[d].label} foundation (${s}/100)`);
  });
  if (!strengths.length) strengths.push('Proactive attitude toward self-assessment');
  strengths.push('Self-awareness is the first step to improvement');

  return {
    summary:
      overallScore >= 70
        ? `You are in a strong position for ${roleLabel} interviews! Focus on the action items below to push past 80+.`
        : `You have a solid foundation as a ${roleLabel} candidate, with the most room to grow in ${DIMENSIONS[weakest].label}. Following the action plan consistently for 2-4 weeks will significantly boost your readiness.`,
    strengths,
    actionPlan: plan.slice(0, 6),
  };
}

// ------------- Main export -------------

export async function scoreCandidate({ answers, questions, role, resumeText }) {
  // 1. Compute scores locally (instant)
  const dimScores = computeRawScores(answers, questions);
  const overallScore = computeOverall(dimScores);
  const level = getReadinessLevel(overallScore);

  // 2. Peer benchmark via localStorage
  const history = JSON.parse(localStorage.getItem('irq_scores') || '[]');
  history.push(overallScore);
  if (history.length > 200) history.shift();
  localStorage.setItem('irq_scores', JSON.stringify(history));
  const higherThan = Math.round(
    (history.filter((s) => s < overallScore).length / history.length) * 100
  );

  // 3. Call Groq LLM for personalised AI suggestions
  if (GROQ_API_KEY && GROQ_API_KEY !== 'YOUR_GROQ_API_KEY_HERE') {
    console.log('%c🤖 InterviewIQ: Calling Groq API...', 'color: #60a5fa; font-weight: bold;');
    console.log('📊 Scores being sent:', { overallScore, dimScores, role, resumeIncluded: !!resumeText });
    try {
      const prompt = buildPrompt(answers, questions, role, dimScores, overallScore, resumeText);
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert career coach. Always respond with valid JSON only — no markdown fences, no extra text.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: false,
          stop: null,
        }),
      });

      console.log('%c✅ Groq API responded with status:', 'color: #10b981; font-weight: bold;', res.status);
      const data = await res.json();

      if (!res.ok) {
        console.error('❌ Groq API error:', data);
        throw new Error(data?.error?.message || 'Groq API error');
      }

      const text = data?.choices?.[0]?.message?.content || '';
      console.log('📝 Raw Groq response:', text.slice(0, 300) + '...');

      // Strip possible markdown fences before parsing
      const jsonStr = text.replace(/```json|```/g, '').match(/\{[\s\S]*\}/)?.[0];
      if (jsonStr) {
        const parsed = JSON.parse(jsonStr);
        console.log('%c🎯 AI action plan generated successfully!', 'color: #10b981; font-weight: bold;', parsed);
        return { dimScores, overallScore, level, higherThan, ...parsed };
      } else {
        console.warn('⚠️ Could not parse JSON from Groq response. Raw text:', text);
      }
    } catch (err) {
      console.error('%c❌ Groq call failed — using offline fallback:', 'color: #ef4444; font-weight: bold;', err.message);
    }
  } else {
    console.warn('⚠️ No Groq API key set — using offline fallback scoring.');
  }

  // 4. Offline fallback if no key or API error
  const fallback = getFallbackResult(dimScores, overallScore, role);
  return { dimScores, overallScore, level, higherThan, ...fallback };
}
