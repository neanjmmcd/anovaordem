// Converte o custo de Essência do compêndio de Implantes para a tabela nova (pontos).
// Uso: node custo_implantes.mjs <pasta packs/implantes>   (com o Foundry fechado)
import { ClassicLevel } from 'classic-level';
import fs from 'fs';
import path from 'path';
const NOVO = { 6: 2, 12: 4, 18: 10, 24: 12, 30: 16 };
const pasta = process.argv[2];
const db = new ClassicLevel(pasta, { valueEncoding: 'json' });
const lote = db.batch(); let n = 0;
for await (const [k, v] of db.iterator()) {
  if (!k.startsWith('!items!') || v.type !== 'implantes') continue;
  if ((v.flags?.['a-nova-ordem']?.custoEssencia ?? 0) >= 2) continue;
  const antigo = Number(v.system.essencia);
  if (antigo in NOVO) v.system.essencia = NOVO[antigo];
  v.flags = { ...(v.flags ?? {}), 'a-nova-ordem': { ...(v.flags?.['a-nova-ordem'] ?? {}), custoEssencia: 2 } };
  lote.put(k, v); n++;
  console.log(antigo, '->', v.system.essencia, v.name);
}
await lote.write(); await db.compactRange('\x00', '\xff'); await db.close();
for (const f of ['LOCK', 'LOG', 'LOG.old']) fs.rmSync(path.join(pasta, f), { force: true });
console.log('convertidos', n);
