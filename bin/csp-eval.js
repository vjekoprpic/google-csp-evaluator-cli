#!/usr/bin/env node
/**
 * CLI wrapper around google/csp-evaluator
 *
 * Usage examples:
 *   $ csp-eval -c "script-src https://google.com"
 *   $ csp-eval -f ./csp.txt
 *   $ cat ./csp.txt | csp-eval
 *
 * Prints the JSON evaluation result to stdout.
 */

import { CspEvaluator } from 'csp_evaluator/dist/evaluator.js';
import { CspParser } from 'csp_evaluator/dist/parser.js';
import fs from 'node:fs';
import process from 'node:process';
import { program } from 'commander';

program
  .name('csp-eval')
  .description('Evaluate Content‑Security‑Policy strings')
  .option('-c, --csp <string>', 'CSP string to evaluate')
  .option('-f, --file <path>', 'Path to a file containing a CSP string')
  .option('-m, Not pretty JSON output')
  .version('1.0.0');

program.parse(process.argv);
const opts = program.opts();

const readStdin = async () =>
  new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => (data += chunk));
    process.stdin.on('end', () => resolve(data.trim()));
    process.stdin.on('error', reject);
  });

const main = async () => {
  let csp = opts.csp ?? null;

  if (opts.file) {
    try {
      csp = fs.readFileSync(opts.file, 'utf8').trim();
    } catch (err) {
      console.error(`Failed to read file "${opts.file}": ${err.message}`);
      process.exit(2);
    }
  }

  if (!csp && !process.stdin.isTTY) {
    csp = await readStdin();
  }

  if (!csp) {
    console.error('No CSP string provided. Use --csp, --file or pipe via stdin.');
    program.help({ error: true });
  }

  try {
    const minimal = process.argv.includes('-m') || process.argv.includes('--minimal');

    const parsed  = new CspParser(csp).csp;
    const result  = new CspEvaluator(parsed).evaluate();

    if (minimal) {
    // Print only the raw result (handy for shell pipelines / CI checks)
        console.log(JSON.stringify(result));          
    } else {
    // Default: nicely formatted JSON block
        console.log(JSON.stringify(result, null, 2));
    }

  } catch (err) {
    console.error(`Error while evaluating CSP: ${err.message}`);
    process.exit(3);
  }
};

await main();

