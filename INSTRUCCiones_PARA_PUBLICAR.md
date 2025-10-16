# Guía Rápida para Publicar tu App en GitHub

¡No te preocupes! Este proceso es más fácil de lo que parece. Solo necesitas copiar y pegar estos comandos en tu terminal, uno por uno.

**IMPORTANTE:** Reemplaza `TU_URL_DE_GITHUB.git` en el paso 3 con la URL de tu propio repositorio.

---

### Paso 1: Abre tu Terminal

Busca una ventana de terminal en tu entorno de desarrollo.

---

### Paso 2: Copia y Pega los Siguientes Comandos (uno a la vez)

1.  **Inicializa git en tu proyecto:**
    ```bash
    git init
    ```

2.  **Nombra tu rama principal como `main`:**
    ```bash
    git branch -M main
    ```

3.  **Conecta tu proyecto con tu repositorio de GitHub:**
    *(Recuerda cambiar `TU_URL_DE_GITHUB.git` por la tuya)*.
    ```bash
    git remote add origin TU_URL_DE_GITHUB.git
    ```

4.  **Agrega todos tus archivos para prepararlos:**
    ```bash
    git add .
    ```

5.  **Guarda una "foto" de tu código (commit):**
    ```bash
    git commit -m "Versión inicial de la aplicación HiperFlow"
    ```

6.  **Sube todo tu código a GitHub:**
    ```bash
    git push -u origin main
    ```

---

### Paso 3: Finaliza en Firebase

¡Listo! Ahora tu código está en GitHub.

1.  **Vuelve a la página de Firebase App Hosting**.
2.  **Refresca la página**.
3.  Ahora deberías poder seleccionar la rama **`main`** y completar la configuración.

Tu aplicación se publicará automáticamente. ¡Felicidades!
