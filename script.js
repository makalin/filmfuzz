class FilmFuzz {
    constructor() {
        this.canvas = document.getElementById('imageCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.originalImage = null;
        this.currentImage = null;
        this.isDarkTheme = false;
        
        this.initializeEventListeners();
        this.setupCanvas();
        this.loadTheme();
    }

    initializeEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.resetAllEffects());

        // File upload
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Drag and drop
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('click', () => document.getElementById('imageInput').click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageUpload(file);
            }
        });

        // Grain controls
        document.getElementById('grainType').addEventListener('change', () => this.applyEffects());
        document.getElementById('grainIntensity').addEventListener('input', (e) => {
            document.getElementById('intensityValue').textContent = e.target.value;
            this.applyEffects();
        });
        document.getElementById('grainSize').addEventListener('input', (e) => {
            document.getElementById('sizeValue').textContent = e.target.value;
            this.applyEffects();
        });

        // Color controls
        document.getElementById('brightness').addEventListener('input', (e) => {
            document.getElementById('brightnessValue').textContent = e.target.value;
            this.applyEffects();
        });
        document.getElementById('contrast').addEventListener('input', (e) => {
            document.getElementById('contrastValue').textContent = e.target.value;
            this.applyEffects();
        });
        document.getElementById('saturation').addEventListener('input', (e) => {
            document.getElementById('saturationValue').textContent = e.target.value;
            this.applyEffects();
        });
        document.getElementById('temperature').addEventListener('input', (e) => {
            document.getElementById('temperatureValue').textContent = e.target.value;
            this.applyEffects();
        });

        // Artifact controls
        document.getElementById('artifactType').addEventListener('change', () => this.applyEffects());
        document.getElementById('artifactIntensity').addEventListener('input', (e) => {
            document.getElementById('artifactIntensityValue').textContent = e.target.value;
            this.applyEffects();
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => this.applyPreset(btn.dataset.preset));
        });

        // Download
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('filmfuzz-theme');
        if (savedTheme === 'dark') {
            this.toggleTheme();
        }
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
        localStorage.setItem('filmfuzz-theme', this.isDarkTheme ? 'dark' : 'light');
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }

    setupCanvas() {
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#6c757d';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Upload an image to get started', this.canvas.width / 2, this.canvas.height / 2);
    }

    handleImageUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.resizeCanvas(img);
                this.displayImage(img);
                document.getElementById('canvasOverlay').classList.add('hidden');
                this.updateImageInfo(file.name, img.width, img.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    resizeCanvas(img) {
        const maxWidth = 800;
        const maxHeight = 600;
        
        let { width, height } = img;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.updateCanvasSize();
    }

    displayImage(img) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.currentImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    updateImageInfo(filename, width, height) {
        document.getElementById('imageInfo').textContent = `${filename} (${width}×${height})`;
    }

    updateCanvasSize() {
        document.getElementById('canvasSize').textContent = `${this.canvas.width} × ${this.canvas.height}`;
    }

    resetAllEffects() {
        if (!this.originalImage) return;

        // Reset all controls
        document.getElementById('grainType').value = 'none';
        document.getElementById('grainIntensity').value = 50;
        document.getElementById('grainSize').value = 2;
        document.getElementById('brightness').value = 0;
        document.getElementById('contrast').value = 0;
        document.getElementById('saturation').value = 0;
        document.getElementById('temperature').value = 0;
        document.getElementById('artifactType').value = 'none';
        document.getElementById('artifactIntensity').value = 50;

        // Update display values
        document.getElementById('intensityValue').textContent = '50';
        document.getElementById('sizeValue').textContent = '2';
        document.getElementById('brightnessValue').textContent = '0';
        document.getElementById('contrastValue').textContent = '0';
        document.getElementById('saturationValue').textContent = '0';
        document.getElementById('temperatureValue').textContent = '0';
        document.getElementById('artifactIntensityValue').textContent = '50';

        // Reset preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));

        // Display original image
        this.displayImage(this.originalImage);
    }

    applyPreset(presetName) {
        if (!this.originalImage) return;

        // Remove active class from all preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');

        const presets = {
            vintage: {
                grainType: 'vintage',
                grainIntensity: 70,
                grainSize: 2.5,
                brightness: -10,
                contrast: 20,
                saturation: -20,
                temperature: 30,
                artifactType: 'vignette',
                artifactIntensity: 60
            },
            cinematic: {
                grainType: 'silver',
                grainIntensity: 40,
                grainSize: 1.5,
                brightness: -15,
                contrast: 35,
                saturation: -10,
                temperature: -10,
                artifactType: 'vignette',
                artifactIntensity: 80
            },
            dramatic: {
                grainType: 'coarse',
                grainIntensity: 80,
                grainSize: 3,
                brightness: -20,
                contrast: 50,
                saturation: -30,
                temperature: 0,
                artifactType: 'chromatic',
                artifactIntensity: 70
            },
            warm: {
                grainType: 'kodak',
                grainIntensity: 30,
                grainSize: 2,
                brightness: 10,
                contrast: 15,
                saturation: 20,
                temperature: 40,
                artifactType: 'lightleak',
                artifactIntensity: 30
            },
            cool: {
                grainType: 'fuji',
                grainIntensity: 25,
                grainSize: 1.8,
                brightness: 5,
                contrast: 10,
                saturation: -10,
                temperature: -30,
                artifactType: 'bloom',
                artifactIntensity: 40
            },
            monochrome: {
                grainType: 'ilford',
                grainIntensity: 60,
                grainSize: 2.2,
                brightness: 0,
                contrast: 25,
                saturation: -100,
                temperature: 0,
                artifactType: 'vignette',
                artifactIntensity: 50
            }
        };

        const preset = presets[presetName];
        if (!preset) return;

        // Apply preset values
        document.getElementById('grainType').value = preset.grainType;
        document.getElementById('grainIntensity').value = preset.grainIntensity;
        document.getElementById('grainSize').value = preset.grainSize;
        document.getElementById('brightness').value = preset.brightness;
        document.getElementById('contrast').value = preset.contrast;
        document.getElementById('saturation').value = preset.saturation;
        document.getElementById('temperature').value = preset.temperature;
        document.getElementById('artifactType').value = preset.artifactType;
        document.getElementById('artifactIntensity').value = preset.artifactIntensity;

        // Update display values
        document.getElementById('intensityValue').textContent = preset.grainIntensity;
        document.getElementById('sizeValue').textContent = preset.grainSize;
        document.getElementById('brightnessValue').textContent = preset.brightness;
        document.getElementById('contrastValue').textContent = preset.contrast;
        document.getElementById('saturationValue').textContent = preset.saturation;
        document.getElementById('temperatureValue').textContent = preset.temperature;
        document.getElementById('artifactIntensityValue').textContent = preset.artifactIntensity;

        this.applyEffects();
    }

    applyEffects() {
        if (!this.originalImage) return;

        // Reset to original image
        this.displayImage(this.originalImage);
        
        const grainType = document.getElementById('grainType').value;
        const artifactType = document.getElementById('artifactType').value;
        const grainIntensity = parseInt(document.getElementById('grainIntensity').value) / 100;
        const grainSize = parseFloat(document.getElementById('grainSize').value);
        const brightness = parseInt(document.getElementById('brightness').value);
        const contrast = parseInt(document.getElementById('contrast').value);
        const saturation = parseInt(document.getElementById('saturation').value);
        const temperature = parseInt(document.getElementById('temperature').value);
        const artifactIntensity = parseInt(document.getElementById('artifactIntensity').value) / 100;

        // Apply color adjustments first
        if (brightness !== 0 || contrast !== 0 || saturation !== 0 || temperature !== 0) {
            this.applyColorAdjustments(brightness, contrast, saturation, temperature);
        }

        // Apply grain effect
        if (grainType !== 'none' && grainIntensity > 0) {
            this.applyGrain(grainType, grainIntensity, grainSize);
        }

        // Apply artifact effect
        if (artifactType !== 'none') {
            this.applyArtifact(artifactType, artifactIntensity);
        }
    }

    applyColorAdjustments(brightness, contrast, saturation, temperature) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Brightness
            if (brightness !== 0) {
                const factor = 1 + brightness / 100;
                r = Math.max(0, Math.min(255, r * factor));
                g = Math.max(0, Math.min(255, g * factor));
                b = Math.max(0, Math.min(255, b * factor));
            }

            // Contrast
            if (contrast !== 0) {
                const factor = 1 + contrast / 100;
                r = Math.max(0, Math.min(255, ((r - 128) * factor) + 128));
                g = Math.max(0, Math.min(255, ((g - 128) * factor) + 128));
                b = Math.max(0, Math.min(255, ((b - 128) * factor) + 128));
            }

            // Temperature (warm/cool)
            if (temperature !== 0) {
                const factor = temperature / 100;
                r = Math.max(0, Math.min(255, r + factor * 20));
                b = Math.max(0, Math.min(255, b - factor * 15));
            }

            // Saturation
            if (saturation !== 0) {
                const factor = 1 + saturation / 100;
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                r = Math.max(0, Math.min(255, gray + factor * (r - gray)));
                g = Math.max(0, Math.min(255, gray + factor * (g - gray)));
                b = Math.max(0, Math.min(255, gray + factor * (b - gray)));
            }

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    applyGrain(type, intensity, size) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = this.generateNoise(type, size);
            
            data[i] = Math.max(0, Math.min(255, data[i] + noise.r * intensity));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise.g * intensity));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise.b * intensity));
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    generateNoise(type, size) {
        switch (type) {
            case 'fine':
                return {
                    r: (Math.random() - 0.5) * 30 * size,
                    g: (Math.random() - 0.5) * 30 * size,
                    b: (Math.random() - 0.5) * 30 * size
                };
            case 'coarse':
                return {
                    r: (Math.random() - 0.5) * 60 * size,
                    g: (Math.random() - 0.5) * 60 * size,
                    b: (Math.random() - 0.5) * 60 * size
                };
            case 'silver':
                const silver = (Math.random() - 0.5) * 40 * size;
                return { r: silver, g: silver, b: silver };
            case 'color':
                return {
                    r: (Math.random() - 0.5) * 50 * size,
                    g: (Math.random() - 0.5) * 50 * size,
                    b: (Math.random() - 0.5) * 50 * size
                };
            case 'vintage':
                const vintage = (Math.random() - 0.5) * 35 * size;
                return {
                    r: vintage + 10,
                    g: vintage - 5,
                    b: vintage - 15
                };
            case 'kodak':
                const kodak = (Math.random() - 0.5) * 25 * size;
                return {
                    r: kodak + 5,
                    g: kodak + 2,
                    b: kodak - 3
                };
            case 'fuji':
                const fuji = (Math.random() - 0.5) * 30 * size;
                return {
                    r: fuji - 2,
                    g: fuji + 3,
                    b: fuji + 5
                };
            case 'ilford':
                const ilford = (Math.random() - 0.5) * 45 * size;
                return { r: ilford, g: ilford, b: ilford };
            default:
                return { r: 0, g: 0, b: 0 };
        }
    }

    applyArtifact(type, intensity) {
        switch (type) {
            case 'lightleak':
                this.applyLightLeak(intensity);
                break;
            case 'scratches':
                this.applyScratches(intensity);
                break;
            case 'dust':
                this.applyDust(intensity);
                break;
            case 'vignette':
                this.applyVignette(intensity);
                break;
            case 'bokeh':
                this.applyBokeh(intensity);
                break;
            case 'lensflare':
                this.applyLensFlare(intensity);
                break;
            case 'chromatic':
                this.applyChromaticAberration(intensity);
                break;
            case 'bloom':
                this.applyLightBloom(intensity);
                break;
        }
    }

    applyLightLeak(intensity) {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, `rgba(255, 100, 50, ${intensity * 0.3})`);
        gradient.addColorStop(0.5, `rgba(255, 150, 100, ${intensity * 0.2})`);
        gradient.addColorStop(1, `rgba(255, 200, 150, ${intensity * 0.1})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    applyScratches(intensity) {
        const numScratches = Math.floor(intensity * 10);
        
        for (let i = 0; i < numScratches; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const length = 20 + Math.random() * 80;
            const angle = Math.random() * Math.PI * 2;
            
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
            this.ctx.lineWidth = 1 + Math.random() * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
            this.ctx.stroke();
        }
    }

    applyDust(intensity) {
        const numDust = Math.floor(intensity * 50);
        
        for (let i = 0; i < numDust; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = 1 + Math.random() * 3;
            
            this.ctx.fillStyle = `rgba(0, 0, 0, ${intensity * 0.6})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    applyVignette(intensity) {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.7})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    applyBokeh(intensity) {
        const numBokeh = Math.floor(intensity * 15);
        
        for (let i = 0; i < numBokeh; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = 5 + Math.random() * 15;
            const opacity = Math.random() * intensity * 0.8;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    applyLensFlare(intensity) {
        const centerX = this.canvas.width * 0.7;
        const centerY = this.canvas.height * 0.3;
        
        // Main flare
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
        gradient.addColorStop(0, `rgba(255, 255, 200, ${intensity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(255, 200, 100, ${intensity * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 150, 50, ${intensity * 0.2})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        this.ctx.fill();
    }

    applyChromaticAberration(intensity) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const offset = Math.floor(intensity * 3);
        
        // Create separate canvases for each channel
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        // Red channel (shifted right)
        tempCtx.putImageData(imageData, offset, 0);
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        // Blue channel (shifted left)
        tempCtx.putImageData(imageData, -offset, 0);
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        this.ctx.globalCompositeOperation = 'source-over';
    }

    applyLightBloom(intensity) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Create bloom effect by brightening bright areas
        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (brightness > 200) {
                const bloomFactor = (brightness - 200) / 55 * intensity;
                data[i] = Math.min(255, data[i] + bloomFactor * 20);
                data[i + 1] = Math.min(255, data[i + 1] + bloomFactor * 20);
                data[i + 2] = Math.min(255, data[i + 2] + bloomFactor * 20);
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    downloadImage() {
        if (!this.currentImage) return;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        tempCtx.drawImage(this.canvas, 0, 0);
        
        const link = document.createElement('a');
        link.download = `filmfuzz-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.triggerConfetti();
    }

    triggerConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FilmFuzz();
}); 