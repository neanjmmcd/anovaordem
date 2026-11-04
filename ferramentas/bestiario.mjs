import { ClassicLevel } from 'classic-level';
import fs from 'fs';
const [, , entrada, destino] = process.argv;
const docs = JSON.parse(fs.readFileSync(entrada, 'utf8'));
fs.rmSync(destino, { recursive: true, force: true });
const db = new ClassicLevel(destino, { valueEncoding: 'json' });
const agora = Date.now();
const stats = { coreVersion: '13.351', systemId: 'a-nova-ordem', systemVersion: '0.6.0', createdTime: agora, modifiedTime: agora, lastModifiedBy: null, compendiumSource: null, duplicateSource: null };
const lote = db.batch();
docs.forEach((d, i) => {
  const { _key, _armas, ...ator } = d;
  lote.put(_key, { ...ator, sort: (i + 1) * 1000, _stats: stats });
  for (const a of _armas) {
    const { _key: k, ...item } = a;
    lote.put(k, { ...item, _stats: stats });
  }
});
await lote.write();
await db.close();
console.log(`${docs.length} atores gravados em ${destino}`);
