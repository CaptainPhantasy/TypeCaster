class BackstagePass {
  constructor() {
    this.VERSION = "1.0.0";
    this.PREFIX_MAP = {
      beginner: "UNDERSTUDY",
      intermediate: "ENSEMBLE",
      advanced: "STAR",
      master: "LEGEND"
    };
  }
  
  generatePass(userData) {
    const data = {
      v: this.VERSION,
      role: userData.role,
      act: userData.currentAct,
      scene: userData.currentScene,
      tempo: userData.averageTempo,
      accuracy: userData.averageAccuracy,
      awards: userData.achievements?.map(a => a.id) || [],
      showCount: userData.totalSessions || 0,
      bestRun: userData.longestStreak || 0,
      repertoire: userData.completedScenes || [],
      stageConfidence: userData.keyboardIndependence || 1.0,
      timestamp: Date.now()
    };
    
    const encoded = btoa(JSON.stringify(data));
    const prefix = this.getPrefix(userData.level);
    const formatted = this.formatPass(prefix, encoded);
    return formatted;
  }
  
  getPrefix(level) {
    if (!level) {
      return this.PREFIX_MAP.beginner;
    }
    
    if (typeof level === 'string') {
      return this.PREFIX_MAP[level] || this.PREFIX_MAP.beginner;
    }
    
    if (level >= 75) return this.PREFIX_MAP.master;
    if (level >= 50) return this.PREFIX_MAP.advanced;
    if (level >= 25) return this.PREFIX_MAP.intermediate;
    return this.PREFIX_MAP.beginner;
  }
  
  formatPass(prefix, encoded) {
    const chunks = encoded.substring(0, 8).match(/.{1,4}/g) || [];
    
    if (chunks.length < 2) {
      chunks.push('0000');
    }
    
    return `${prefix}-${chunks[0].toUpperCase()}-SHOW-${chunks[1].toUpperCase()}`;
  }
  
  parsePass(passCode) {
    try {
      const prefixPattern = new RegExp(`(${Object.values(this.PREFIX_MAP).join('|')})-`, 'i');
      const match = passCode.match(prefixPattern);
      
      if (!match) {
        throw new Error("Invalid pass format");
      }
      
      const prefix = match[1];
      const codeParts = passCode.split('-');
      
      if (codeParts.length < 4 || codeParts[2] !== 'SHOW') {
        throw new Error("Invalid pass structure");
      }
      
      const shortCode = codeParts[1] + codeParts[3];
      
      const allPasses = this.getAllStoredPasses();
      const fullPass = allPasses.find(pass => {
        const passShort = pass.substring(0, 8).toUpperCase();
        return passShort === shortCode;
      });
      
      if (!fullPass) {
        throw new Error("Pass not found in storage");
      }
      
      const decoded = atob(fullPass);
      const data = JSON.parse(decoded);
      
      if (data.v !== this.VERSION) {
        console.warn(`Pass version mismatch: expected ${this.VERSION}, got ${data.v}`);
      }
      
      return data;
    } catch (e) {
      throw new Error("Invalid Backstage Pass. Please check your ticket!");
    }
  }
  
  savePassToStorage(passData) {
    try {
      const encoded = btoa(JSON.stringify(passData));
      const passes = this.getAllStoredPasses();
      passes.push(encoded);
      
      if (passes.length > 10) {
        passes.shift();
      }
      
      localStorage.setItem('backstagePasses', JSON.stringify(passes));
      return true;
    } catch (e) {
      console.error('Failed to save backstage pass:', e);
      return false;
    }
  }
  
  getAllStoredPasses() {
    try {
      const stored = localStorage.getItem('backstagePasses');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }
  
  clearAllPasses() {
    try {
      localStorage.removeItem('backstagePasses');
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default new BackstagePass();