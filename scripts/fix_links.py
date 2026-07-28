import glob

# Fix root links
for f in glob.glob('*.html'):
    with open(f, 'r') as file:
        content = file.read()
    content = content.replace('href="/"', 'href="index.html"')
    with open(f, 'w') as file:
        file.write(content)

# Fix blog links
for f in glob.glob('blog/*.html'):
    with open(f, 'r') as file:
        content = file.read()
    content = content.replace('href="/"', 'href="../index.html"')
    with open(f, 'w') as file:
        file.write(content)

# Fix criterio links
for f in glob.glob('criterio/*.html'):
    with open(f, 'r') as file:
        content = file.read()
    content = content.replace('href="/"', 'href="../index.html"')
    with open(f, 'w') as file:
        file.write(content)

print("Links fixed.")
