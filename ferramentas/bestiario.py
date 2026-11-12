"""Gera bestiario.json (atores NPC + armas embutidas) a partir do gerar_suplemento.py
e converte as ilustrações em assets/npcs/*.webp."""
import json, os, re, random, string, sys
from PIL import Image

SUP = sys.argv[1]          # pasta suplemento
SISTEMA = sys.argv[2]      # pasta do sistema
SAIDA = sys.argv[3]        # bestiario.json

src = open(os.path.join(SUP, 'gerar_suplemento.py'), encoding='utf-8').read()
ns = {}
# Só as definições necessárias: SIGLAS, bonus_for, dano, IMAGENS, NPCS
def bloco(ini, fim):
    i = src.index(ini); j = src.index(fim, i)
    return src[i:j]
exec(bloco('SIGLAS = [', 'def teste('), ns)
exec(bloco('IMAGENS = {', 'def ilustracao('), ns)
exec(bloco('def dano(dados, n):', '# ===='), ns)
exec(bloco('NPCS = [', 'for n in NPCS:'), ns)
NPCS, IMAGENS = ns['NPCS'], ns['IMAGENS']

cfg = open(os.path.join(SISTEMA, 'scripts', 'config.js'), encoding='utf-8').read()
LABEL2KEY = {lab: key for key, lab in re.findall(r'\n  (\w+): \{\s*label: "([^"]+)"', cfg)}
LABEL2KEY['Ataque natural'] = 'briga'
GRUPOS = {'fis': 'penfisica', 'soc': 'pensociais', 'men': 'penmentais', 'tec': 'pentecnicologica',
          'alq': 'penaquimica', 'mag': 'penmagica', 'sob': 'pensobrevivencia'}
NATURAL = re.compile(r'mordida|mand[íi]bula|garra|ferr[ãa]o|asas|golpe|chifre|tent[áa]culo|cauda|pis[ãa]o|esmag|investida|punho|soco|chute|fauce|gavinha|pata', re.I)
DISPARO = re.compile(r'pistola|rev[óo]lver|fuzil|rifle|espingarda|metralhadora|submetralhadora|gatling|canh[ãa]o|lan[çc]a-chamas|granada|machine gun|disparo', re.I)

def limpa(t):
    t = re.sub(r'\[\[(.+?)\]\]', r'\1', t)
    t = t.replace('**', '')
    return re.sub(r'(?<!\w)\*(.+?)\*(?!\w)', r'\1', t)

MINUSC = {'de', 'da', 'do', 'das', 'dos', 'e', 'o', 'a'}
def titulo(nome):
    out = []
    for i, w in enumerate(nome.lower().split(' ')):
        out.append(w if (i and w in MINUSC) else w[:1].upper() + w[1:])
    s = ' '.join(out)
    s = re.sub(r'\((\w)', lambda m: '(' + m.group(1).upper(), s)
    s = re.sub(r'-(\w)', lambda m: '-' + m.group(1).upper(), s)
    return s.replace('Ss', 'SS').replace('Mk-Iv', 'MK-IV')

def rid():
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(16))

random.seed(1975)
pasta_img = os.path.join(SISTEMA, 'assets', 'npcs')
os.makedirs(pasta_img, exist_ok=True)

def imagem(nome):
    arq = next((a for k, a in IMAGENS.items() if nome.startswith(k) or k in nome), None)
    if not arq:
        return 'icons/svg/mystery-man.svg'
    base = os.path.splitext(arq)[0].replace('_v1', '').replace('_v2', '')
    Image.open(os.path.join(SUP, 'ilustracoes', arq)).convert('RGB').resize((512, 683), Image.LANCZOS) \
        .save(os.path.join(pasta_img, base + '.webp'), 'WEBP', quality=82)
    return f'systems/a-nova-ordem/assets/npcs/{base}.webp'

def token_de(img):
    """Token visto de cima em assets/npcs/tokens, se existir; senão a ilustração."""
    base = os.path.basename(img)
    if os.path.exists(os.path.join(pasta_img, 'tokens', base)):
        return f'systems/a-nova-ordem/assets/npcs/tokens/{base}'
    return img

