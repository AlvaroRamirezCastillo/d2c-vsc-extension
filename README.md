```typescript
// authGithub.ts
import type { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name?: string;
  email?: string;
  // ...otros campos que quieras usar
}

export async function githubAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Falta token de GitHub' });
    }

    const token = authHeader.substring('Bearer '.length);

    // 1) Llamar a /user para saber quién es
    const userResp = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    if (userResp.status === 401) {
      return res.status(401).json({ error: 'Token de GitHub inválido o expirado' });
    }
    if (!userResp.ok) {
      console.error('Error al llamar a /user:', userResp.status, await userResp.text());
      return res.status(500).json({ error: 'Error verificando token con GitHub' });
    }

    const user = (await userResp.json()) as GithubUser;

    // Opcional: comprobar organización
    const org = process.env.GITHUB_REQUIRED_ORG; // ej: "mi-org"
    let isOrgMember = true;

    if (org) {
      const orgResp = await fetch(`https://api.github.com/user/memberships/orgs/${org}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
        },
      });

      if (orgResp.status === 404) {
        isOrgMember = false; // no es miembro
      } else if (!orgResp.ok) {
        console.error('Error al comprobar org:', orgResp.status, await orgResp.text());
        return res.status(500).json({ error: 'Error comprobando organización en GitHub' });
      }
    }

    if (org && !isOrgMember) {
      return res.status(403).json({ error: 'Usuario no pertenece a la organización requerida' });
    }

    // 2) Guardar info en req para el resto de la API
    (req as any).githubUser = user;          // login, id, etc.
    (req as any).githubAccessToken = token;  // opcional, si luego quieres usarlo

    return next();
  } catch (err) {
    console.error('Error githubAuthMiddleware:', err);
    return res.status(500).json({ error: 'Error interno autenticando con GitHub' });
  }
}

```