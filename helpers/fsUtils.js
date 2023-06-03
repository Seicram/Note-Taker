const fs = require('fs').promises;
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const readFromFile = async (file) => {
  try {
    const data = await readFile(file, 'utf8');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const writeToFile = async (file, content) => {
  try {
    await writeFile(file, JSON.stringify(content, null, 2));
    console.info(`Data written to ${file}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const readAndAppend = async (file, content) => {
  try {
    const existingData = await readFromFile(file);
    const parsedData = JSON.parse(existingData);
    parsedData.push(content);
    await writeToFile(file, parsedData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { readFromFile, writeToFile, readAndAppend };
