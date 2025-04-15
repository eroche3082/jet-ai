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
    this.configPath = path.resolve(process.cwd(), 'videoai/config/avatar_config.json');
    
    // Create config directory if it doesn't exist
    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      try {
        fs.mkdirSync(configDir, { recursive: true });
        console.log(`Created avatar config directory: ${configDir}`);
      } catch (error) {
        console.error('Error creating avatar config directory:', error);
      }
    }
    
    // Load config from file
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
        console.log('Avatar configuration loaded successfully');
      } else {
        // Create default config
        this.config = {
          apiKeys: {
            openai: process.env.OPENAI_API_KEY || '',
            heygen: process.env.HEYGEN_API_KEY || '',
            elevenlabs: process.env.ELEVENLABS_API_KEY || ''
          },
          settings: {
            enableAvatars: false,
            defaultAvatar: '',
            maxTokens: 1000,
            temperature: 0.7
          },
          enabledAvatarIds: []
        };
        
        // Save default config
        this.saveConfig();
        console.log('Default avatar configuration created');
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
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
      console.log('Avatar configuration saved successfully');
      return true;
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
        if (!this.config) {
          return false;
        }
      }
      
      // Update config
      if (newConfig.apiKeys) {
        this.config.apiKeys = {
          ...this.config.apiKeys,
          ...newConfig.apiKeys
        };
      }
      
      if (newConfig.settings) {
        this.config.settings = {
          ...this.config.settings,
          ...newConfig.settings
        };
      }
      
      if (newConfig.enabledAvatarIds) {
        this.config.enabledAvatarIds = newConfig.enabledAvatarIds;
      }
      
      // Save updated config
      return this.saveConfig();
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
      const avatarsPath = path.resolve(process.cwd(), 'videoai/dash/avatar_list.json');
      
      if (!fs.existsSync(avatarsPath)) {
        // Create sample avatars list if it doesn't exist
        const sampleAvatars = [
          {
            id: "avatar1",
            name: "Alex",
            pose_name: "Casual",
            thumbnail: "/videoai/thumbs/avatar1.jpg",
            created_at: Date.now(),
            voice_id: "voice1",
            is_interactive: true,
            gender: "male",
            attitude: "friendly"
          },
          {
            id: "avatar2",
            name: "Sophia",
            pose_name: "Professional",
            thumbnail: "/videoai/thumbs/avatar2.jpg",
            created_at: Date.now(),
            voice_id: "voice2",
            is_interactive: true,
            gender: "female",
            attitude: "professional"
          }
        ];
        
        const avatarsDir = path.dirname(avatarsPath);
        if (!fs.existsSync(avatarsDir)) {
          fs.mkdirSync(avatarsDir, { recursive: true });
        }
        
        fs.writeFileSync(avatarsPath, JSON.stringify(sampleAvatars, null, 2), 'utf8');
        console.log('Sample avatars created');
        return sampleAvatars;
      }
      
      const avatarsData = fs.readFileSync(avatarsPath, 'utf8');
      const avatars = JSON.parse(avatarsData);
      
      // If we have config, add is_enabled property to each avatar
      if (this.config) {
        return avatars.map((avatar: any) => ({
          ...avatar,
          is_enabled: this.config?.enabledAvatarIds.includes(avatar.id)
        }));
      }
      
      return avatars;
    } catch (error) {
      console.error('Error loading avatars:', error);
      return [];
    }
  }
}

export const avatarService = new AvatarService();