// QR Code Generator Configuration
const config = {
    apiEndpoint: 'https://api.qrfusion.ai/v1/qr-codes',
    apiKey: 'YOUR_API_KEY', // Replace with actual API key
    patterns: ['squares', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'],
    eyeStyles: ['square', 'circle', 'rounded', 'flower', 'leaf'],
    frameStyles: ['none', 'simple', 'rounded', 'dots', 'stars']
};

class QRGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadDesignOptions();
        this.currentDesign = {
            pattern: 'squares',
            darkColor: '#0B1120',
            bgColor: '#FFFFFF',
            eyeStyle: 'square',
            outerEyeColor: '#0B1120',
            innerEyeColor: '#0B1120',
            frame: 'none',
            logo: null
        };
    }

    initializeElements() {
        // Tabs
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Form inputs
        this.urlInput = document.getElementById('url');
        this.titleInput = document.getElementById('title');
        
        // Color pickers
        this.darkColorInput = document.getElementById('darkColor');
        this.bgColorInput = document.getElementById('bgColor');
        this.outerEyeColorInput = document.getElementById('outerEyeColor');
        this.innerEyeColorInput = document.getElementById('innerEyeColor');
        
        // File upload
        this.logoInput = document.getElementById('iconUpload');
        
        // Preview and buttons
        this.previewImg = document.getElementById('qrPreview');
        this.generateBtn = document.querySelector('.generate-btn');
        this.downloadBtns = document.querySelectorAll('.download-btn');
        
        // Grids
        this.patternGrid = document.querySelector('.pattern-grid');
        this.eyeGrid = document.querySelector('.eye-grid');
        this.frameGrid = document.querySelector('.frame-grid');
    }

    setupEventListeners() {
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Form inputs
        this.urlInput.addEventListener('input', () => this.validateInput());
        this.titleInput.addEventListener('input', () => this.validateInput());

        // Color pickers
        this.darkColorInput.addEventListener('change', (e) => {
            this.currentDesign.darkColor = e.target.value;
            this.updatePreview();
        });

        this.bgColorInput.addEventListener('change', (e) => {
            this.currentDesign.bgColor = e.target.value;
            this.updatePreview();
        });

        this.outerEyeColorInput.addEventListener('change', (e) => {
            this.currentDesign.outerEyeColor = e.target.value;
            this.updatePreview();
        });

        this.innerEyeColorInput.addEventListener('change', (e) => {
            this.currentDesign.innerEyeColor = e.target.value;
            this.updatePreview();
        });

        // Logo upload
        this.logoInput.addEventListener('change', (e) => this.handleLogoUpload(e));

        // Generate button
        this.generateBtn.addEventListener('click', () => this.generateQRCode());

        // Download buttons
        this.downloadBtns.forEach(btn => {
            btn.addEventListener('click', () => this.downloadQRCode(btn.dataset.format));
        });
    }

    loadDesignOptions() {
        // Load patterns
        config.patterns.forEach(pattern => {
            const option = this.createOptionElement(pattern, 'pattern');
            this.patternGrid.appendChild(option);
        });

        // Load eye styles
        config.eyeStyles.forEach(style => {
            const option = this.createOptionElement(style, 'eye');
            this.eyeGrid.appendChild(option);
        });

        // Load frame styles
        config.frameStyles.forEach(style => {
            const option = this.createOptionElement(style, 'frame');
            this.frameGrid.appendChild(option);
        });
    }

    createOptionElement(value, type) {
        const option = document.createElement('div');
        option.className = `${type}-option`;
        option.dataset[type] = value;
        
        const img = document.createElement('img');
        img.src = `assets/images/${type}s/${value}.svg`;
        img.alt = value;
        
        option.appendChild(img);
        
        option.addEventListener('click', () => {
            this.selectOption(type, value, option);
        });
        
        return option;
    }

    selectOption(type, value, element) {
        // Remove active class from siblings
        element.parentElement.querySelectorAll(`.${type}-option`).forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        element.classList.add('active');
        
        // Update current design
        this.currentDesign[type] = value;
        
        // Update preview
        this.updatePreview();
    }

    async handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('Logo file size must be less than 2MB');
            return;
        }

        try {
            const base64Logo = await this.fileToBase64(file);
            this.currentDesign.logo = base64Logo;
            this.updatePreview();
        } catch (error) {
            console.error('Error processing logo:', error);
            alert('Error processing logo file');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    switchTab(tabId) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    validateInput() {
        const url = this.urlInput.value.trim();
        this.generateBtn.disabled = !url;
        return url !== '';
    }

    async generateQRCode() {
        if (!this.validateInput()) return;

        try {
            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    url: this.urlInput.value.trim(),
                    title: this.titleInput.value.trim(),
                    design: this.currentDesign
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate QR code');
            }

            const data = await response.json();
            this.previewImg.src = data.previewUrl;
            
            // Enable download buttons
            this.downloadBtns.forEach(btn => btn.disabled = false);
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('Error generating QR code. Please try again.');
        }
    }

    async downloadQRCode(format) {
        try {
            const response = await fetch(`${config.apiEndpoint}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    url: this.urlInput.value.trim(),
                    design: this.currentDesign,
                    format: format
                })
            });

            if (!response.ok) {
                throw new Error('Failed to download QR code');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-code.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('Error downloading QR code. Please try again.');
        }
    }

    updatePreview() {
        // In a real implementation, this would make an API call to get a preview
        // For now, we'll just update the UI to show the design is changing
        this.previewImg.style.opacity = '0.7';
        setTimeout(() => {
            this.previewImg.style.opacity = '1';
        }, 300);
    }
}

// Initialize the QR Generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRGenerator();
});
