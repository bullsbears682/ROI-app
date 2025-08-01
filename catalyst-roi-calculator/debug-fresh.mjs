#!/usr/bin/env node

// Fresh import after changes
import fs from 'fs';

// Read the file directly to verify our changes
const fileContent = fs.readFileSync('./src/data/researchData.js', 'utf8');
console.log('🔍 CHECKING FILE CONTENT');
console.log('File contains "Generate source objects":', fileContent.includes('Generate source objects'));
console.log('File contains "fallback: generate":', fileContent.includes('Fallback: generate'));

// Now import and test
const { scenarioResearch, generateResearchSummary } = await import('./src/data/researchData.js?t=' + Date.now());

const scenarioId = 'ecom-marketplace';
console.log('\n🧪 FRESH TEST:', scenarioId);

const research = scenarioResearch[scenarioId];
console.log('Raw sources:', research?.sources);

const summary = generateResearchSummary(scenarioId, 'technology');
console.log('Summary sources count:', summary?.sources?.length || 0);
console.log('Summary sources:', summary?.sources?.map(s => s?.name) || []);
