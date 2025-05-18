document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Disable submit button and show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // In a real implementation, this would send data to your backend
            const response = await fetch('https://api.qrfusion.ai/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            
            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.9rem',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out'
        });
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#00C853';
        } else {
            notification.style.backgroundColor = '#FF1744';
        }
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
});