def arma(texto):
    t = limpa(texto)
    m = re.match(r'\s*([^:]+):\s*(.+)', t)
    nome, resto = (m.group(1).strip(), m.group(2).strip()) if m else (t[:40], t)
    usos = re.search(r'\((\d+) (?:usos?|cargas?|unidades?)\)', nome)
    n = nome.lower()
    # Perícia explícita: o palpite automático por nome não conhece armas de criaturas
    if NATURAL.search(nome): pericia = 'briga'
    elif re.search(r'granada|arremesso|dinamite', n): pericia = 'atletismo'
    elif re.search(r'canh[ãa]o|machine gun|gatling|lan[çc]a-chamas', n): pericia = 'armasPesadas'
    elif re.search(r'descarga', n): pericia = 'armasExperimentais'
    elif DISPARO.search(nome): pericia = 'armasFogo'
    else: pericia = 'armasBrancas'
    distancia = pericia not in ('briga', 'armasBrancas')
    ammo = int(usos.group(1)) if usos else (30 if distancia else 0)
    return {
        '_id': rid(), 'name': nome, 'type': 'arma', 'img': 'icons/svg/sword.svg',
        'system': {'quantidade': 1, 'name': nome, 'dano': resto.rstrip('.'), 'tipo': '', 'pericia': pericia,
                   'conceito': resto, 'ammo': ammo, 'vt': 0, 'peso': 0, 'preco': 0},
        'effects': [], 'folder': None, 'sort': 0, 'ownership': {'default': 0}, 'flags': {}
    }

def ator(nome, img, system, armas, disposicao=-1):
    tamanho = 2 if nome.startswith('Mecha') else 1  # mecha pesado ocupa 2x2
    _id = rid()
    for a in armas:
        a['_key'] = f'!actors.items!{_id}.{a["_id"]}'
    return {
        '_key': f'!actors!{_id}', '_id': _id, 'name': nome, 'type': 'npc', 'img': img,
        'system': system, 'items': [a['_id'] for a in armas], 'effects': [], 'folder': None, 'sort': 0,
        'ownership': {'default': 0}, 'flags': {},
        'prototypeToken': {
            'name': nome, 'displayName': 20, 'actorLink': False, 'disposition': disposicao,
            'displayBars': 0, 'texture': {'src': token_de(img)}, 'width': tamanho, 'height': tamanho, 'lockRotation': True
        },
        '_armas': armas
    }

docs = []
for n in NPCS:
    nome = titulo(n['nome'])
    hab, ponto = [], ''
    for h in n.get('habilidades', []):
        h = limpa(h)
        if h.startswith('Ponto Fraco'):
            ponto = h.split(':', 1)[1].strip() if ':' in h else h
        else:
            hab.append(h)
    for f in n.get('feiticos', []):
        hab.append('Feitiço — ' + limpa(f))
    armas = [arma(a) for a in n.get('ataques', [])]
    for fase in n.get('fases', []):
        hab.append(limpa(fase['titulo']).upper())
        for item in fase['itens']:
            t = limpa(item)
            if ':' in t and re.search(r'\d+d\d+', t.split(':', 1)[-1]) and not t.startswith('Alvos'):
                armas.append(arma(item))
            else:
                hab.append(t)
    notas = [limpa(e) for e in n.get('extra', [])]
    if n.get('nota_teste'): notas.append(limpa(n['nota_teste']))
    notas.append('Uso em mesa: ' + limpa(n['uso']))
    rd = int(re.search(r'(?<!Fase )(?<!\d)\d+', str(n['rd'])).group())
    saude = int(re.search(r'\d+', str(n['saude'])).group())
    system = {
        'tier': n['tier'], 'funcao': n['funcao'], 'lema': limpa(n['lema']),
        'saude': saude, 'saudeMax': saude, 'rd': rd, 'deslocamento': n['desloc'], 'sanidade': 100,
        'atributos': {k: n['atr'][k] for k in ns['SIGLAS']},
        'grupos': {GRUPOS[k]: v for k, v in n['grupos'].items()},
        'destaques': [{'pericia': LABEL2KEY[p], 'valor': v} for p, v in n.get('destaques', []) if p in LABEL2KEY],
        'pontoFraco': ponto, 'habilidades': '\n'.join(hab),
        'equipamento': limpa(n.get('equip', '')), 'notas': '\n'.join(notas) + f"\nRD: {limpa(str(n['rd']))}"
    }
    faltou = [p for p, v in n.get('destaques', []) if p not in LABEL2KEY]
    if faltou: print('perícia sem chave:', nome, faltou)
    disp = 0 if n['tier'] == 0 and n['funcao'] == 'Presença' and 'BANDIDO' not in n['nome'] else -1
    docs.append(ator(nome, imagem(n['nome']), system, armas, disp))

# Panzer-Geist (bloco próprio no suplemento)
pz = [arma('**Canhão Antitanque:** 8d6 concussivo/perfurante, alcance de 50m, área de 6m; 1 turno de recarga entre disparos.'),
      arma('**Metralhadora Gatling Coaxial:** 6d6 perfurante em cone de 21m.'),
      arma('**Aríete Hidráulico:** 7d6+6 concussivo; destrói barricadas, paredes finas e veículos civis.')]
