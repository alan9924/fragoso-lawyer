import re

with open('/Users/alanfragosorivera/Desktop/FRAGOSO/marcas.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove everything from the first "/* ── ORBIT HERO SECTION ── */" to the end of that style block, for all occurrences.
# We will just remove ALL CSS that looks like "/* ── ORBIT HERO SECTION ── */ ... </style>" except we shouldn't delete </style>.
pattern_css = re.compile(r'/\* ── ORBIT HERO SECTION ── \*/.*?(?=</style>)', re.DOTALL)
content = pattern_css.sub('', content)

# Now inject the NEW CSS right before the first </style> tag.
css = """
        /* ── ORBIT HERO SECTION ── */
        .orbit-hero-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 95%;
            margin: 0 auto 4rem auto;
            padding: 4rem 6rem;
            min-height: 80vh;
            background: #fff;
            border-radius: 3rem;
            box-shadow: 0 20px 80px rgba(0,0,0,0.08);
            border: 1px solid rgba(0,0,0,0.04);
            position: relative;
            overflow: hidden;
            gap: 4rem;
            margin-top: 130px;
        }

        .orbit-hero-left {
            width: 50%;
            z-index: 10;
        }
        .oh-eyebrow {
            font-family: var(--font-body);
            font-size: 0.75rem;
            font-weight: 700;
            color: #b59f72;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 1rem;
            display: block;
        }
        .oh-heading {
            font-family: var(--font-heading);
            font-size: clamp(2.5rem, 4vw, 3.5rem);
            font-weight: 400;
            color: #1a1917;
            line-height: 1.1;
            margin-bottom: 1.5rem;
        }
        .oh-desc {
            font-family: var(--font-body);
            font-size: 1.05rem;
            line-height: 1.6;
            color: #666;
            margin-bottom: 1.5rem;
        }
        .oh-fine-print {
            font-family: var(--font-body);
            font-size: 0.85rem;
            color: #a0a0a0;
            margin-bottom: 2.5rem;
        }
        .oh-actions {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        .oh-btn {
            background: #111;
            color: #fff;
            padding: 1.2rem 2.5rem;
            border-radius: 50px;
            font-family: var(--font-body);
            font-size: 0.85rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-decoration: none;
            transition: background 0.3s;
            white-space: nowrap;
        }
        .oh-btn:hover {
            background: #333;
        }
        .oh-actions-text {
            font-family: var(--font-body);
            font-size: 0.85rem;
            color: #a0a0a0;
            line-height: 1.4;
            max-width: 200px;
        }

        .orbit-hero-right {
            width: 50%;
            height: 600px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            overflow: visible;
        }
        
        .orbit-container {
            position: relative;
            width: 800px;
            height: 800px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translateX(15%);
        }
        
        .orbit-center-icon {
            width: 160px;
            height: 160px;
            background: linear-gradient(135deg, #111 0%, #222 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2), inset 0 0 0 4px rgba(255,255,255,0.1);
            z-index: 10;
            border: 2px solid #b59f72;
            position: relative;
        }
        .orbit-center-icon::before {
            content: "R";
            font-family: var(--font-heading, 'Cormorant Garamond', serif);
            font-size: 5rem;
            font-weight: 500;
            background: linear-gradient(to bottom right, #fcf6e5, #b59f72);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
            margin-top: -5px;
        }
        .orbit-center-icon::after {
            content: '';
            position: absolute;
            top: -12px; right: -12px; bottom: -12px; left: -12px;
            border-radius: 50%;
            border: 1px dashed rgba(181, 159, 114, 0.4);
            animation: spin 20s linear infinite;
        }

        .orbit-track {
            position: absolute;
            border-radius: 50%;
            border: 2px dashed rgba(0,0,0,0.12);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: spin linear infinite;
        }
        
        .orbit-item {
            position: absolute;
            background: #fff;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            color: #555;
            font-size: 1.2rem;
            transform: translate(-50%, -50%);
            animation: spin-reverse linear infinite;
        }

        @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-reverse {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @media (max-width: 1024px) {
            .orbit-hero-section {
                flex-direction: column;
                margin: 100px 1rem 3rem 1rem;
                padding: 3rem 2rem;
                height: auto;
            }
            .orbit-hero-left, .orbit-hero-right {
                width: 100%;
            }
            .orbit-hero-right {
                height: 450px;
                justify-content: center;
                margin-top: 2rem;
            }
            .orbit-container {
                transform: translateX(0);
                width: 450px;
                height: 450px;
            }
        }
        @media (max-width: 600px) {
            .oh-actions {
                flex-direction: column;
                align-items: flex-start;
            }
            .oh-actions-text {
                max-width: 100%;
            }
            .orbit-container {
                transform: scale(0.65);
            }
        }
"""
content = content.replace("</style>", css + "\n    </style>", 1)

with open('/Users/alanfragosorivera/Desktop/FRAGOSO/marcas.html', 'w', encoding='utf-8') as f:
    f.write(content)

