import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Detect if filesystem is writable (false on Vercel serverless)
let _writable = null;
function isWritable() {
  if (_writable !== null) return _writable;
  try {
    const testFile = path.join(DATA_DIR, '.write-test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    _writable = true;
  } catch {
    _writable = false;
  }
  return _writable;
}

export function readCollection(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function writeCollection(name, data) {
  if (!isWritable()) return; // silently skip on read-only filesystems
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function readDocument(name) {
  // For single-object files like profile.json
  return readCollection(name);
}

export function writeDocument(name, data) {
  writeCollection(name, data);
}

// CRUD helpers
export function findById(collection, id) {
  const data = readCollection(collection);
  return data.find(item => item.id === id);
}

export function insertOne(collection, item) {
  const data = readCollection(collection);
  data.push(item);
  writeCollection(collection, data);
  return item;
}

export function updateOne(collection, id, updates) {
  const data = readCollection(collection);
  const index = data.findIndex(item => item.id === id);
  if (index === -1) return null;
  data[index] = { ...data[index], ...updates };
  writeCollection(collection, data);
  return data[index];
}

export function deleteOne(collection, id) {
  const data = readCollection(collection);
  const filtered = data.filter(item => item.id !== id);
  writeCollection(collection, filtered);
  return filtered.length < data.length;
}
