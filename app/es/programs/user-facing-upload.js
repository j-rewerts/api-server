const utils = require('../utils');

// program in this context is the user facing portion
async function handleProgramUpload(client, program, guid) {
  console.log('IN USER FACING UPLOAD');
  console.log(program);
  // add value in there for conformity with rest of program
  const valueProgram = Object.create(null);
  valueProgram['value'] = program;
  if (client === undefined || program == undefined) {
    throw new Error('program or client undefined in handleProgramUpload');
  }
  const res = await utils.indexDoc(client, 'programs', valueProgram, 'user_facing', guid);
  console.log(res);
  return res;
}

module.exports = {
  handleProgramUpload
};
