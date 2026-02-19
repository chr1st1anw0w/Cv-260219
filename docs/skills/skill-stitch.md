
# Stitch Skill: Atomic Component Architecture & Tailwind Composition

**Version:** 1.0.0
**Context:** Engineering / Implementation
**Purpose:** To "stitch" together design tokens into robust, reusable, and performant React components.

## 1. Core Principles (Stitch Protocol)

### A. The "Slot" Pattern (Composition)
Avoid monolithic components. Use `children` or explicit slots for flexibility.
- **Bad:** `<Card title=".." image=".." footerBtn=".." />` (Too rigid)
- **Good:** 
  ```tsx
  <Card>
    <Card.Header>...</Card.Header>
    <Card.Body>...</Card.Body>
    <Card.Footer>...</Card.Footer>
  </Card>
  ```

### B. Class Merging (The CN Utility)
ALWAYS use `twMerge` and `clsx` (aliased as `cn`) to allow consumers to override styles without conflict.
```ts
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### C. Prop Interface Standardization
- Extend HTML attributes: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}`
- Use discriminated unions for variants: `variant: 'solid' | 'outline' | 'ghost'`

## 2. Tailwind "Stitching" Patterns

### A. Data-Attribute Styling
Use data attributes for state styling to keep JSX clean.
- `data-[state=active]:bg-primary`
- `data-[orientation=vertical]:flex-col`

### B. Group & Peer Modifiers
Use `group` and `peer` to style children based on parent/sibling state.
- Parent: `group relative ...`
- Child: `opacity-0 group-hover:opacity-100 transition-opacity`

## 3. Implementation Workflow

When receiving a design from **UI/UX Pro Max**:
1.  **Analyze Structure**: Break design into atoms (Button, Badge) and molecules (Card, Navbar).
2.  **Define Variants**: Map Pro Max styles (Glass, Neo) to `cva` (Class Variance Authority) variants.
3.  **Stitch**: Combine logic + accessible HTML + Tailwind classes.
