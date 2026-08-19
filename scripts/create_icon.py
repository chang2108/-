from pathlib import Path

from PIL import Image, ImageDraw


def build_icon() -> None:
    root = Path(__file__).resolve().parents[1]
    assets = root / "assets"
    assets.mkdir(exist_ok=True)

    size = 256
    image = Image.new("RGBA", (size, size), (9, 13, 20, 255))
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle(
        (19, 19, size - 19, size - 19),
        radius=50,
        fill=(18, 25, 36, 255),
        outline=(255, 79, 95, 255),
        width=8,
    )
    draw.rounded_rectangle(
        (35, 35, size - 35, size - 35),
        radius=37,
        outline=(255, 79, 95, 42),
        width=3,
    )

    center = size // 2
    color = (255, 79, 95, 255)
    shadow = (255, 79, 95, 45)

    draw.ellipse((center - 25, center - 25, center + 25, center + 25), fill=shadow)
    draw.rectangle((47, center - 7, 98, center + 7), fill=color)
    draw.rectangle((158, center - 7, 209, center + 7), fill=color)
    draw.rectangle((center - 7, 47, center + 7, 98), fill=color)
    draw.rectangle((center - 7, 158, center + 7, 209), fill=color)
    draw.ellipse((center - 9, center - 9, center + 9, center + 9), fill=color)

    png_path = assets / "icon.png"
    ico_path = assets / "icon.ico"
    image.save(png_path)
    image.save(ico_path, sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


if __name__ == "__main__":
    build_icon()

