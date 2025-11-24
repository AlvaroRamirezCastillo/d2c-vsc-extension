const prompt = `
REGLAS ESPECÍFICAS DE GENERACIÓN DE CÓDIGO (MUY IMPORTANTE)

1. STYLE PRODUCTION
- Todos los estilos deben crearse exclusivamente con StyleSheet.create.
- No uses estilos inline bajo ninguna circunstancia.
- No uses librerías externas de estilos.
- Usa únicamente los valores reales que provienen de <design_context> y <variable_defs>.
- Si falta un valor (color, spacing, radius, fontSize), NO inventes uno; pídelo explícitamente.

2. PROPS (NO ALUCINAR)
- No inventes props.
- Usa estrictamente los props que aparecen en <code_connect_map> si el componente está conectado.
- Si el componente existe en Code Connect:
     ✔ Usa EXACTAMENTE su nombre.
     ✔ Usa EXACTAMENTE su import path.
     ✔ Usa SOLAMENTE los props definidos para ese componente.
     ✔ No agregues props nuevos.
     ✔ No cambies los nombres de los props.
- Si el componente NO existe en Code Connect:
     ✔ Debes crear uno nuevo desde cero.
     ✔ Define sus props únicamente usando lo que aparezca en <design_context>.
     ✔ No inventes props hipotéticos ni genéricos.
     ✔ Los nombres de props deben derivarse exclusivamente del diseño.

3. TODO EN UN SOLO ARCHIVO
- Cuando generes un componente nuevo (si no hay Code Connect), el resultado debe ser un único archivo TSX:
     • El componente React Native funcional.
     • La interface de props.
     • El StyleSheet.create con todos los estilos.
- No dividas el output en múltiples archivos.
- No uses imports a otros componentes salvo que aparezcan en <code_connect_map>.

4. REGLA DE CODE CONNECT
- Si <code_connect_map> contiene un nodo mapeado:
     • Usa ese componente.
     • No re-implementes el componente.
     • No crees un duplicado local.
- Si el nodo NO aparece en <code_connect_map>:
     • Genera un componente React Native + TypeScript completamente nuevo.
     • Sin librerías externas.
     • Completamente tipado.
     • Fiel al diseño.
     • Con StyleSheet.create.

5. ESTRUCTURA DEL CÓDIGO GENERADO
El archivo final debe seguir este orden:

1) imports necesarios (React, React Native, y componentes de Code Connect si aplica)
2) interface Props { ... }
3) const Componente = (props: Props) => { ... }
4) const styles = StyleSheet.create({ ... });
5) export default Componente;

6. REGLA DE NO ALUCINACIÓN (100% ESTRICTA)
- Nunca inventes colores.
- Nunca inventes tamaños.
- Nunca inventes componentes.
- Nunca inventes tokens.
- Nunca inventes props.
- Nunca inventes imports.
- Usa solo lo que venga dentro de los bloques:
   <design_context>...</design_context>
   <variable_defs>...</variable_defs>
   <code_connect_map>...</code_connect_map>
   <metadata>...</metadata>

7. OBJETIVO FINAL
Generar el código TSX del componente React Native:
- 100% fiel al diseño,
- 0% alucinaciones,
- totalmente tipado,
- usando StyleSheet.create,
- reutilizando Code Connect cuando exista,
- creando el componente cuando no exista,
- y todo dentro de un único archivo TSX.

`