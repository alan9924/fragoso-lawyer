# Guía de Integración: Componente React `CardCurtainReveal`

Esta guía detalla los pasos para configurar tu proyecto e integrar el componente animado de revelación de tarjetas (`CardCurtainReveal`) en un entorno moderno con React, Tailwind CSS, TypeScript y shadcn.

---

## 1. Configuración de Prerrequisitos

Si tu proyecto actual no soporta React, Tailwind CSS o TypeScript, sigue estos pasos para inicializar un nuevo entorno:

### Inicializar proyecto con Vite (React + TypeScript)
Ejecuta el siguiente comando en tu terminal para crear la estructura base:
```bash
npm create vite@latest mi-proyecto-legal -- --template react-ts
cd mi-proyecto-legal
npm install
```

### Configurar Tailwind CSS
1. Instala Tailwind y sus dependencias de post-procesamiento:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
2. Modifica el archivo `tailwind.config.js` para añadir las rutas de tus componentes:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
3. Añade las directivas de Tailwind al inicio de tu archivo de estilos principal (`src/index.css` o `src/global.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 2. Configurar shadcn CLI y la Estructura de Componentes

Es de crítica importancia organizar los componentes en la ruta `/components/ui/` para que la CLI de shadcn y otras bibliotecas de interfaz de usuario puedan localizar y registrar las dependencias de forma consistente sin romper los imports relativos de TypeScript (ej: `@/components/ui/button`).

1. Inicializa shadcn en el proyecto:
```bash
npx shadcn@latest init
```
2. Durante el asistente de configuración, elige usar la ruta `@/components` y `@/lib/utils` como alias base de imports.

---

## 3. Instalar Dependencias de NPM

Instala los módulos requeridos por el componente:
```bash
npm install motion @radix-ui/react-slot class-variance-authority lucide-react clsx tailwind-merge
```

---

## 4. Crear los Componentes en la Carpeta `components/ui/`

### A. Crear `/src/components/ui/button.tsx`
Copia y pega el código base de la dependencia del botón de shadcn:
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### B. Crear `/src/components/ui/card-curtain-reveal.tsx`
Copia y pega el componente principal de revelación por cortina:
```tsx
"use client"

import * as React from "react"
import { HTMLMotionProps, Variants, motion } from "motion/react"

import { cn } from "@/lib/utils"

const curtainVriants: Variants = {
  visible: {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: {
      duration: 0.4,
      ease: ["easeOut", [0.25, 1.5, 0.5, 1]],
    },
  },

  hidden: {
    clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
    transition: {
      duration: 0.3,
      ease: ["easeOut", [0.25, 1.5, 0.5, 1]],
    },
  },
}

interface CardCurtainRevealContextValue {
  isMouseIn: boolean
}
const CardCurtainRevealContext = React.createContext<
  CardCurtainRevealContextValue | undefined
>(undefined)
function useCardCurtainRevealContext() {
  const context = React.useContext(CardCurtainRevealContext)
  if (!context) {
    throw new Error(
      "useCardCurtainRevealContext must be used within a CardCurtainReveal Component"
    )
  }
  return context
}

const CardCurtainReveal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const [isMouseIn, setIsMouseIn] = React.useState(false)
  const handleMouseEnter = React.useCallback(() => setIsMouseIn(true), [])
  const handleMouseLeave = React.useCallback(() => setIsMouseIn(false), [])

  return (
    <CardCurtainRevealContext.Provider value={{ isMouseIn }}>
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col gap-2 overflow-hidden",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </CardCurtainRevealContext.Provider>
  )
})
CardCurtainReveal.displayName = "CardCurtainReveal"

const CardCurtainRevealFooter = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, ...props }, ref) => {
  const { isMouseIn } = useCardCurtainRevealContext()

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={curtainVriants}
      animate={isMouseIn ? "visible" : "hidden"}
      {...props}
    />
  )
})
CardCurtainRevealFooter.displayName = "CardCurtainRevealFooter"

const CardCurtainRevealBody = React.forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex-1 p-6", className)} {...props} />
})
CardCurtainRevealBody.displayName = "CardCurtainRevealBody"

const CardCurtainRevealTitle = React.forwardRef<
  HTMLHeadingElement,
  HTMLMotionProps<"h2">
>(({ className, ...props }, ref) => {
  const { isMouseIn } = useCardCurtainRevealContext()

  return (
    <motion.h2
      ref={ref}
      className={className}
      animate={isMouseIn ? { y: 0 } : { y: 170 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    />
  )
})
CardCurtainRevealTitle.displayName = "CardCurtainRevealTitle"

const CardCurtain = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...props }, ref) => {
    const { isMouseIn } = useCardCurtainRevealContext()

    return (
      <motion.div
        ref={ref}
        className={cn(
          "pointer-events-none absolute inset-0 size-full mix-blend-difference",
          className
        )}
        variants={curtainVriants}
        animate={isMouseIn ? "visible" : "hidden"}
        {...props}
      />
    )
  }
)
CardCurtain.displayName = "CardCurtain"

const CardCurtainRevealDescription = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, ...props }, ref) => {
  const { isMouseIn } = useCardCurtainRevealContext()

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={curtainVriants}
      animate={isMouseIn ? "visible" : "hidden"}
      {...props}
    />
  )
})
CardCurtainRevealDescription.displayName = "CardCurtainRevealDescription"

export {
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealFooter,
  CardCurtainRevealDescription,
  CardCurtainRevealTitle,
  CardCurtain,
}
```

---

## 5. Implementación de Demo

Inserta y renderiza la siguiente demo en tus vistas principales de React para ver el componente funcionando con imágenes de Tokio:

```tsx
import { 
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealDescription,
  CardCurtainRevealFooter,
  CardCurtainRevealTitle,
  CardCurtain 
} from "@/components/ui/card-curtain-reveal"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const CardCurtainRevealDemo = () => {
  return (
    <div className="min-h-screen grid place-content-center bg-zinc-900">
      <CardCurtainReveal className="h-[560px] w-96 border border-zinc-800 bg-zinc-950 text-zinc-50 shadow-2xl rounded-2xl">
        <CardCurtainRevealBody className="relative z-10 flex flex-col justify-between h-full">
          <CardCurtainRevealTitle className="text-3xl font-medium tracking-tight text-white">
            Detrás de la<br />
            Cortina Legal
          </CardCurtainRevealTitle>
          
          <CardCurtainRevealDescription className="my-4 text-zinc-400 text-sm">
            <p>
              Explora nuestra estructura preventiva de blindaje corporativo y marcas.
              Diseñamos soluciones personalizadas que protegen tu propiedad intelectual
              y garantizan la continuidad de tu legado.
            </p>
          </CardCurtainRevealDescription>
          
          <Button
            variant="secondary"
            size="icon"
            className="aspect-square rounded-full self-start bg-zinc-800 text-white hover:bg-zinc-700"
          >
            <ArrowUpRight className="h-5 w-5" />
          </Button>

          <CardCurtain className="bg-zinc-100" />
        </CardCurtainRevealBody>

        <CardCurtainRevealFooter className="mt-auto h-1/2 overflow-hidden">
          <img
            width="100%"
            height="100%"
            alt="Tokyo street"
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2388&auto=format&fit=crop"
          />
        </CardCurtainRevealFooter>
      </CardCurtainReveal>
    </div>
  )
}
```
