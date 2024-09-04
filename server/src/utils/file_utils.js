import { access, mkdir, writeFile, readdir, rm, rmdir } from "fs/promises";

const createDir = async (dirPath) => {
  try {
    await access(dirPath);
  } catch (err) {
    await mkdir(dirPath);
  }
};

const removeFile = async (filePath) => {
  await rm(filePath);
};

const generateFile = async (extension, code) => {
  const filename = `${new Date().getTime()}.${extension}`;
  await createDir("codes");
  await writeFile(`codes/${filename}`, code);
  return `codes/${filename}`;
};

export default { generateFile, createDir, removeFile };
