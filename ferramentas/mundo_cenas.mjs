// Gera os compêndios "mundo" (diário dos impérios e ilustrações do tema) e "cenas" (mapas prontos).
// Uso: node mundo_cenas.mjs <pasta packs do sistema>   (precisa de classic-level: npm i classic-level)
// Recria só packs/mundo e packs/cenas; com o Foundry aberto, feche o mundo antes de rodar.
import { ClassicLevel } from 'classic-level';
import fs from 'fs';
import path from 'path';

const packs = process.argv[2];
const SIS = 'systems/a-nova-ordem/assets';
const agora = Date.now();
const stats = { coreVersion: '13.351', systemId: 'a-nova-ordem', systemVersion: '0.9.0', createdTime: agora, modifiedTime: agora, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null };

const img = (arq, alt) => `<p><img src="${SIS}/${arq}" alt="${alt}" style="width:100%;border-radius:4px"></p>`;
const lista = itens => `<ul>${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;

/* ---------- Diários ---------- */
const imperios = [
  {
    id: 'ImpReichAON0001', nome: 'Grande Reich da Supremacia Ariana', arq: 'imperios/reich.webp',
    html: `<p><em>Império totalitário. O Estado existe para purificar, preservar e expandir a herança racial por meio de repressão, propaganda e violência sistêmica.</em></p>
${lista(['<strong>Líder:</strong> Führer Adolph Hitler', '<strong>Capital:</strong> Berlim (núcleo: Alemanha)', '<strong>Área:</strong> ~78 milhões km² — Europa Central, Setentrional e Oriental, Canadá, América Central, grande parte da América do Norte e Groenlândia', '<strong>População:</strong> ~1,15 bilhão'])}
<h3>Hierarquia social</h3><p>Linha Pura → Adaptados → Dependentes do Reich → Descartáveis → Inexistentes.</p>
<h3>Forças de repressão</h3><p>RSD, Gestapo-Reich, SS do Reich, Administração Militar e Forças Paralelas.</p>
<h3>Vida cotidiana</h3><p>A elite vive protegida e propagandeada. As classes inferiores vivem sob vigilância, trabalho compulsório e repressão constante. Nas Zonas Mortas e de Teste ninguém é contado.</p>
<h3>Política externa</h3><p>Expansionista e coercitiva: diplomacia baseada em ameaça e guerra indireta.</p>`
  },
  {
    id: 'ImpAsiaAON00001', nome: 'Império da Ordem Asiática', arq: 'imperios/ordem_asiatica.webp',
    html: `<p><em>Império totalitário liderado pelo Japão. Ordem absoluta, disciplina coletiva e isolamento extremo. O Imperador é tratado como figura divina e não é visto desde o fim da guerra.</em></p>
${lista(['<strong>Líder:</strong> Imperador Hirohito', '<strong>Capital:</strong> Tokyo — o Japão é inacessível, cercado pelo <em>Kyōdaina kabe</em>, uma muralha em volta de todo o país', '<strong>Área:</strong> ~44 milhões km² — Ásia Oriental, Sudeste Asiático, Sul da Ásia, Ásia Central e Oriente Médio', '<strong>População:</strong> ~2,1 bilhões'])}
<h3>Hierarquia social</h3><p>Imperiais Japoneses → Províncias Leais → Províncias Subjugadas → Populações Militarizadas → Invisíveis.</p>
<h3>Forças de repressão</h3><p>Guarda Imperial, Polícia de Ordem, Ministério da Harmonia, Forças Provinciais e Unidades Experimentais.</p>
<h3>Vida cotidiana</h3><p>Nas províncias, o povo vive em fileiras: silêncio, uniformes e obediência. Os soldados-estátua de aço, iguais aos samurais das antigas histórias, guardam praças e portos.</p>
<h3>Política externa</h3><p>Isolamento quase total, com comércio mínimo e controlado. A Oceania é o território neutro para a diplomacia.</p>`
  },
  {
    id: 'ImpRomaAON00001', nome: 'Império de Romanova', arq: 'imperios/romanova.webp',
    html: `<p><em>Império fascista liderado pela Itália. Restaura a glória da Roma Antiga, o culto ao Estado, a expansão e o espetáculo como ferramenta de controle. O passado romano não é estudado: é encenado.</em></p>
