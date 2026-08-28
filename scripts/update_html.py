with open('secreto-industrial.html', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<style>' in line and '.ff-folder-graphic {' in lines[i+1] if i+1 < len(lines) else False:
        start_idx = i
    if '<span class="da-eyebrow">El riesgo silencioso</span>' in line:
        end_idx = i

if start_idx != -1 and end_idx != -1:
    img_html = '                    <img src="secret_warning_hand.png" alt="Secreto Industrial - Alerta" style="width: 100%; max-width: 450px; display: block; margin: 0 auto 2.5rem; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.15);">\n'
    lines = lines[:start_idx] + [img_html] + lines[end_idx:]
    with open('secreto-industrial.html', 'w') as f:
        f.writelines(lines)
    print("Success")
else:
    print("Failed to find boundaries", start_idx, end_idx)
