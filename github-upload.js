
const { execSync } = require('child_process');

try {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Error: GITHUB_TOKEN not found in secrets');
    process.exit(1);
  }

  // Configure git
  execSync('git config --global user.name "YogaPoseRecognizer"');
  execSync('git config --global user.email "yogapose@example.com"');
  
  // Add and commit changes
  execSync('git add .');
  execSync('git commit -m "Update: Yoga Pose Recognition App"');
  
  // Push to GitHub using token
  execSync(`git remote remove origin 2>/dev/null || true`);
  execSync(`git remote add origin https://${token}@github.com/serkac1000/Yoga11.git`);
  execSync('git push -u origin main --force');
  
  console.log('Successfully uploaded to GitHub!');
} catch (error) {
  console.error('Error uploading to GitHub:', error);
  process.exit(1);
}
