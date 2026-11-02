/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { certificatesData } from '../../data/certificates';

test('certificatesData includes all three WorldQuant BRAIN milestones', () => {
  const gold = certificatesData.find((c) => c.id === 'cert-worldquant-gold');
  const silver = certificatesData.find((c) => c.id === 'cert-worldquant-silver');
  const bronze = certificatesData.find((c) => c.id === 'cert-worldquant-bronze');

  assert.ok(gold, 'Gold milestone must be present');
  assert.ok(silver, 'Silver milestone must be present');
  assert.ok(bronze, 'Bronze milestone must be present');

  assert.equal(gold.issuer, 'WorldQuant BRAIN');
  assert.equal(silver.issuer, 'WorldQuant BRAIN');
  assert.equal(bronze.issuer, 'WorldQuant BRAIN');
});

test('WorldQuant Gold has verified genuine PDF document attached', () => {
  const gold = certificatesData.find((c) => c.id === 'cert-worldquant-gold');
  assert.ok(gold);
  assert.equal(gold.hasGenuineFile, true);
  assert.equal(gold.fileType, 'pdf');
  assert.equal(gold.certificatePath, '/assets/aistudio/WorldQuant_Gold_Certificate_fd9a9343.pdf');
  assert.equal(gold.authority, 'Nitish Maini, Chief Strategy Officer of WorldQuant');
});

test('WorldQuant Silver and Bronze are maintained in a pending-content state without fake PDFs', () => {
  const silver = certificatesData.find((c) => c.id === 'cert-worldquant-silver');
  const bronze = certificatesData.find((c) => c.id === 'cert-worldquant-bronze');

  assert.ok(silver);
  assert.ok(bronze);

  assert.equal(silver.hasGenuineFile, false);
  assert.equal(silver.certificatePath, undefined, 'Silver must not have a fabricated certificate path');
  assert.ok(silver.pendingUploadNote?.includes('Pending Upload'));

  assert.equal(bronze.hasGenuineFile, false);
  assert.equal(bronze.certificatePath, undefined, 'Bronze must not have a fabricated certificate path');
  assert.ok(bronze.pendingUploadNote?.includes('Pending Upload'));
});

test('Hacktoberfest achievement has genuine PDF certificate and date', () => {
  const hacktober = certificatesData.find((c) => c.id === 'cert-hacktoberfest-2026');
  assert.ok(hacktober);
  assert.equal(hacktober.hasGenuineFile, true);
  assert.equal(hacktober.fileType, 'pdf');
  assert.equal(hacktober.certificatePath, '/assets/aistudio/HacktoberFest_Certificate_9daf99fa.pdf');
  assert.equal(hacktober.date, 'October 31, 2026');
});

test('No fictitious external verification links or manufactured certificate IDs are introduced', () => {
  for (const cert of certificatesData) {
    // Only real verification links would be allowed if provided
    assert.equal(cert.verificationUrl, undefined, 'No fake verification link should be fabricated');
    assert.ok(cert.verificationStatus === 'verified');
  }
});
