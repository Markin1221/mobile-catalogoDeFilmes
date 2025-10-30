const fs = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  production: false,
  recipeApiKey: '${process.env.CHAVE_RECEITA}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`✅ Environment gerado em ${targetPath}`);
