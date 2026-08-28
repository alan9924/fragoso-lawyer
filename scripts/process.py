from PIL import Image

img = Image.open('lamp_document_line_art.png').convert('L')

def calculate_alpha(pixel_val):
    # Background is ~242. Map 242 to 0, 0 to 255
    alpha = (242 - pixel_val) * (255.0 / 242.0)
    if alpha < 0: alpha = 0
    if alpha > 255: alpha = 255
    return int(alpha)

alpha_img = img.point(calculate_alpha)

# Create a solid color image for RGB
out = Image.new('RGBA', img.size, (47, 45, 44, 255))
out.putalpha(alpha_img)
out.save('lamp_document_line_art.png')
