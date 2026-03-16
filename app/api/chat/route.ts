import { anthropic } from '@ai-sdk/anthropic';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { after } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

// Load system prompt once per cold start
const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), 'content/prompts/abel_chatbot_system_prompt.txt'),
  'utf-8'
);

// In-memory rate limiting (soft — resets on cold start)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_MESSAGES = 20;

const ALLOWED_ORIGINS = ['https://abelmak.com', 'http://localhost:3000'];

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Clean stale entries
  for (const [key, entry] of rateLimit) {
    if (entry.resetAt < now) rateLimit.delete(key);
  }

  const entry = rateLimit.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

function validateMessages(messages: unknown): messages is UIMessage[] {
  if (!Array.isArray(messages)) return false;
  if (messages.length === 0 || messages.length > MAX_MESSAGES) return false;

  return messages.every(
    (msg) =>
      typeof msg === 'object' &&
      msg !== null &&
      (msg.role === 'user' || msg.role === 'assistant') &&
      Array.isArray(msg.parts)
  );
}

export async function POST(request: NextRequest) {
  // 1. Origin check
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  const isAllowedOrigin = ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || referer.startsWith(allowed)
  );

  if (!isAllowedOrigin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Rate limit
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '3600',
      },
    });
  }

  // 3. Validate request body
  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!validateMessages(body.messages)) {
    return new Response(
      JSON.stringify({ error: 'Invalid messages format or limit exceeded' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. Extract latest user question for logging
  const lastUserMsg = [...body.messages].reverse().find((m) => m.role === 'user');
  const question = lastUserMsg?.parts
    ?.filter((p: { type: string }) => p.type === 'text')
    .map((p: { type: string; text?: string }) => p.text)
    .join('') || '';
  const startTime = Date.now();

  // 6. Stream response via Vercel AI SDK
  try {
    const result = streamText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: systemPrompt,
      messages: await convertToModelMessages(body.messages),
      maxOutputTokens: 300,
    });

    after(async () => {
      try {
        const responseText = await result.text;
        const usage = await result.usage;
        console.log(JSON.stringify({
          event: 'chat',
          question: question.slice(0, 200),
          responseLength: responseText.length,
          tokens: usage,
          latencyMs: Date.now() - startTime,
          messageCount: (body.messages as UIMessage[]).length,
          ip: ip.slice(0, 8) + '***',
          ts: new Date().toISOString(),
        }));
      } catch {
        // stream may have been aborted by client
      }
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
