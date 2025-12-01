Quiero que generes **solo código React Native**, sin explicaciones, basado en mi selección actual en Figma.

Sigue este flujo:

1. Llama a **get_metadata** para entender la estructura general del layout: jerarquía, frames, grupos, ids y relaciones padre-hijo.

2. Identifica los nodos clave (cada caja, frame o sección del layout).

3. Llama únicamente a **get_design_context** sobre esos nodos clave para obtener paddings, autolayout, flex direction, tamaños, spacing, colores y tipografía.

4. Con esa información genera un layout React Native fiel al diseño original, aplicando estas reglas globales:

   * **Fondo general negro (#000000).**
   * **Todos los bordes en color verde (#00FF00).**
   * **Dentro de cada caja, renderiza el nombre del componente en texto rojo (#FF0000).**

5. Mantén la jerarquía exacta del diseño.

6. Devuelve exclusivamente el código final en React Native, sin comentarios ni explicaciones.

Comienza llamando a **get_metadata**.
