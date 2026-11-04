# Dieselpunk — A Nova Ordem

> Sistema de RPG para [FoundryVTT](https://foundryvtt.com/) · Versão `0.5.0` · Funcional e jogável

Um sistema percentual de RPG ambientado em um mundo dieselpunk alternativo, onde o Eixo venceu a Segunda Guerra Mundial. O ano é 1975. Três impérios totalitários dividem o planeta — e você é um Libertário operando nas sombras, tentando mudar o curso da história.

---

## Sumário

- [O Mundo](#o-mundo)
- [Mecânicas Principais](#mecânicas-principais)
- [Tipos de Itens Suportados](#tipos-de-itens-suportados)
- [Recursos do Sistema no Foundry](#recursos-do-sistema-no-foundry)
- [Módulos Recomendados](#módulos-recomendados)
- [Como Instalar no FoundryVTT](#como-instalar-no-foundryvtt)
- [Compêndio de Itens](#compêndio-de-itens-opcional)
- [Regras Completas](#regras-completas)
- [Créditos](#créditos) · [Licença](#licença)

---

## O Mundo

Em 1945, Hitler lançou o **Projeto Titã** — uma arma sobrenatural que massacrou as forças Aliadas. Em 1946, o mundo foi dividido em três impérios:

| Império | Líder | Território |
|---------|-------|------------|
| **Grande Reich da Supremacia Ariana** | Führer Adolf Hitler | Europa, América do Norte, Canadá |
| **Império da Ordem Asiática** | Imperador Hirohito | Ásia Oriental, Sudeste Asiático, Oriente Médio |
| **Império de Romanova** | Imperatore Benito Mussolini | Sul da Europa, América do Sul, Norte da África |

Os jogadores são **Libertários** — rebeldes que atuam nas sombras destes regimes, enfrentando tecnologia avançada, alquimia, implantes cibernéticos e magia enquanto lutam pela resistência.

---

## Mecânicas Principais

### Sistema de Testes — d100
Todas as ações são resolvidas com **1d100** comparado a uma dificuldade alvo:

| Resultado | Efeito |
|-----------|--------|
| 01–04 | **Sucesso Crítico** — dano dobrado, efeito máximo |
| ≤ Dificuldade | **Sucesso** |
| > Dificuldade | **Falha** |
| 96–100 | **Falha Crítica** — consequências graves |

**Fórmula:** `Perícia (%) + Atributo (%) + Modificadores = Dificuldade Alvo`

### Atributos

| Sigla | Nome | Usos principais |
|-------|------|-----------------|
| FOR | Força | Corpo-a-corpo, bônus de dano físico |
| DES | Destreza | Precisão, agilidade, esquiva, furtividade |
| CON | Constituição | Redução de Dano base, resistência física |
| INT | Inteligência | Perícias técnicas, alquimia, conhecimento |
| SAB | Sabedoria | Percepção, intuição, sobrevivência |
| PSI | Psique | Magia, rituais, essência, resistência mental |
| CAR | Carisma | Influência social, liderança, performance |

### Perícias (37 no total)

Distribuídas em 7 categorias com **250 pontos base** para alocação:

- **Físicas (12):** Atletismo, Briga, Armas Brancas, Armas de Fogo, Armas Pesadas, Esquiva, Furtividade, Direção, Pilotagem, Arrombamento, Prestidigitação, Resistência Física
- **Sociais (7):** Persuasão, Intimidação, Enganação, Leitura Social, Etiqueta, Manha, Performance
- **Mentais (5):** Análise, Finanças, Linguística, Ocultismo, Acadêmicos
- **Tecnológicas (5):** Engenharia, Cibernética, Demolições, Eletrônica, Armas Experimentais
- **Alquimia (3):** Alquimia, Pedras de Energia, Mutagênese
- **Mágicas (3):** Feitiçaria, Rituais, Resistência Mental
- **Sobrevivência (5):** Percepção, Sobrevivência, Rastreamento, Medicina, Trato com Animais

### Recursos do Personagem

**Saúde (100 pts)**
| Estado | Saúde | Penalidade em todas as perícias |
|--------|-------|--------------------------------|
| Operacional | 76–100 | Nenhuma |
| Ferido | 51–75 | –5% |
| Gravemente Ferido | 26–50 | –10% |
| À Beira do Colapso | 3–25 | –15% |
| Incapacitado | 1–2 | –20% |
| Morto | 0 | — |

**Sanidade (100 pts)** — degrada permanentemente. Não pode ser recuperada; apenas suprimida temporariamente com psicotrópicos.

**Essência** = PSI × 2 — energia vital para magia e rituais. Implantes cibernéticos a reduzem permanentemente. Em 0%, o personagem morre.

**Redução de Dano (RD)** = CON + Armadura equipada. Toda ação bem-sucedida causa mínimo 1 de dano.

### Tipos de Dano

- **Físico** — força mecânica, armas de fogo e corpo-a-corpo
- **Alquímico** — pedras catalisadas; ignora metade de armaduras não especializadas
- **Mental** — feitiços e rituais; causa perda de Sanidade

---

## Tipos de Itens Suportados

| Tipo | Descrição |
|------|-----------|
| Arma | Armas corpo-a-corpo e de fogo |
| Armadura | Proteção física (Leve → Guerra) |
| Implante | Cibernético; reduz Essência permanentemente |
| Mecha | Armaduras mecânicas avançadas |
| Veículo | Veículos terrestres, aéreos e marítimos |
| Magia | Feitiços por círculo de poder |
| Ritual | Rituais mágicos de alto custo |
| Alquimia / Alquímico | Compostos alquímicos |
| Drogas | Substâncias com efeitos mecânicos |
| Ácidos / Venenos / Injeções | Substâncias especiais de combate |
| Elixires / Mutagênicos | Compostos de transformação |
| Items | Itens gerais de equipamento |

### Itens que alteram a ficha

Os valores abaixo são **calculados automaticamente** a partir dos itens na ficha — ao remover o item, a ficha volta ao normal:

| Valor | Cálculo |
|-------|---------|
| **RD** | CON + armaduras **equipadas** + bônus de RD de itens (ex.: Placas Subdérmicas) |
| **Peso/Unit** | Soma do peso de todos os itens |
| **Essência máxima** | PSI × 2, reduzida pelo dreno (%) dos implantes |
| **Deslocamento** | 7m + armadura + estado de Saúde + itens (ex.: Pernas de Pistão) |
| **Atributos / Perícias** | Valor da ficha + modificadores de implantes, mutagênicos e consumíveis ativos |
| **Penalidades** | Saúde + armadura (testes físicos) + Estado Mental (Mentais/Sociais) + itens |

- **Armaduras:** só contam quando marcadas como *Equipada*. Armaduras da mesma categoria somam RD com penalidade proporcional (2 Leves = Média); categorias diferentes acumulam e dobram as penalidades.
- **Consumíveis** (elixires, injeções, drogas): só valem quando marcados como *Ativo*. Com duração definida, contam nos turnos do próprio personagem no combate e se desligam sozinhos ao terminar.
- **Dreno de Essência:** em 30% ou menos, Resistência Mental −20%; em 20% ou menos, CAR e Perícias Sociais pela metade.
- Os modificadores de cada item são editados na própria ficha do item, em *Modificadores na ficha*. O mestre ainda pode usar os campos de *Ajuste* para RD, Essência e Deslocamento.

## Recursos do Sistema no Foundry

| Recurso | Como usar |
|---------|-----------|
| **Ficha automática** | RD, peso, Essência, deslocamento, atributos, perícias e penalidades são calculados a partir dos itens (veja [Itens que alteram a ficha](#itens-que-alteram-a-ficha)). |
| **Rolagens** | Clique no atributo ou na perícia. Perícias com dois atributos perguntam qual usar. Crítico em 01–04, falha crítica em 96–100. |
| **Ataque automático** | O botão de dano da arma rola a **perícia da arma** (Armas de Fogo, Brancas, Pesadas… escolhida na ficha da arma ou deduzida pelo nome), o alvo marcado pode **esquivar** e o dano entra já descontando a RD (mínimo 1). Crítico dobra os dados; armas de disparo e arremesso gastam 1 de munição por ataque (Armas Brancas e Briga não gastam). Com alvo marcado, o cartão mostra quem está sendo atacado. Se o jogador não é dono do alvo, o mestre conectado aplica. |
| **Automação de Combate** | *Configurações → Configurar Sistema → Automação de Combate* (só o mestre): liga/desliga tudo, o teste de ataque, a esquiva (sem esquiva / botão para o dono do alvo / automática), a aplicação do dano (automática / botão), o gasto de munição e o crítico. Pode ser mudada no meio da sessão. |
| **Dano e cura pelo chat** | Os botões − / + dos cartões aplicam no token selecionado (ou no alvo marcado): o − desconta a RD; o estado de Saúde e as penalidades são atualizados. |
| **NPC / Ameaça** | Tipo de ator próprio, com ficha compacta no formato do Suplemento: Tier, função, Valor de Ameaça, Saúde em pontos (o estado é calculado pela porcentagem), RD, atributos, Grupos de Perícias e perícias em destaque com a chance já somada. Armas arrastadas para a ficha atacam com o mesmo fluxo dos personagens. |
| **Painel do Mestre** | Botão de torre nos controles de token (só o mestre). Lista ameaças e personagens da cena com barra de Saúde, estado e RD; dano/cura rápidos, marcar alvo, ocultar token, abrir ficha e pôr todos no combate. Calcula o **orçamento de encontro** (experiência do grupo × personagens) e mostra se a cena está Fácil, Normal, Difícil ou Mortal. |
| **Sanidade no chat** | Toda mudança de Sanidade anuncia o Estado Mental do personagem, sem mostrar o número. |
| **Consumíveis com duração** | Elixires, injeções e drogas marcados como *Ativo* contam turnos no combate (só no turno do próprio personagem) e se desligam sozinhos. |
| **Catálogo de Itens** | `Ctrl+Espaço`, a lupa **Catálogo** no topo da ficha ou o botão na aba Itens. Busca em todos os compêndios e itens do mundo, com filtro por categoria, fonte, preço e peso. Clique no nome para abrir; botões para mostrar no chat ou adicionar à ficha; também dá para arrastar. Itens consumíveis iguais viram pilha (quantidade). |
| **Quantidade** | Todo item tem *Qtd.* no topo da sua ficha. O peso é multiplicado pela quantidade e a ficha mostra `×N` ao lado do nome. |
| **Criador de Personagem** | Botão **Criador** no topo da ficha (abre sozinho quando um jogador cria um personagem). Passo a passo do manual: dados, atributos em 3d6 ×7 distribuídos à vontade e 250 pontos de perícia somados aos valores base. As rolagens vão para o chat; rolar de novo só se o mestre liberar (botão no chat ou no criador). Ao concluir, Saúde e Sanidade vão a 100 e Essência a PSI × 2. |
| **Item Piles** | Com o módulo ativo, saques, baús e lojas funcionam com o sistema: quantidade em `system.quantidade`, preço em `system.preco` e dinheiro no ¢RD da ficha. Magias, rituais, técnicas alquímicas e implantes não entram em pilhas. |
| **Animações** | Com o Automated Animations ativo, armas, alquímicos e consumíveis tocam animação (veja abaixo). |

**Configurações do mundo** (*Configurações → Configurar Sistema*): jogadores podem ou não adicionar itens pelo Catálogo; abrir o Criador sozinho; teto de perícia na criação (0 = sem teto, regra do livro).

### Animações

Com o módulo **[Automated Animations](https://foundryvtt.com/packages/autoanimations)** ativo (e suas dependências *Sequencer*, *socketlib* e um pacote JB2A), o sistema toca a animação ao rolar dano de armas e alquímicos e ao ativar consumíveis. A animação é escolhida pelo **nome do item** no menu *Global Automatic Recognition* do Automated Animations — cadastre lá os nomes em português (ex.: "Pistola", "Lâmina", "Voltaic"). O módulo *Automated Animations For All* não é necessário.

---


---

## Módulos Recomendados

O sistema funciona sem nenhum módulo. Os abaixo foram integrados ou testados com ele e aparecem como *recomendados* ao instalar o sistema:

| Módulo | Para quê | Situação |
|--------|----------|----------|
| [Item Piles](https://foundryvtt.com/packages/item-piles) | Saque, baús, lojas e troca entre jogadores usando ¢RD | Integração nativa (desde a v0.4.0) |
| [Automated Animations](https://foundryvtt.com/packages/autoanimations) | Animações de armas, alquímicos e consumíveis | Integrado (v0.3.1) |
| [Sequencer](https://foundryvtt.com/packages/sequencer) e [socketlib](https://foundryvtt.com/packages/socketlib) | Dependências do Automated Animations | — |
| [JB2A (gratuito)](https://foundryvtt.com/packages/JB2A_DnD5e) | Pacote de animações usado pelo Automated Animations | — |
| [Dice So Nice!](https://foundryvtt.com/packages/dice-so-nice) | Dados 3D nas rolagens | Opcional, funciona com qualquer sistema |

**Não são necessários** (o sistema já faz de forma nativa ou não são compatíveis): *Compendium Browser* (use o Catálogo), *Plutonium* (use o Criador de Personagem), *Midi-QOL* e módulos de condições do D&D 5e (só funcionam no dnd5e), *Automated Animations For All*.

---

## Como Instalar no FoundryVTT

1. Copie a pasta `a-nova-ordem` para o diretório `Data/systems/` da sua instalação do FoundryVTT
2. Reinicie o FoundryVTT
3. Ao criar um novo Mundo, selecione **"A Nova Ordem"** como sistema de jogo

---

## Compêndio de Itens (opcional)

O arquivo **`compedium.rar`** contém uma coleção de itens prontos (armas, armaduras, alquímicos, implantes, etc.) para usar no seu mundo. As imagens dos itens já vêm com o sistema, em `assets/itens`.

O conteúdo do `.rar` corresponde à pasta `packs` do mundo. Para instalar:

1. Extraia o arquivo `compedium.rar`
2. Copie o conteúdo extraído para `Data/worlds/<nome-do-seu-mundo>/packs/`

> **Atenção:** Se o seu mundo já possui uma pasta `packs` com conteúdo próprio, **não substitua a pasta inteira** — copie apenas os arquivos novos para dentro dela, para não perder itens que você já tenha criado.

---

## Regras Completas

As regras completas do sistema estão disponíveis no arquivo **`Dieselpunk - A Nova Ordem.pdf`** incluído neste repositório.

---

## Status do Projeto

> **Versão `0.5.0` — Funcional e jogável**
> O sistema está em desenvolvimento contínuo e pode receber melhorias. Críticas, comentários e sugestões são bem-vindos.

---

## Créditos

| Papel | Nome |
|-------|------|
| **Criador & Designer do Sistema** | Alê Gomes |
| **Programador (FoundryVTT)** | NeaN World |

---

## Licença

Este projeto está licenciado sob a **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

Você pode usar, adaptar e redistribuir este material **desde que**:
- Dê crédito a **Alê Gomes** (Designer) e **NeaN World** (Programador)
- **Não utilize para fins comerciais** sem autorização
- Distribua obras derivadas sob a **mesma licença**

Veja o arquivo [LICENSE](LICENSE) para o texto completo.
