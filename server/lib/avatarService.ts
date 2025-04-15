import fs from 'fs';
import path from 'path';

interface AvatarApiKeys {
  openai: string;
  heygen: string;
  elevenlabs: string;
}

interface AvatarSettings {
  enableAvatars: boolean;
  defaultAvatar: string;
  maxTokens: number;
  temperature: number;
}

interface AvatarConfig {
  apiKeys: AvatarApiKeys;
  settings: AvatarSettings;
  enabledAvatarIds: string[];
}

/**
 * Avatar service for handling HeyGen AI video avatars integration
 */
export class AvatarService {
  private configPath: string;
  private config: AvatarConfig | null = null;

  constructor() {
    this.configPath = path.join(process.cwd(), 'public', 'avatars', 'data', 'config.json');
    this.loadConfig();
  }

  /**
   * Load avatar configuration from file
   */
  private loadConfig(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(configData);
      } else {
        // Initialize with default configuration
        this.config = {
          apiKeys: {
            openai: '',
            heygen: '',
            elevenlabs: ''
          },
          settings: {
            enableAvatars: false,
            defaultAvatar: '',
            maxTokens: 150,
            temperature: 0.7
          },
          enabledAvatarIds: []
        };
        
        // Create the directory if it doesn't exist
        const dir = path.dirname(this.configPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Save the default config
        this.saveConfig();
      }
    } catch (error) {
      console.error('Error loading avatar configuration:', error);
      this.config = null;
    }
  }

  /**
   * Save avatar configuration to file
   */
  private saveConfig(): boolean {
    try {
      if (this.config) {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving avatar configuration:', error);
      return false;
    }
  }

  /**
   * Get the avatar configuration
   */
  public getConfig(): AvatarConfig | null {
    return this.config;
  }

  /**
   * Update the avatar configuration
   */
  public updateConfig(newConfig: Partial<AvatarConfig>): boolean {
    try {
      if (!this.config) {
        this.loadConfig();
      }
      
      if (this.config) {
        // Update config with new values
        this.config = {
          ...this.config,
          ...newConfig,
          apiKeys: {
            ...this.config.apiKeys,
            ...(newConfig.apiKeys || {})
          },
          settings: {
            ...this.config.settings,
            ...(newConfig.settings || {})
          }
        };
        
        return this.saveConfig();
      }
      
      return false;
    } catch (error) {
      console.error('Error updating avatar configuration:', error);
      return false;
    }
  }

  /**
   * Get available avatars from JSON file
   */
  public async getAvatars(): Promise<any[]> {
    try {
      const avatarsPath = path.join(process.cwd(), 'public', 'avatars', 'data', 'avatar_list.json');
      
      if (fs.existsSync(avatarsPath)) {
        const avatarsData = fs.readFileSync(avatarsPath, 'utf8');
        const avatars = JSON.parse(avatarsData);
        
        // If we have a config with enabled avatar IDs, mark the enabled ones
        if (this.config && this.config.enabledAvatarIds.length > 0) {
          return avatars.data.map((avatar: any) => ({
            ...avatar,
            is_enabled: this.config?.enabledAvatarIds.includes(avatar.id)
          }));
        }
        
        // Otherwise return all avatars as enabled
        return avatars.data.map((avatar: any) => ({
          ...avatar,
          is_enabled: true
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error getting avatars:', error);
      return [];
    }
  }
}

export const avatarService = new AvatarService();