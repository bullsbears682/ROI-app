#!/usr/bin/env node

import { researchSources } from './src/data/researchData.js';

console.log('🔍 CHECKING LOADED SOURCES');
console.log('='.repeat(40));

const sources = Object.keys(researchSources);
console.log(`Total sources loaded: ${sources.length}`);
console.log('\nLoaded sources:');
sources.forEach(source => console.log(`  - ${source}`));

console.log('\n🔍 Specific checks:');
console.log('amazon:', 'amazon' in researchSources ? '✅' : '❌');
console.log('shopify:', 'shopify' in researchSources ? '✅' : '❌');
console.log('bigcommerce:', 'bigcommerce' in researchSources ? '✅' : '❌');
