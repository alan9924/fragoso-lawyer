from PIL import Image
import os

img = Image.open('bento_icons_art.png')
w, h = img.size
cw = w // 3
ch = h // 3

# We will crop slightly inwards to remove the cream background padding if any.
# Let's just do an exact 1/3 cut first.
for i in range(3):
    for j in range(3):
        left = j * cw
        upper = i * ch
        right = left + cw
        lower = upper + ch
        
        # Crop the grid cell
        cell = img.crop((left, upper, right, lower))
        
        # To remove the gap/padding, we can crop the center of the cell
        # The cells seem to have some padding. Let's crop 5% from all sides
        px = int(cw * 0.05)
        py = int(ch * 0.05)
        cell = cell.crop((px, py, cw - px, ch - py))
        
        cell.save(f'icon_{i}_{j}.png')

