/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { portfolioData } from '../../data/portfolio';
import { siteConfig } from '../../config/site';

test('portfolioData and siteConfig specify verified contact email lalitchoudhary0907@gmail.com', () => {
  assert.equal(portfolioData.personalInfo.email, 'lalitchoudhary0907@gmail.com');
  const mailSocial = siteConfig.socialLinks.find((s) => s.name === 'Email');
  assert.ok(mailSocial);
  assert.equal(mailSocial?.url, 'mailto:lalitchoudhary0907@gmail.com');
});

test('siteConfig navItems contains Contact section linked to #contact', () => {
  const contactNav = siteConfig.navItems.find((item) => item.title === 'Contact');
  assert.ok(contactNav);
  assert.equal(contactNav?.href, '#contact');
});