for a in pz: a['system'].update(pericia='armasPesadas', ammo=99)
docs.append(ator('Mecha Tripulado Pesado "Panzer-Geist MK-IV"', imagem('PANZER-GEIST'), {
    'tier': 4, 'funcao': 'Excepcional', 'lema': 'Um gigante bípede de 2,8 metros usado pela guarda pretoriana e pela SS para esmagar insurreições armadas.',
    'saude': 75, 'saudeMax': 75, 'rd': 21, 'deslocamento': '6m', 'sanidade': 100,
    'atributos': {'for': 16, 'des': 12, 'con': 16, 'int': 9, 'sab': 10, 'psi': 8, 'car': 6},
    'grupos': {'penfisica': 50, 'pensociais': 20, 'penmentais': 25, 'pentecnicologica': 40, 'penaquimica': 0, 'penmagica': 0, 'pensobrevivencia': 30},
    'destaques': [{'pericia': 'armasPesadas', 'valor': 60}],
    'pontoFraco': 'Escotilha traseira: subir exige Atletismo −20% e abrir exige Arrombamento −20% (uma ação cada). Aberta, o piloto pode ser atacado normalmente.',
    'habilidades': 'Escala Mecânica: RD 21 contra armas pessoais (BLD 7 × 3) e RD 7 contra armas pesadas, armamento de mecha, explosivos e alquimia de nível 3 ou 4.\n'
                   'VEL 6m · EST 75 · BLD 7 · MOB 2 (−15% na Esquiva) · PRE 4 (+10% nas armas instaladas) · POT 6.\n'
                   'Piloto: Mercenário Veterano da Linha Negra (Tier 2). Saúde = Estrutura (EST).\n'
                   'Colapso: com EST 0 o motor entra em pane e explode em 1d4 turnos: 4d6 em 4m.',
    'equipamento': 'Canhão antitanque, metralhadora Gatling coaxial, aríete hidráulico.',
    'notas': 'Uso em mesa: não pode ser vencido de frente com pistolas e facas. O grupo precisa de emboscadas com explosivos, alquimia de nível 3 ou 4, ou de alguém corajoso o bastante para subir na escotilha.'
}, pz))

# Personagens dos exemplos dos livros (não estão no Suplemento).
# Os números vêm dos exemplos: Vix tem CON 9, Malha Reforçada (RD 12), Saúde 100, Esquiva 20% + DES 20%,
# Furtividade 30%, Arrombamento 12% e Demolições 5%; o guarda atira com Armas de Fogo 35% + DES 15% e pistola 4d6.
# Os retratos ficam em assets/npcs/<base>.webp (gerados à parte).
def extra(nome, base, system, ataques, disposicao):
    img = f'systems/a-nova-ordem/assets/npcs/{base}.webp'
    if not os.path.exists(os.path.join(pasta_img, base + '.webp')):
        img = 'icons/svg/mystery-man.svg'
    docs.append(ator(nome, img, system, [arma(a) for a in ataques], disposicao))

extra('Vix, Infiltradora da Resistência', 'vix', {
    'tier': 2, 'funcao': 'Aliada', 'lema': 'Entra onde ninguém deveria entrar, e quase sempre sai.',
    'saude': 100, 'saudeMax': 100, 'rd': 12, 'deslocamento': '7m', 'sanidade': 100,
    'atributos': {'for': 8, 'des': 20, 'con': 9, 'int': 11, 'sab': 12, 'psi': 10, 'car': 10},
    'grupos': {'penfisica': 30, 'pensociais': 15, 'penmentais': 15, 'pentecnicologica': 20, 'penaquimica': 0, 'penmagica': 0, 'pensobrevivencia': 20},
    'destaques': [{'pericia': 'furtividade', 'valor': 50}, {'pericia': 'esquiva', 'valor': 40}, {'pericia': 'arrombamento', 'valor': 32},
                  {'pericia': 'armasFogo', 'valor': 45}, {'pericia': 'percepcao', 'valor': 40}, {'pericia': 'demolicoes', 'valor': 16},
                  {'pericia': 'resistenciaMental', 'valor': 30}],
    'pontoFraco': '', 'habilidades': 'Sombra: fora de combate, um teste de Furtividade bem-sucedido deixa Vix agir antes de todos na primeira rodada.',
    'equipamento': 'Malha Reforçada (Armadura 3, Leve), pistola leve, faca, gazuas, bolsa com 1 carga de demolição.',
    'notas': 'Personagem dos exemplos do Livro Básico (combate e RD) e do Suplemento (Marcas de Uso e Tempo de Inatividade).\n'
             'Uso em mesa: aliada da Resistência, contato que abre portas ou personagem pronto para um jogador.\nRD: 12 (9 CON + 3 Malha Reforçada)'
}, ['**Pistola Leve:** 4d6 perfurante.', '**Lâmina Curta (faca):** 3d6 cortante.'], 1)

