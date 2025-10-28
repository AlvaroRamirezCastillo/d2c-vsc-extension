export const buildPrompt = ({ codeConnectMap, designContext }: { designContext: any, codeConnectMap: any }) => {
  return `
Contexto del diseño:
${JSON.stringify(designContext)}

Mapa de Code Connect (usa estos imports):
${JSON.stringify(codeConnectMap)}

Reglas:
- Reutiliza componentes importando desde su ruta.
- Usa StyleSheet.create para estilos.
- Respeta props como "label", "value", "onPress", etc.
- No generes código redundante ni componentes repetidos.
- Estructura el código con un componente funcional y export default.
`;
};
