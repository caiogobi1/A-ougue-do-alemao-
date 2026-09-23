from PIL import Image
import os

img = Image.open("assets/produtos/produtos.jpeg")
os.makedirs("assets/produtos/recortes", exist_ok=True)

# Recortes dos principais produtos.
# Coordenadas baseadas no catálogo 1600x800.
produtos = {
    "acem": (5, 32, 125, 155),
    "contra-file": (128, 32, 248, 155),
    "coxao-mole": (250, 32, 370, 155),
    "coxao-duro": (372, 32, 492, 155),
    "alcatra": (494, 32, 614, 155),
    "picanha": (616, 32, 736, 155),
    "fraldinha": (738, 32, 858, 155),
    "maminha": (860, 32, 980, 155),
    "cupim": (982, 32, 1102, 155),
    "ancho": (1104, 32, 1224, 155),
    "patinho": (1226, 32, 1346, 155),
    "paleta": (1348, 32, 1468, 155),
}

for nome, caixa in produtos.items():
    recorte = img.crop(caixa)
    recorte.save(
        f"assets/produtos/recortes/{nome}.jpg",
        "JPEG",
        quality=90
    )

print(f"Pronto! {len(produtos)} fotos criadas.")