${lista(['<strong>Líder:</strong> Imperatore Benito Mussolini', '<strong>Capital:</strong> Roma (núcleo: Itália)', '<strong>Área:</strong> ~52 milhões km² — Sul da Europa, América do Sul, Norte da África e Costa Oeste da África', '<strong>População:</strong> ~1,4 bilhão'])}
<h3>Hierarquia social</h3><p>Elite Imperial → Cidadãos Plenos → Cidadãos Secundários → Povos Provinciais → Escravizados / Condenados.</p>
<h3>Controle e repressão</h3><p>Legiões Imperiais, Polícia Militar Romanovana, Guardas Pretorianos e Tribunais Imperiais.</p>
<h3>Vida cotidiana</h3><p>Mármore e diesel lado a lado. O povo provincial carrega o peso do império enquanto o Coliseu oferece espetáculos, e as feras autômatas de bronze lembram a todos o preço da desobediência.</p>
<h3>Política externa</h3><p>Diplomacia agressiva e forte presença naval. Relações tensas com o Grande Reich e pragmáticas com a Ordem Asiática.</p>`
  }
];

const tema = [
  ['TemaCidadeAON01', 'A Cidade', 'tema/cidade.webp', 'Arranha-céus, zepelins e chuva: a vida comum continua sob a Nova Ordem.'],
  ['TemaGuerraAON01', 'A Guerra', 'tema/guerra.webp', 'Mechas a diesel, exoesqueletos e gás: a guerra nunca acabou de verdade.'],
  ['TemaOcultoAON01', 'O Oculto', 'tema/ocultismo.webp', 'Alquimia e rituais em bunkers escondidos: o segredo do Projeto Titã.'],
  ['TemaRuasAON0001', 'As Ruas', 'tema/ruas.webp', 'Mercado negro, implantes e patrulhas: quem resiste vive nas sombras.']
];

const pagTexto = (id, nome, html, sort) => ({ _id: id, name: nome, type: 'text', sort, title: { show: true, level: 1 }, image: {}, text: { format: 1, content: html }, video: { controls: true, volume: 0.5 }, src: null, system: {}, category: null, ownership: { default: -1 }, flags: {}, _stats: stats });
const pagImagem = (id, nome, src, legenda, sort) => ({ _id: id, name: nome, type: 'image', sort, title: { show: true, level: 1 }, image: { caption: legenda }, text: { format: 1 }, video: { controls: true, volume: 0.5 }, src, system: {}, category: null, ownership: { default: -1 }, flags: {}, _stats: stats });

const diarios = [
  {
    _id: 'MundoImperiosA1', name: 'Os Impérios', sort: 100000,
    pages: [
      pagTexto('ImpIntroAON0001', '1975: o Eixo venceu', `<p>Em 30 de abril de 1945 o <strong>Projeto Titã</strong> virou a guerra. No ano seguinte, o Eixo dividiu o mundo em três partes, cada uma um Império controlado por uma das potências, num "acordo de cavalheiros". Quem não aceitou foi dizimado do mapa ou dominado à força.</p><p>Trinta anos depois, é assim que as pessoas vivem.</p>`, 100000),
      ...imperios.map((e, i) => pagTexto(e.id, e.nome, img(e.arq, e.nome) + e.html, 200000 + i * 100000))
    ]
  },
  {
    _id: 'MundoRetratosA1', name: 'Retratos da Nova Ordem', sort: 200000,
    pages: tema.map(([id, nome, arq, leg], i) => pagImagem(id, nome, `${SIS}/${arq}`, leg, 100000 + i * 100000))
  }
];

/* ---------- Cenas ---------- */
const cenas = [
  ['CenaLobbyAON001', 'Lobby — Pátio de Treino', 'mapas/lobby.webp'],
  ['CenaLobbyAON002', 'Lobby — Pátio de Treino (inclinado)', 'mapas/lobby_inclinado.webp'],
  ['CenaCasaAON0001', 'Casa Comum', 'mapas/casa.webp'],
  ['CenaBoateAON001', 'Boate', 'mapas/boate.webp'],
  ['CenaGalpaoAON01', 'Galpão / Fábrica Velha', 'mapas/galpao.webp'],
  ['CenaGalpaoAON02', 'Galpão / Fábrica Velha (inclinado)', 'mapas/galpao_inclinado.webp'],
  ['CenaGalpaoAON03', 'Galpão / Fábrica Velha (inclinado, com terreno)', 'mapas/galpao_inclinado_externo.webp']
];

async function gravar(nome, docs) {
  const destino = path.join(packs, nome);
  fs.rmSync(destino, { recursive: true, force: true });
  const db = new ClassicLevel(destino, { valueEncoding: 'json' });
  const lote = db.batch();
  for (const [k, v] of docs) lote.put(k, v);
  await lote.write();
  await db.close();
  console.log(`${nome}: ${docs.length} registros`);
}

const docsMundo = [];
for (const d of diarios) {
  docsMundo.push([`!journal!${d._id}`, { _id: d._id, name: d.name, pages: d.pages.map(p => p._id), folder: null, categories: [], sort: d.sort, ownership: { default: 0 }, flags: {}, _stats: stats }]);
  for (const p of d.pages) docsMundo.push([`!journal.pages!${d._id}.${p._id}`, p]);
}

const docsCenas = cenas
  .filter(([, , arq]) => fs.existsSync(path.join(packs, '..', 'assets', arq)))
  .map(([id, nome, arq], i) => [`!scenes!${id}`, {
    _id: id, name: nome, active: false, navigation: false, navOrder: 0, navName: '', sort: (i + 1) * 100000, folder: null,
    background: { src: `${SIS}/${arq}` }, foreground: null, thumb: `${SIS}/${arq}`,
    width: 2000, height: 1500, padding: 0.1, initial: null, backgroundColor: '#1b1b1b',
    grid: { type: 1, size: 100, style: 'solidLines', thickness: 1, color: '#000000', alpha: 0.2, distance: 1.5, units: 'm' },
    tokenVision: false, fog: { exploration: false }, environment: { globalLight: { enabled: true } },
    drawings: [], tokens: [], lights: [], notes: [], sounds: [], regions: [], templates: [], tiles: [], walls: [],
    playlist: null, playlistSound: null, journal: null, journalEntryPage: null, weather: '',
    ownership: { default: 0 }, flags: {}, _stats: stats
  }]);

await gravar('mundo', docsMundo);
await gravar('cenas', docsCenas);
