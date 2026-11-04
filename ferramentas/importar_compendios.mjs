// Copia os compêndios de um mundo para dentro do sistema (packs/<nome>).
// Uso: node importar_compendios.mjs <pasta packs do mundo, COPIADA> <pasta packs do sistema>
// Precisa de classic-level (npm i classic-level). Com o Foundry aberto, copie a pasta do mundo antes e apague os LOCK.
import { ClassicLevel } from 'classic-level';
import fs from 'fs';
import path from 'path';

const [, , origem, destino] = process.argv;

for (const nome of fs.readdirSync(origem)) {
  const de = new ClassicLevel(path.join(origem, nome), { valueEncoding: 'json' });
  const pastaPara = path.join(destino, nome);
  fs.rmSync(pastaPara, { recursive: true, force: true });
  const para = new ClassicLevel(pastaPara, { valueEncoding: 'json' });
  const lote = para.batch();
  let n = 0;
  for await (const [chave, doc] of de.iterator()) {
    // Tira a permissão do usuário de quem criou: quem manda é o "ownership" do compêndio
    if (doc.ownership) doc.ownership = { default: doc.ownership.default ?? 0 };
    lote.put(chave, doc);
    n++;
  }
  await lote.write();
  await para.close();
  await de.close();
  for (const f of ['LOCK', 'LOG', 'LOG.old']) fs.rmSync(path.join(pastaPara, f), { force: true });
  console.log(nome, n);
}
