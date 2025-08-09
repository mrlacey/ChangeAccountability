#!/usr/bin/env node

/**
 * Extension validation script
 * Validates that all required files exist for Chrome extension loading
 */

import { existsSync } from 'fs';
import { join } from 'path';

const distPath = './dist';
const requiredFiles = [
  'manifest.json',
  'content.js',
  'options.js',
  'options.html',
  'styles.css',
  'icons/icon-16.png',
  'icons/icon-32.png',
  'icons/icon-48.png',
  'icons/icon-128.png'
];

console.log('🔍 Validating ChangeAccountability extension...\n');

let allValid = true;

// Check if dist directory exists
if (!existsSync(distPath)) {
  console.error('❌ dist/ directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check each required file
requiredFiles.forEach(file => {
  const filePath = join(distPath, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allValid = false;
  }
});

// Validate manifest.json structure
try {
  const manifestPath = join(distPath, 'manifest.json');
  if (existsSync(manifestPath)) {
    const manifestContent = await import(`${process.cwd()}/${manifestPath}`, { assert: { type: 'json' } });
    const manifest = manifestContent.default;
    
    console.log('\n📋 Manifest validation:');
    
    if (manifest.manifest_version === 3) {
      console.log('✅ Manifest V3 format');
    } else {
      console.log('❌ Not using Manifest V3');
      allValid = false;
    }
    
    if (manifest.permissions && manifest.permissions.includes('storage')) {
      console.log('✅ Storage permission included');
    } else {
      console.log('❌ Storage permission missing');
      allValid = false;
    }
    
    if (manifest.host_permissions && manifest.host_permissions.includes('*://github.com/*')) {
      console.log('✅ GitHub host permission included');
    } else {
      console.log('❌ GitHub host permission missing');
      allValid = false;
    }
    
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
      console.log('✅ Content scripts configured');
    } else {
      console.log('❌ Content scripts not configured');
      allValid = false;
    }
  }
} catch (error) {
  console.log('❌ Failed to validate manifest.json:', error.message);
  allValid = false;
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 Extension validation passed!');
  console.log('\n📖 To load in Chrome:');
  console.log('   1. Open chrome://extensions/');
  console.log('   2. Enable "Developer mode"');
  console.log('   3. Click "Load unpacked"');
  console.log('   4. Select the dist/ folder');
  console.log('\n🔧 To configure:');
  console.log('   1. Click the extension icon or go to chrome://extensions/');
  console.log('   2. Click "Options" for ChangeAccountability');
  console.log('   3. Enter your GitHub Personal Access Token');
  process.exit(0);
} else {
  console.log('❌ Extension validation failed!');
  console.log('   Run "npm run build" to generate missing files.');
  process.exit(1);
}