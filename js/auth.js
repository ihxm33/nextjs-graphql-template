document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Handle password reset form submission
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Disable submit button and show loading state
            const submitBtn = resetPasswordForm.querySelector('.auth-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                // In a real implementation, this would send data to your backend
                const response = await fetch('https://api.qrfusion.ai/v1/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to send reset link');
                }
                
                showNotification('Password reset link sent to your email', 'success');
                
            } catch (error) {
                console.error('Reset password error:', error);
                showNotification('Failed to send reset link. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;
            
            // Disable submit button and show loading state
            const submitBtn = loginForm.querySelector('.auth-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            try {
                // In a real implementation, this would send data to your backend
                const response = await fetch('https://api.qrfusion.ai/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        remember
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }
                
                // Redirect to dashboard on success
                window.location.href = '/dashboard';
                
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Invalid email or password. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.querySelector('input[name="terms"]').checked;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showNotification('Please accept the Terms of Service', 'error');
                return;
            }
            
            // Disable submit button and show loading state
            const submitBtn = signupForm.querySelector('.auth-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';
            
            try {
                // In a real implementation, this would send data to your backend
                const response = await fetch('https://api.qrfusion.ai/v1/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Signup failed');
                }
                
                // Redirect to email verification page
                window.location.href = '/verify-email';
                
            } catch (error) {
                console.error('Signup error:', error);
                showNotification('Failed to create account. Please try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Handle email verification resend
    const resendButton = document.getElementById('resendButton');
    const timerSpan = document.getElementById('timer');
    
    if (resendButton && timerSpan) {
        let timeLeft = 60;
        resendButton.disabled = true;
        
        const countdown = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                resendButton.disabled = false;
                document.querySelector('.resend-timer').style.display = 'none';
            }
        }, 1000);
        
        resendButton.addEventListener('click', async () => {
            resendButton.disabled = true;
            const originalText = resendButton.textContent;
            resendButton.textContent = 'Sending...';
            
            try {
                // In a real implementation, this would send data to your backend
                const response = await fetch('https://api.qrfusion.ai/v1/auth/resend-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to resend verification email');
                }
                
                showNotification('Verification email sent successfully', 'success');
                
                // Reset timer
                timeLeft = 60;
                timerSpan.textContent = timeLeft;
                document.querySelector('.resend-timer').style.display = 'block';
                
                const countdown = setInterval(() => {
                    timeLeft--;
                    timerSpan.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        resendButton.disabled = false;
                        document.querySelector('.resend-timer').style.display = 'none';
                    }
                }, 1000);
                
            } catch (error) {
                console.error('Resend verification error:', error);
                showNotification('Failed to resend verification email', 'error');
                resendButton.disabled = false;
            } finally {
                resendButton.textContent = originalText;
            }
        });
    }

    // Handle social auth buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('google') ? 'google' : 'github';
            // In a real implementation, this would redirect to the OAuth provider
            window.location.href = `https://api.qrfusion.ai/v1/auth/${provider}`;
        });
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
