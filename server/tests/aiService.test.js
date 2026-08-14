// Lightweight, dependency-free test runner (no framework installed in this
// project). Run with: node tests/aiService.test.js
//
// Covers response validation, single-retry logic, and safe error
// propagation, using the actual exported functions from aiService.js and
// parseJSON.js — no network calls, no OpenAI usage consumed.

import assert from 'assert';
import { parseAIJSON } from '../utils/parseJSON.js';
import {
  isTransientError,
  isHardQuotaExhaustion,
  withSingleRetry,
  AIServiceError,
  validateQuestionsResponse,
} from '../services/aiService.js';

let passed = 0;
let failed = 0;

const test = async (name, fn) => {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`      ${err.message}`);
    failed++;
  }
};

const makeError = (overrides) => Object.assign(new Error(overrides.message || 'error'), overrides);

console.log('parseAIJSON');
await test('parses a clean JSON object', () => {
  const result = parseAIJSON('{"a": 1, "b": "two"}');
  assert.deepStrictEqual(result, { a: 1, b: 'two' });
});

await test('parses JSON wrapped in a markdown code fence', () => {
  const result = parseAIJSON('```json\n{"questions": [{"q": 1}]}\n```');
  assert.deepStrictEqual(result, { questions: [{ q: 1 }] });
});

await test('parses JSON with leading/trailing prose text', () => {
  const result = parseAIJSON('Sure, here is the JSON:\n{"ok": true}\nHope that helps!');
  assert.deepStrictEqual(result, { ok: true });
});

await test('throws a clean error on empty response', () => {
  assert.throws(() => parseAIJSON(''), /Empty AI response/);
  assert.throws(() => parseAIJSON(null), /Empty AI response/);
});

await test('throws a clean error on non-JSON garbage (malformed output)', () => {
  assert.throws(() => parseAIJSON('this is not json at all, sorry!'), /Failed to parse AI JSON response/);
});

await test('throws a clean error when braces exist but content between them is invalid', () => {
  // Regression check: previously this path could leak a raw JSON.parse
  // SyntaxError instead of the intended unified error message.
  assert.throws(() => parseAIJSON('{not: valid, json[}'), /Failed to parse AI JSON response/);
});

console.log('\nisTransientError');
await test('classifies HTTP 429 (status field) as transient', () => {
  assert.strictEqual(isTransientError(makeError({ status: 429 })), true);
});

await test('classifies HTTP 503 (status field) as transient', () => {
  assert.strictEqual(isTransientError(makeError({ status: 503 })), true);
});

await test('classifies a rate_limit_exceeded message body as transient (real OpenAI 429 shape)', () => {
  const err = makeError({
    message: '{"error":{"code":"rate_limit_exceeded","message":"Rate limit reached"}}',
  });
  assert.strictEqual(isTransientError(err), true);
});

await test('classifies a 503 (service unavailable) as transient', () => {
  const err = makeError({ status: 503 });
  assert.strictEqual(isTransientError(err), true);
});

await test('classifies a 500 message body as transient (real OpenAI 5xx shape)', () => {
  const err = makeError({
    message: '{"error":{"code":500,"message":"The server had an error processing your request"}}',
  });
  assert.strictEqual(isTransientError(err), true);
});

await test('classifies common network errors as transient', () => {
  assert.strictEqual(isTransientError(makeError({ code: 'ECONNRESET' })), true);
  assert.strictEqual(isTransientError(makeError({ code: 'ETIMEDOUT' })), true);
});

await test('does NOT classify a 400 (bad request / malformed prompt) as transient', () => {
  assert.strictEqual(isTransientError(makeError({ status: 400 })), false);
});

await test('does NOT classify a generic parse error as transient', () => {
  assert.strictEqual(isTransientError(new Error('Failed to parse AI JSON response')), false);
});

console.log('\nisHardQuotaExhaustion');
await test('classifies a real OpenAI insufficient_quota (code field) as hard exhaustion', () => {
  const err = makeError({ code: 'insufficient_quota', message: 'You exceeded your current quota' });
  assert.strictEqual(isHardQuotaExhaustion(err), true);
});

await test('classifies an insufficient_quota message body as hard exhaustion (real OpenAI shape)', () => {
  const err = makeError({
    message:
      '{"error":{"code":"insufficient_quota","message":"You exceeded your current quota, please check your plan and billing details."}}',
  });
  assert.strictEqual(isHardQuotaExhaustion(err), true);
});

await test('does NOT classify a plain rate_limit_exceeded as hard exhaustion', () => {
  const err = makeError({
    message: '{"error":{"code":"rate_limit_exceeded","message":"Rate limit reached"}}',
  });
  assert.strictEqual(isHardQuotaExhaustion(err), false);
});

await test('a hard quota exhaustion is therefore NOT transient (no wasted retry)', () => {
  const err = makeError({ code: 'insufficient_quota', message: 'quota exceeded' });
  assert.strictEqual(isHardQuotaExhaustion(err), true);
  assert.strictEqual(isTransientError(err), false);
});

