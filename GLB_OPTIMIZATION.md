# GLB Model Optimization Guide

## Current Status
You have two GLB files that are quite large:
- `man_head.glb` - **15.5 MB** ⚠️
- `stylized_head_decimated_sculpt.glb` - **35.6 MB** ⚠️

**Target size for web**: 1-5 MB per model

## Quick Optimization Methods

### 1. **gltf-transform** (CLI - RECOMMENDED)
```bash
npm install -g @gltf-transform/cli

# Optimize a model
gltf-transform optimize man_head.glb man_head_optimized.glb --compress

# Even more aggressive:
gltf-transform optimize man_head.glb man_head_optimized.glb \
  --compress \
  --texture-compress webp
```

### 2. **Blender** (If you have 3D experience)
1. Import GLB
2. Select mesh
3. Modifiers > Decimate (set ratio to 0.5 or lower)
4. Export as GLB with:
   - ✅ Compression
   - ✅ Draco compression
   - Texture size: 1024x1024 max

### 3. **Online Tools** (Easiest)
- **gltf.report** (https://gltf.report) - Upload and auto-optimize
- **glTF Sample Viewer** - Shows file breakdown

### 4. **Three.js Draco Loader** (Code-based)
Use Draco compression in your code:

```jsx
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
```

## Recommended Workflow

1. **Use gltf-transform CLI** for quick optimization
2. Aim for **2-5 MB per head model**
3. Test loading speed after optimization
4. Consider lazy loading models (load on demand)

## Expected Results
- Original: 15-35 MB
- **Optimized: 1-3 MB** (10x reduction)
- Load time improvement: ~90%

Would you like me to add lazy loading to improve initial page load?
