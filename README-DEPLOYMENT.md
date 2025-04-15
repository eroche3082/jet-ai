# JET AI - Instrucciones de Despliegue

Este documento proporciona instrucciones para implementar la aplicación JET AI en Firebase Hosting.

## Prerrequisitos

Antes de iniciar el proceso de despliegue, asegúrate de tener:

1. Acceso al proyecto de Firebase `erudite-creek-431302-q3`
2. Firebase CLI instalado (`npm install -g firebase-tools` o utilizar el instalado en el proyecto)
3. Acceso a las credenciales necesarias para JET AI

## Proceso de Despliegue Automático

Hemos creado un script automatizado para facilitar el despliegue. Sigue estos pasos:

1. Asegúrate de estar en el directorio raíz del proyecto JET AI
2. Otorga permisos de ejecución al script de despliegue si aún no los tiene:
   ```bash
   chmod +x scripts/deploy.sh
   ```
3. Ejecuta el script de despliegue:
   ```bash
   ./scripts/deploy.sh
   ```

El script realizará lo siguiente:
- Verificación de ajustes pre-despliegue
- Configuración del proyecto Firebase correcto
- Configuración del target de hosting para JetAI
- Generación del build de producción
- Despliegue a Firebase Hosting

## Proceso de Despliegue Manual

Si prefieres realizar el despliegue manualmente, sigue estos pasos:

1. Cambia al directorio del proyecto JET AI
   ```bash
   cd /ruta/a/jetai
   ```

2. Usa el proyecto correcto en Firebase
   ```bash
   firebase use erudite-creek-431302-q3
   ```

3. Apunta el target de hosting para JetAI
   ```bash
   firebase target:apply hosting jetai jetai
   ```

4. Genera el build de producción
   ```bash
   npm run build
   ```

5. Haz el deploy exclusivamente del sitio JetAI
   ```bash
   firebase deploy --only hosting:jetai
   ```

## Verificación Post-Despliegue

Una vez completado el despliegue, puedes ejecutar el script de verificación para confirmar que todo está funcionando correctamente:

```bash
node scripts/verify-deployment.js
```

Este script verificará que la aplicación es accesible en `https://jetai.socialbrands.ai` y que todos los componentes clave están presentes.

## Resolución de Problemas

Si encuentras problemas durante el despliegue:

1. Verifica que los archivos `.firebaserc` y `firebase.json` estén correctamente configurados
2. Asegúrate de tener permisos adecuados en el proyecto Firebase
3. Revisa los registros de errores de Firebase
4. Ejecuta `firebase login` para verificar que has iniciado sesión con la cuenta correcta

## Notas de Seguridad

Recuerda que las claves API sensibles y credenciales no deben incluirse en el código fuente, sino configurarse como secretos en Firebase. Si encuentras problemas relacionados con credenciales, contacta al administrador del proyecto.