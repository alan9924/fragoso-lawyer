import os
from PIL import Image

def process_image(filepath):
    print(f"Processing {filepath}")
    img = Image.open(filepath).convert("L")
    pixels = img.load()
    width, height = img.size
    
    new_img = Image.new("RGBA", (width, height))
    new_pixels = new_img.load()
    
    for y in range(height):
        for x in range(width):
            l_val = pixels[x, y]
            
            # Map l_val (0=black, 255=white) to alpha (255=solid, 0=transparent)
            if l_val > 150:
                alpha = 0
            elif l_val < 60:
                alpha = 255
            else:
                # Anti-aliasing interpolation
                # l_val from 60 to 150 -> alpha from 255 to 0
                alpha = int(255 * (1.0 - (l_val - 60) / 90.0))
            
            new_pixels[x, y] = (255, 255, 255, alpha)
            
    new_img.save(filepath, "PNG")
    print(f"Saved {filepath}")

images = [
    "icon_trademark.png",
    "icon_company.png",
    "icon_finiquito.png",
    "icon_contracts_doc_only.png"
]

for img_name in images:
    if os.path.exists(img_name):
        process_image(img_name)
    else:
        print(f"Not found: {img_name}")
