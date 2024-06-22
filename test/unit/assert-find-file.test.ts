import { test } from '../../src/modules/test.js';
import { assert } from '../../src/modules/assert.js';
import { findFile } from '../../src/helpers/find-file.js';

const setStack = (stack: string): Error => {
  const error = new Error('Test error');
  error.stack = stack;

  return error;
};

const testCases = [
  {
    description: 'Bun',
    stack: `
    AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    123 !== 456
        at message.message (/workdir/node_modules/poku/lib/modules/assert.js:53:63)
        at /workdir/node_modules/poku/lib/helpers/parse-assertion.js:79:26
        at Generator.next (<anonymous>)
        at /workdir/node_modules/poku/lib/helpers/parse-assertion.js:8:71
        at new Promise (<anonymous>)
        at __awaiter (/workdir/node_modules/poku/lib/helpers/parse-assertion.js:4:12)
        at parseAssertion (/workdir/node_modules/poku/lib/helpers/parse-assertion.js:62:41)
        at Function.strictEqual (/workdir/node_modules/poku/lib/modules/assert.js:53:45)
        at file:///workdir/test/some.test.js:3:8
        at ModuleJob.run (node:internal/modules/esm/module_job:262:25)
    `,
    expected: 'file:///workdir/test/some.test.js:3:8',
  },
  {
    description: 'Node.js',
    stack: `
    AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    123 !== 456
        at message.message (/workdir/node_modules/poku/lib/modules/assert.js:53:63)
        at /workdir/node_modules/poku/lib/helpers/parse-assertion.js:79:26
        at Generator.next (<anonymous>)
        at /workdir/node_modules/poku/lib/helpers/parse-assertion.js:8:71
        at new Promise (<anonymous>)
        at __awaiter (/workdir/node_modules/poku/lib/helpers/parse-assertion.js:4:12)
        at parseAssertion (/workdir/node_modules/poku/lib/helpers/parse-assertion.js:62:41)
        at Function.strictEqual (/workdir/node_modules/poku/lib/modules/assert.js:53:45)
        at file:///workdir/test/some.test.js:3:8
        at ModuleJob.run (node:internal/modules/esm/module_job:262:25)
    `,
    expected: 'file:///workdir/test/some.test.js:3:8',
  },
  {
    description: "Deno (doesn't show the file path)",
    stack: `
    AssertionError [ERR_ASSERTION]: Values are not strictly equal:
        [Diff] Actual / Expected
    -   123
    +   456
        at new AssertionError (ext:deno_node/assertion_error.ts:414:11)
        at toNode (node:assert:44:15)
        at Object.strictEqual (node:assert:215:3)
        at message.message (file:///workdir/node_modules/.deno/poku/node_modules/poku/lib/modules/assert.js:53:63)
        at file:///workdir/node_modules/.deno/poku/node_modules/poku/lib/helpers/parse-assertion.js:79:26
        at Generator.next (<anonymous>)
        at file:///workdir/node_modules/.deno/poku/node_modules/poku/lib/helpers/parse-assertion.js:8:71
        at new Promise (<anonymous>)
        at __awaiter (file:///workdir/node_modules/.deno/poku/node_modules/poku/lib/helpers/parse-assertion.js:4:12)
        at parseAssertion (file:///workdir/node_modules/.deno/poku/node_modules/poku/lib/helpers/parse-assertion.js:62:41)
    `,
    expected: '',
  },
];

test('Assert: Find file from stack', () => {
  testCases.forEach(({ description, stack, expected }) => {
    const error = setStack(stack);
    const result = findFile(error);

    assert.deepStrictEqual(result, expected, description);
  });
});