extra('Guarda do Depósito de Munições', 'guarda_deposito', {
    'tier': 1, 'funcao': 'Combatente', 'lema': 'Vigia caixas de munição a noite inteira. Atira primeiro, pergunta depois.',
    'saude': 45, 'saudeMax': 45, 'rd': 12, 'deslocamento': '7m', 'sanidade': 100,
    'atributos': {'for': 9, 'des': 15, 'con': 9, 'int': 7, 'sab': 9, 'psi': 5, 'car': 6},
    'grupos': {'penfisica': 25, 'pensociais': 10, 'penmentais': 10, 'pentecnicologica': 10, 'penaquimica': 0, 'penmagica': 0, 'pensobrevivencia': 20},
    'destaques': [{'pericia': 'armasFogo', 'valor': 50}, {'pericia': 'percepcao', 'valor': 35}, {'pericia': 'esquiva', 'valor': 30},
                  {'pericia': 'briga', 'valor': 30}, {'pericia': 'resistenciaMental', 'valor': 20}],
    'pontoFraco': '', 'habilidades': 'Alarme: com uma ação simples, toca o alarme do depósito; reforços da Força de Segurança chegam em 1d4+1 rodadas.',
    'equipamento': 'Pistola, cassetete, armadura leve, lanterna, apito, molho de chaves do depósito.',
    'notas': 'O guarda do exemplo de combate do Livro Básico (Armas de Fogo 35% + DES 15% = 50%).\n'
             'Uso em mesa: sentinela de instalações militares. Sozinho é pouco perigoso; o problema é o alarme.\nRD: 12 (9 CON + 3 Leve)'
}, ['**Pistola:** 4d6 perfurante.', '**Bastão (cassetete):** 4d6 concussivo.'], -1)

extra('Velho Sapador da Resistência', 'sapador', {
    'tier': 2, 'funcao': 'Aliado', 'lema': 'Explodiu pontes para os dois lados da guerra. Hoje ensina quem ainda tem coragem.',
    'saude': 55, 'saudeMax': 55, 'rd': 9, 'deslocamento': '6m', 'sanidade': 100,
    'atributos': {'for': 9, 'des': 10, 'con': 9, 'int': 14, 'sab': 13, 'psi': 7, 'car': 9},
    'grupos': {'penfisica': 20, 'pensociais': 20, 'penmentais': 25, 'pentecnicologica': 40, 'penaquimica': 0, 'penmagica': 0, 'pensobrevivencia': 30},
    'destaques': [{'pericia': 'demolicoes', 'valor': 75}, {'pericia': 'arrombamento', 'valor': 50}, {'pericia': 'engenharia', 'valor': 55},
                  {'pericia': 'eletronica', 'valor': 45}, {'pericia': 'percepcao', 'valor': 40}, {'pericia': 'resistenciaMental', 'valor': 35}],
    'pontoFraco': '', 'habilidades': 'Mestre de Demolições: ensina Demolições no Tempo de Inatividade (Suplemento) e pode trocar o custo em ¢RD por um serviço.\n'
                                    'Mão firme: desarma uma bomba ou armadilha com uma ação a mais de calma, sem penalidade por pressa.',
    'equipamento': 'Espingarda de cano serrado, 3 bananas de dinamite, alicates, rolos de fio, detonador de manivela.',
    'notas': 'O mentor do exemplo de Tempo de Inatividade do Suplemento, que ensina Demolições a Vix.\n'
             'Uso em mesa: mentor, fornecedor de explosivos e gancho de missão. Não luta se puder evitar.\nRD: 9 (CON)'
}, ['**Espingarda de cano serrado:** 5d6 perfurante, alcance curto.',
    '**Dinamite (3 unidades):** 5d6 em área de 4m.'], 1)

json.dump(docs, open(SAIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for d in docs:
    print(f"{d['name']}: T{d['system']['tier']} saúde {d['system']['saude']} RD {d['system']['rd']} · "
          f"{len(d['system']['destaques'])} destaques · armas: {', '.join(a['name'] + ' [' + a['system']['pericia'] + ']' for a in d['_armas'])}")
