import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);
