import { Request, Response } from 'express';
import { avatarService } from '../lib/avatarService';

// Handler para obtener configuración
export const getAvatarConfigHandler = async (req: Request, res: Response) => {
  try {
    const config = avatarService.getConfig();
    res.json({ success: true, config });
  } catch (error) {
    console.error('Error getting avatar configuration:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// Handler para actualizar configuración
export const updateAvatarConfigHandler = async (req: Request, res: Response) => {
  try {
    const { apiKeys, settings, enabledAvatarIds } = req.body;
    
    const success = avatarService.updateConfig({ 
      apiKeys, 
      settings, 
      enabledAvatarIds 
    });
    
    if (success) {
      res.json({ success: true, message: 'Configuración actualizada con éxito' });
    } else {
      res.status(500).json({ success: false, error: 'Error al actualizar la configuración' });
    }
  } catch (error) {
    console.error('Error updating avatar configuration:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// Handler para obtener avatares
export const getAvatarsHandler = async (req: Request, res: Response) => {
  try {
    const avatars = await avatarService.getAvatars();
    res.json({ success: true, avatars });
  } catch (error) {
    console.error('Error getting avatars:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// Configuración de middlewares para los endpoints
export const configureRoutes = (app: any) => {
  // Endpoint para obtener configuración
  app.get('/api/avatar/config', getAvatarConfigHandler);
  
  // Endpoint para actualizar configuración
  app.post('/api/avatar/config', updateAvatarConfigHandler);
  
  // Endpoint para obtener avatares
  app.get('/api/avatar/list', getAvatarsHandler);

  console.log('Avatar configuration routes configured successfully');
};

export default {
  configureRoutes,
  getAvatarConfigHandler,
  updateAvatarConfigHandler,
  getAvatarsHandler
};