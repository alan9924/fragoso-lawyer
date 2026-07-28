import os
from PIL import Image

artifact_dir = "/Users/alanfragosorivera/.gemini/antigravity-ide/brain/5fc32ac4-2a06-4daf-85c4-68935eaee3a2"
repo_dir = "/Users/alanfragosorivera/Desktop/FRAGOSO"

def make_white_transparent(img_path, output_path):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return
        
    img = Image.open(img_path)
    img = img.convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If the pixel is mostly white (e.g., RGB > 240)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0)) # transparent
        else:
            # Leave the black lines opaque
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed: {output_path}")

# Find all generated pngs in artifact dir
images = [f for f in os.listdir(artifact_dir) if f.startswith("icon_") and f.endswith(".png")]
for img in images:
    # Use the prefix like 'icon_ip' as the final name
    base_name = img.split('_17')[0] + ".png"
    input_path = os.path.join(artifact_dir, img)
    output_path = os.path.join(repo_dir, base_name)
    make_white_transparent(input_path, output_path)

print("Icons processed and saved to repo directory.")
