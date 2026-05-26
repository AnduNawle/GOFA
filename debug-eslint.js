const firebaseRulesPlugin = require('@firebase/eslint-plugin-security-rules');
console.log('Keys:', Object.keys(firebaseRulesPlugin));
if (firebaseRulesPlugin.default) {
  console.log('Default Keys:', Object.keys(firebaseRulesPlugin.default));
}
