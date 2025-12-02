```typescript
const layoutPromptTemplate = (designContext: string, codeConnectMap: string) => `
Actúa como un asistente de design-to-code especializado en React Native (TypeScript).

Tienes este contexto de diseño de Figma (JSON):
\`\`\`json
${designContext}
\`\`\`

Y este Code Connect map (JSON):
\`\`\`json
${codeConnectMap}
\`\`\`

Tarea:
1. Genera SOLO el layout de pantalla como React Native (TSX).
2. Usa una grilla donde cada celda tenga:
   - Un rectángulo con borde de líneas punteadas.
   - Dentro, SOLO el nombre del componente que debe ir (por ejemplo: <UserCardPlaceholder />).
3. NO implementes los componentes reales, solo placeholders.
4. Usa estilos inline o StyleSheet, pero mantén el foco en el layout.

Formato de salida:
- Devuelve SOLO el código TSX, dentro de un bloque \`\`\`tsx ... \`\`\`.
`.trim();
```