await test('a short-lived rate_limit_exceeded remains transient (retry-worthy)', () => {
  const err = makeError({
    message: '{"error":{"code":"rate_limit_exceeded","message":"Rate limit reached"}}',
  });
  assert.strictEqual(isTransientError(err), true);
});

console.log('\nwithSingleRetry');
await test('returns the result immediately on first success (no retry needed)', async () => {
  let calls = 0;
  const result = await withSingleRetry(async () => {
    calls++;
    return 'ok';
  });
  assert.strictEqual(result, 'ok');
  assert.strictEqual(calls, 1);
});

await test('retries exactly once on a transient failure, then succeeds', async () => {
  let calls = 0;
  const result = await withSingleRetry(async () => {
    calls++;
    if (calls === 1) throw makeError({ status: 429 });
    return 'ok-after-retry';
  });
  assert.strictEqual(result, 'ok-after-retry');
  assert.strictEqual(calls, 2);
});

await test('fails after a transient failure occurs twice in a row (no infinite retry)', async () => {
  let calls = 0;
  await assert.rejects(
    withSingleRetry(async () => {
      calls++;
      throw makeError({ status: 503 });
    }),
    /error/
  );
  assert.strictEqual(calls, 2, 'expected exactly 2 attempts (1 initial + 1 retry), got ' + calls);
});

await test('does not waste a retry on a hard quota exhaustion (1 attempt only)', async () => {
  let calls = 0;
  await assert.rejects(
    withSingleRetry(async () => {
      calls++;
      throw makeError({ code: 'insufficient_quota', message: 'quota exceeded' });
    }),
    /quota exceeded/
  );
  assert.strictEqual(calls, 1, 'expected exactly 1 attempt (no retry on hard quota exhaustion), got ' + calls);
});

await test('does not retry a non-transient failure at all', async () => {
  let calls = 0;
  await assert.rejects(
    withSingleRetry(async () => {
      calls++;
      throw makeError({ status: 400, message: 'bad request' });
    }),
    /bad request/
  );
  assert.strictEqual(calls, 1, 'expected exactly 1 attempt (no retry for non-transient), got ' + calls);
});

console.log('\nAIServiceError (safe client-facing errors)');
await test('carries a clean message and marks itself as an AI service error', () => {
  const raw = new Error(
    '{"error":{"code":"insufficient_quota","message":"quota exceeded, billing details: ..."}}'
  );
  const safe = new AIServiceError('The AI service is temporarily unavailable. Please try again in a moment.', {
    cause: raw,
  });
  assert.strictEqual(safe.isAIServiceError, true);
  assert.strictEqual(safe.name, 'AIServiceError');
  assert.ok(!safe.message.includes('insufficient_quota'), 'safe message must not leak raw OpenAI error text');
  assert.ok(!safe.message.includes('billing'), 'safe message must not leak raw OpenAI error text');
  assert.strictEqual(safe.cause, raw, 'original error must be preserved as .cause for server-side logging');
});

console.log('\nvalidateQuestionsResponse (interview generation shape validation)');
await test('accepts a well-formed questions array', () => {
  const result = {
    questions: [
      { question: 'What is a closure?', category: 'technical', difficulty: 'medium' },
      { question: 'Describe your last project.', category: 'resume', difficulty: 'easy' },
    ],
  };
  const questions = validateQuestionsResponse(result);
  assert.strictEqual(questions.length, 2);
});

await test('rejects a missing questions field', () => {
  assert.throws(() => validateQuestionsResponse({}), (err) => {
    assert.ok(err instanceof AIServiceError);
    assert.ok(err.isAIServiceError);
    return true;
  });
});

await test('rejects an empty questions array (does not allow a 0-question interview)', () => {
  assert.throws(() => validateQuestionsResponse({ questions: [] }), AIServiceError);
});

await test('rejects a questions array that is not actually an array', () => {
  assert.throws(() => validateQuestionsResponse({ questions: 'not-an-array' }), AIServiceError);
});

await test('rejects questions missing required fields (e.g. no category)', () => {
  const result = { questions: [{ question: 'Explain X.', difficulty: 'easy' }] };
  assert.throws(() => validateQuestionsResponse(result), AIServiceError);
});

await test('rejects questions with an empty question string', () => {
  const result = { questions: [{ question: '   ', category: 'technical', difficulty: 'easy' }] };
  assert.throws(() => validateQuestionsResponse(result), AIServiceError);
});

await test('rejects if ANY question in the array is malformed, even if others are valid', () => {
  const result = {
    questions: [
      { question: 'Valid one.', category: 'technical', difficulty: 'easy' },
      { question: '', category: 'dsa', difficulty: 'hard' },
    ],
  };
  assert.throws(() => validateQuestionsResponse(result), AIServiceError);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
