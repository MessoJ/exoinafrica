document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.php-email-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const loadingMessage = this.querySelector('.loading');
            const errorMessage = this.querySelector('.error-message');
            const successMessage = this.querySelector('.sent-message');
            
            // Hide any existing messages
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
            
            // Show loading message
            loadingMessage.style.display = 'block';
            
            // Disable submit button
            submitButton.disabled = true;
            
            // Get the form's action URL
            const formAction = this.getAttribute('action');
            
            // Send AJAX request
            fetch(formAction, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                // Hide loading message
                loadingMessage.style.display = 'none';
                
                if (data.includes('OK')) {
                    // Show success message
                    successMessage.style.display = 'block';
                    // Reset form
                    form.reset();
                } else {
                    // Show error message with the actual error from the server
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = data || 'An error occurred. Please try again later.';
                }
            })
            .catch(error => {
                // Hide loading message
                loadingMessage.style.display = 'none';
                
                // Show error message
                errorMessage.style.display = 'block';
                errorMessage.textContent = `Error: ${error.message}. Please check if the server is running and try again.`;
                console.error('Form submission error:', error);
            })
            .finally(() => {
                // Re-enable submit button
                submitButton.disabled = false;
            });
        });
    }
}); 