# Dieselpunk — A Nova Ordem

> Sistema de RPG para [FoundryVTT](https://foundryvtt.com/) · Versão `0.3.1` · Em desenvolvimento

Um sistema percentual de RPG ambientado em um mundo dieselpunk alternativo, onde o Eixo venceu a Segunda Guerra Mundial. O ano é 1975. Três impérios totalitários dividem o planeta — e você é um Libertário operando nas sombras, tentando mudar o curso da história.

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
| Estado | Saúde | Penalidade |
|--------|-------|------------|
| Operacional | 76–100 | Nenhuma |
| Ferido | 51–75 | –10% |
| Gravemente Ferido | 26–50 | –10% |
| À Beira do Colapso | 2–25 | –10% |
| Incapacitado | 1 | –70% |
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

---

## Como Instalar no FoundryVTT

1. Copie a pasta `a-nova-ordem` para o diretório `Data/systems/` da sua instalação do FoundryVTT
2. Reinicie o FoundryVTT
3. Ao criar um novo Mundo, selecione **"A Nova Ordem"** como sistema de jogo

---

## Regras Completas

As regras completas do sistema estão disponíveis no arquivo **`Dieselpunk - A Nova Ordem.pdf`** incluído neste repositório.

---

## Status do Projeto

> **Versão `0.3.1` — Em desenvolvimento ativo**
> O sistema está sujeito a alterações. Críticas, comentários e sugestões são bem-vindos.

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
