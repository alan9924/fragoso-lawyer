from PIL import Image, ImageFilter

# Open the image
img = Image.open('lamp_document_line_art.png')

# Upscale by 2x using Lanczos (high quality)
new_size = (img.size[0] * 2, img.size[1] * 2)
img_upscaled = img.resize(new_size, Image.Resampling.LANCZOS)

# Apply a subtle unsharp mask to make the lines crisper without making them jagged
img_sharpened = img_upscaled.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))

# Save the improved image, replacing the original
img_sharpened.save('lamp_document_line_art.png', format="PNG")
