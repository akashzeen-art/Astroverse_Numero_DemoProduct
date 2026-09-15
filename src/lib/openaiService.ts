import { OPENAI_CONFIG } from "./config";
import type { PalmAnalysisResult } from "./apiService";
import { LANGUAGE_NAMES, isLanguage } from "@/i18n";

export function isOpenAIConfigured(): boolean {
  return Boolean(OPENAI_CONFIG.API_KEY?.trim());
}

function resolveLanguageName(language = "en"): string {
  if (isLanguage(language)) return LANGUAGE_NAMES[language];
  return language;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

function parseJsonFromContent(content: string): Record<string, unknown> {
  let text = content.trim();
  if (text.startsWith("```")) {
    const start = text.indexOf("\n");
    const end = text.lastIndexOf("```");
    if (start >= 0 && end > start) {
      text = text.slice(start + 1, end).trim();
    }
  }
  if (text.includes("```json")) {
    text = text.slice(text.indexOf("```json") + 7);
    text = text.slice(0, text.lastIndexOf("```")).trim();
  }
  return JSON.parse(text) as Record<string, unknown>;
}

async function chatCompletion(
  messages: Array<{ role: string; content: string | Array<Record<string, unknown>> }>,
  maxTokens = 4000,
): Promise<string> {
  if (!isOpenAIConfigured()) {
    throw new Error("OpenAI API key is not configured. Add VITE_OPENAI_API_KEY to .env");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_CONFIG.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_CONFIG.MODEL,
      max_tokens: maxTokens,
      messages,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errMsg =
      (data as { error?: { message?: string } })?.error?.message ||
      `OpenAI API error ${response.status}`;
    throw new Error(errMsg);
  }

  const content = (data as { choices?: Array<{ message?: { content?: string } }> })
    ?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return content;
}

const PALM_PROMPT = `Analyze this palm image and provide a detailed palm reading.
Return ONLY raw valid JSON — no markdown, no code blocks, no explanation.
Use EXACTLY this JSON structure with all fields filled with real analysis:
{
  "overallScore": 85,
  "summary": "2-3 sentence summary based on the actual palm.",
  "lines": {
    "lifeLine": {"quality": "Strong", "score": 88, "meaning": "Short meaning", "details": "Detailed interpretation"},
    "headLine": {"quality": "Clear", "score": 82, "meaning": "Short meaning", "details": "Detailed interpretation"},
    "heartLine": {"quality": "Curved", "score": 79, "meaning": "Short meaning", "details": "Detailed interpretation"},
    "fateLine": {"quality": "Present", "score": 74, "meaning": "Short meaning", "details": "Detailed interpretation"}
  },
  "personality": {
    "dominantHand": "Right",
    "palmShape": "Square",
    "fingerLength": "Balanced",
    "handType": "Earth",
    "handTypeAnalysis": "2-3 sentences about this hand type.",
    "traits": [
      {"name": "Leadership", "score": 90, "description": "Natural ability to guide others."},
      {"name": "Creativity", "score": 85, "description": "Strong artistic tendencies."},
      {"name": "Intuition", "score": 80, "description": "Excellent gut feelings."},
      {"name": "Determination", "score": 92, "description": "Persistent and goal-oriented."}
    ]
  },
  "predictions": [
    {"area": "Career", "timeframe": "Next 6 months", "prediction": "Career prediction.", "confidence": 85, "advice": "Actionable advice."},
    {"area": "Relationships", "timeframe": "Next 3 months", "prediction": "Relationship prediction.", "confidence": 78, "advice": "Actionable advice."},
    {"area": "Health", "timeframe": "Ongoing", "prediction": "Health prediction.", "confidence": 90, "advice": "Actionable advice."},
    {"area": "Finances", "timeframe": "Next year", "prediction": "Finance prediction.", "confidence": 75, "advice": "Actionable advice."}
  ],
  "specialMarks": [
    {"name": "Mark name", "location": "Location on palm", "meaning": "What it means.", "significance": "High"}
  ],
  "compatibility": [
    {"type": "Earth Hands", "match": 92, "description": "Description."},
    {"type": "Fire Hands", "match": 85, "description": "Description."},
    {"type": "Air Hands", "match": 80, "description": "Description."}
  ],
  "accuracy": {"lineDetection": 0.95, "patternAnalysis": 0.92, "interpretation": 0.90, "overall": 0.92}
}
Replace ALL placeholder values with REAL analysis from the actual palm image.`;

function normalizePalmResult(raw: Record<string, unknown>): PalmAnalysisResult {
  const accuracy = (raw.accuracy as PalmAnalysisResult["accuracy"]) || {
    lineDetection: 0.92,
    patternAnalysis: 0.9,
    interpretation: 0.88,
    overall: 0.9,
  };

  return {
    ...(raw as unknown as PalmAnalysisResult),
    overallScore: Number(raw.overallScore) || 85,
    summary: String(raw.summary || ""),
    modelVersion: OPENAI_CONFIG.MODEL,
    accuracy,
  };
}

export async function analyzePalmWithOpenAI(
  file: File,
  language = "en",
): Promise<PalmAnalysisResult> {
  const dataUrl = await fileToDataUrl(file);
  const langName = resolveLanguageName(language);
  const content = await chatCompletion(
    [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${PALM_PROMPT}\n\nIMPORTANT: Write ALL text content (summary, meanings, details, predictions, advice, descriptions) in ${langName} (${language}).`,
          },
          { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
        ],
      },
    ],
    4000,
  );

  const parsed = parseJsonFromContent(content);
  return normalizePalmResult(parsed);
}

function reduceToSingleDigit(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return n;
}

function pythagoreanValue(c: string): number {
  const code = c.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return (code % 9) + 1;
}

export function computeNumerologyNumbers(fullName: string, birthDate: string) {
  const digits = birthDate.replace(/\D/g, "");
  const lifePathNumber = reduceToSingleDigit(
    digits.split("").reduce((s, d) => s + parseInt(d, 10), 0),
  );
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, "");
  const destinyNumber = reduceToSingleDigit(
    letters.split("").reduce((s, c) => s + pythagoreanValue(c), 0),
  );
  const soulNumber = reduceToSingleDigit(
    letters
      .split("")
      .filter((c) => "AEIOU".includes(c))
      .reduce((s, c) => s + pythagoreanValue(c), 0) || lifePathNumber,
  );
  const personalityNumber = reduceToSingleDigit(
    letters
      .split("")
      .filter((c) => !"AEIOU".includes(c))
      .reduce((s, c) => s + pythagoreanValue(c), 0) || destinyNumber,
  );

  return {
    lifePathNumber,
    destinyNumber,
    soulNumber,
    personalityNumber,
    luckyNumbers: [
      lifePathNumber,
      destinyNumber,
      (lifePathNumber + destinyNumber) % 9 || 9,
    ],
  };
}

export async function generateNumerologyWithOpenAI(
  fullName: string,
  birthDate: string,
): Promise<Record<string, unknown>> {
  const computed = computeNumerologyNumbers(fullName, birthDate);
  const prompt = `Provide a detailed numerology reading for:
Name: ${fullName}, Birth Date: ${birthDate}
Life Path: ${computed.lifePathNumber}, Destiny: ${computed.destinyNumber}, Soul: ${computed.soulNumber}, Personality: ${computed.personalityNumber}
Return ONLY valid JSON with keys:
title (archetype name e.g. "The Seeker"),
interpretation (2-3 sentence core reading),
personality (personality overview text),
traits (array of 4 trait words),
strengths (array of 4 strengths),
challenges (array of 3 challenges),
compatibility (array of 3-5 compatible zodiac signs),
yearPrediction (career/life path for this year),
monthPrediction (love/relationships this month),
career_path (ideal careers),
love_insights (relationship guidance),
lucky_color, element (Fire/Water/Earth/Air).`;

  const content = await chatCompletion([{ role: "user", content: prompt }], 2000);
  const ai = parseJsonFromContent(content);
  return { ...computed, ...ai, fullName, birthDate };
}

export async function generateAstrologyWithOpenAI(
  birthData: {
    name?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    gender?: string;
    questions?: string;
  },
  language = "en",
  focusAreas: string[] = [],
): Promise<Record<string, unknown>> {
  const prompt = `Generate a detailed astrology reading for:
Name: ${birthData.name || "Seeker"}
Gender: ${birthData.gender || "Unknown"}
Birth Date: ${birthData.birthDate || "Unknown"}
Birth Time: ${birthData.birthTime || "Unknown"}
Birth Place: ${birthData.birthPlace || "Unknown"}
Focus Areas: ${focusAreas.join(", ") || "General"}
Questions: ${birthData.questions || "None"}
Language: Write ALL text content in ${resolveLanguageName(language)} (${language}). Sign names may stay in English.

Return ONLY raw valid JSON (no markdown, no code blocks) using EXACTLY these snake_case keys:
{
  "sun_sign": "Leo",
  "moon_sign": "Scorpio",
  "rising_sign": "Gemini",
  "overview": {
    "summary": "2-3 sentence overall reading summary.",
    "key_themes": ["theme1", "theme2", "theme3"],
    "confidence": 0.88
  },
  "planetary_positions": [
    {"planet": "Sun", "sign": "Leo", "house": "1st House", "aspect": "Core identity and life force"},
    {"planet": "Moon", "sign": "Scorpio", "house": "4th House", "aspect": "Emotional world and instincts"},
    {"planet": "Mercury", "sign": "Virgo", "house": "2nd House", "aspect": "Communication and intellect"},
    {"planet": "Venus", "sign": "Libra", "house": "3rd House", "aspect": "Love and beauty"}
  ],
  "personality": {
    "summary": "Overall personality description.",
    "traits": ["Detail-oriented", "Nurturing", "Diplomatic", "Intuitive", "Adaptable"],
    "confidence": 0.87
  },
  "strengths": {
    "items": ["Natural leadership", "Strong intuition", "Empathy", "Creativity"],
    "summary": "These are your core strengths.",
    "confidence": 0.90
  },
  "challenges": {
    "items": ["Overthinking", "Perfectionism", "Emotional sensitivity"],
    "summary": "These are areas for growth.",
    "confidence": 0.82
  },
  "life_predictions": [
    {"area": "Career", "timeframe": "Next 12 months", "prediction": "Career prediction here.", "confidence": 0.85},
    {"area": "Love", "timeframe": "Next 6 months", "prediction": "Love prediction here.", "confidence": 0.80},
    {"area": "Health", "timeframe": "Ongoing", "prediction": "Health prediction here.", "confidence": 0.88},
    {"area": "Finance", "timeframe": "Next year", "prediction": "Finance prediction here.", "confidence": 0.78}
  ],
  "compatibility": [
    {"sign": "Taurus", "match": 0.88, "type": "High Compatibility"},
    {"sign": "Cancer", "match": 0.82, "type": "Strong Match"},
    {"sign": "Pisces", "match": 0.79, "type": "Harmonious"}
  ],
  "lucky_numbers": [3, 7, 12, 21, 33],
  "model_version": "${OPENAI_CONFIG.MODEL}"
}
Replace ALL placeholder values with REAL analysis based on the actual birth data provided.`;

  const content = await chatCompletion([{ role: "user", content: prompt }], 4000);
  return parseJsonFromContent(content);
}
