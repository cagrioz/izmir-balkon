import test from 'node:test';
import { execFileSync } from 'node:child_process';
test('campaign pack obeys limits and checked-in exports match source', () => {
  execFileSync(process.execPath,['scripts/ads-pack.mjs','--check'],{stdio:'pipe'});
});
