const fs = require('fs').promises;

const writeToFile = async (destination, content) => {
  try {
    await fs.writeFile(destination, JSON.stringify(content, null, 4));
    console.info(`Data written to ${destination}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const readFromFile = async (file) => {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const appendToFile = async (file, content) => {
  try {
    const existingData = await readFromFile(file);
    const newData = existingData ? [...existingData, content] : [content];
    await writeToFile(file, newData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { writeToFile, readFromFile, appendToFile };
