"""Separa o Suplemento em dois PDFs para o Foundry:

- assets/livros/suplemento.pdf: tudo menos o Bestiário (compêndio "Livro", todos leem);
- assets/livros/bestiario.pdf:  só o Bestiário (compêndio "Livro do Mestre", só o mestre).

O Suplemento completo continua na raiz do sistema.
Uso (na raiz do sistema, depois de regerar o PDF do Suplemento):
    python ferramentas/separar_suplemento.py
"""
import os
import pymupdf

ORIGEM = "Suplemento - A Nova Ordem.pdf"
PASTA = os.path.join("assets", "livros")
os.makedirs(PASTA, exist_ok=True)

base = pymupdf.open(ORIGEM)
# a primeira página do Bestiário começa com o título "BESTIÁRIO"
inicio = next(i for i, p in enumerate(base) if i > 2 and "BESTIÁRIO" in p.get_text())
fim = base.page_count - 1

# Suplemento sem o Bestiário: tira também as linhas dele do sumário
sup = pymupdf.open(ORIGEM)
sumario = sup[1]
apagar = False
for b in sumario.get_text("dict")["blocks"]:
    for l in b.get("lines", []):
        texto = "".join(s["text"] for s in l["spans"])
        if texto.strip().startswith("BESTIÁRIO"):
            apagar = True
        if apagar and "...." in texto:
            sumario.add_redact_annot(pymupdf.Rect(l["bbox"]), fill=(1, 1, 1))
sumario.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE)
sup.delete_pages(from_page=inicio, to_page=fim)
sup.save(os.path.join(PASTA, "suplemento.pdf"), garbage=4, deflate=True)

# Bestiário sozinho
best = pymupdf.open()
best.insert_pdf(base, from_page=inicio, to_page=fim)
best.save(os.path.join(PASTA, "bestiario.pdf"), garbage=4, deflate=True)

print(f"suplemento.pdf: {sup.page_count} páginas | bestiario.pdf: {best.page_count} páginas (a partir da página {inicio + 1})")
