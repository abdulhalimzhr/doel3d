/**
 * Simple STL file parser utility
 * Extracts basic information from STL files for preview
 */

export interface STLInfo {
  triangles: number;
  vertices: number;
  bounds: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  volume: number;
  surfaceArea: number;
  isBinary: boolean;
}

export class STLParser {
  private file: File;
  
  constructor(file: File) {
    this.file = file;
  }

  /**
   * Parse STL file and extract basic information
   */
  async parseFile(): Promise<STLInfo> {
    const buffer = await this.file.arrayBuffer();
    const isBinary = this.isBinarySTL(buffer);
    
    if (isBinary) {
      return this.parseBinarySTL(buffer);
    } else {
      return this.parseASCIISTL(buffer);
    }
  }

  /**
   * Check if STL file is binary format
   */
  private isBinarySTL(buffer: ArrayBuffer): boolean {
    const view = new DataView(buffer);
    
    // Binary STL files start with 80 bytes header, followed by 4 bytes triangle count
    if (buffer.byteLength < 84) return false;
    
    // Get triangle count from bytes 80-83
    const triangleCount = view.getUint32(80, true);
    
    // Binary STL file size should be: 80 (header) + 4 (count) + triangleCount * 50
    const expectedSize = 84 + triangleCount * 50;
    
    return buffer.byteLength === expectedSize;
  }

  /**
   * Parse binary STL file
   */
  private parseBinarySTL(buffer: ArrayBuffer): STLInfo {
    const view = new DataView(buffer);
    const triangleCount = view.getUint32(80, true);
    
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    let volume = 0;
    let surfaceArea = 0;
    
    // Start reading triangles from byte 84
    let offset = 84;
    
    for (let i = 0; i < triangleCount; i++) {
      // Skip normal vector (12 bytes)
      offset += 12;
      
      // Read 3 vertices (3 * 3 * 4 bytes)
      const vertices = [];
      for (let j = 0; j < 3; j++) {
        const x = view.getFloat32(offset, true);
        const y = view.getFloat32(offset + 4, true);
        const z = view.getFloat32(offset + 8, true);
        
        vertices.push({ x, y, z });
        
        // Update bounds
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
        
        offset += 12;
      }
      
      // Calculate triangle area and volume contribution
      const [v1, v2, v3] = vertices;
      const area = this.calculateTriangleArea(v1, v2, v3);
      surfaceArea += area;
      
      // Volume contribution using divergence theorem
      volume += (v1.x * (v2.y * v3.z - v3.y * v2.z)) / 6;
      
      // Skip attribute byte count (2 bytes)
      offset += 2;
    }
    
    return {
      triangles: triangleCount,
      vertices: triangleCount * 3,
      bounds: {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ }
      },
      volume: Math.abs(volume),
      surfaceArea,
      isBinary: true
    };
  }

  /**
   * Parse ASCII STL file
   */
  private parseASCIISTL(buffer: ArrayBuffer): STLInfo {
    const text = new TextDecoder().decode(buffer);
    const lines = text.split('\n');
    
    let triangleCount = 0;
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    let volume = 0;
    let surfaceArea = 0;
    
    let currentVertices: Array<{ x: number; y: number; z: number }> = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('facet normal')) {
        currentVertices = [];
      } else if (trimmed.startsWith('vertex')) {
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 4) {
          const x = parseFloat(parts[1]);
          const y = parseFloat(parts[2]);
          const z = parseFloat(parts[3]);
          
          currentVertices.push({ x, y, z });
          
          // Update bounds
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          minZ = Math.min(minZ, z);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          maxZ = Math.max(maxZ, z);
        }
      } else if (trimmed.startsWith('endfacet')) {
        if (currentVertices.length === 3) {
          triangleCount++;
          
          // Calculate triangle area and volume contribution
          const [v1, v2, v3] = currentVertices;
          const area = this.calculateTriangleArea(v1, v2, v3);
          surfaceArea += area;
          
          // Volume contribution using divergence theorem
          volume += (v1.x * (v2.y * v3.z - v3.y * v2.z)) / 6;
        }
      }
    }
    
    return {
      triangles: triangleCount,
      vertices: triangleCount * 3,
      bounds: {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ }
      },
      volume: Math.abs(volume),
      surfaceArea,
      isBinary: false
    };
  }

  /**
   * Calculate triangle area using cross product
   */
  private calculateTriangleArea(
    v1: { x: number; y: number; z: number },
    v2: { x: number; y: number; z: number },
    v3: { x: number; y: number; z: number }
  ): number {
    const a = {
      x: v2.x - v1.x,
      y: v2.y - v1.y,
      z: v2.z - v1.z
    };
    
    const b = {
      x: v3.x - v1.x,
      y: v3.y - v1.y,
      z: v3.z - v1.z
    };
    
    const cross = {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
    
    const magnitude = Math.sqrt(cross.x * cross.x + cross.y * cross.y + cross.z * cross.z);
    return magnitude / 2;
  }
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
  if (volume < 1) {
    return `${(volume * 1000).toFixed(2)} mm³`;
  } else {
    return `${volume.toFixed(2)} cm³`;
  }
}

/**
 * Format dimensions for display
 */
export function formatDimensions(bounds: STLInfo['bounds']): string {
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  const depth = bounds.max.z - bounds.min.z;
  
  return `${width.toFixed(1)} × ${height.toFixed(1)} × ${depth.toFixed(1)} mm`;
}

/**
 * Estimate print time (very rough calculation)
 */
export function estimatePrintTime(volume: number, layerHeight: number): string {
  // Very rough estimation based on volume and layer height
  const volumeInMm3 = volume * 1000;
  const estimatedMinutes = (volumeInMm3 / 100) * (0.2 / layerHeight);
  
  if (estimatedMinutes < 60) {
    return `${Math.round(estimatedMinutes)} menit`;
  } else {
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = Math.round(estimatedMinutes % 60);
    return `${hours} jam ${minutes} menit`;
  }
}
