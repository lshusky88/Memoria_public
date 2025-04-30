
import fs from 'fs';
import path from 'path';

function searchFilesForSchemaIssues(directory: string): void {
  function searchFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // More verbose logging for schema references
      if (line.includes('schema: "api"') || line.includes("schema: 'api'")) {
        console.log(`🚨 CRITICAL: Unexpected 'api' schema reference found in ${filePath}:
        Line ${index + 1}: ${line}`);
      }
      
      // Detailed Supabase client configuration tracking
      if (line.includes('createClient') && line.includes('supabase')) {
        console.log(`📡 Supabase Client Configuration detected in ${filePath}:
        Line ${index + 1}: ${line}`);
      }
      
      // Comprehensive database query pattern detection
      if (line.includes('.from(')) {
        console.log(`📊 Database Query Pattern found in ${filePath}:
        Line ${index + 1}: ${line}`);
      }
    });
  }

  function traverseDirectory(dir: string): void {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        searchFile(fullPath);
      }
    });
  }

  console.log('🔍 Starting comprehensive schema check...');
  console.log('📂 Looking for potential schema issues in:', directory);
  traverseDirectory(directory);
  console.log('✅ Schema check completed.');
}

// Search from the src directory
searchFilesForSchemaIssues(path.join(__dirname, '..', 'src'));

