<?php
/**
 * Quote Form Handler
 */

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize form data
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $service = filter_input(INPUT_POST, 'service', FILTER_SANITIZE_STRING);
    $location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING);
    $preferred_date = filter_input(INPUT_POST, 'preferred_date', FILTER_SANITIZE_STRING);
    $preferred_time = filter_input(INPUT_POST, 'preferred_time', FILTER_SANITIZE_STRING);
    $service_frequency = filter_input(INPUT_POST, 'service_frequency', FILTER_SANITIZE_STRING);
    $property_type = filter_input(INPUT_POST, 'property_type', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($service) || empty($location) || 
        empty($preferred_date) || empty($preferred_time) || empty($service_frequency) || empty($property_type)) {
        http_response_code(400);
        echo "Please fill in all required fields.";
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please enter a valid email address.";
        exit;
    }

    // Set recipient email
    $to = "info@exoinafrica.com";
    
    // Set email subject
    $subject = "New Service Booking - " . $service;

    // Prepare email content with HTML formatting
    $email_content = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .details { margin: 20px 0; }
            .label { font-weight: bold; }
            .value { color: #333; }
        </style>
    </head>
    <body>
        <h2>New Service Booking Details</h2>
        <div class='details'>
            <p><span class='label'>Name:</span> <span class='value'>$name</span></p>
            <p><span class='label'>Email:</span> <span class='value'>$email</span></p>
            <p><span class='label'>Phone:</span> <span class='value'>$phone</span></p>
            <p><span class='label'>Service:</span> <span class='value'>$service</span></p>
            <p><span class='label'>Location:</span> <span class='value'>$location</span></p>
            <p><span class='label'>Preferred Date:</span> <span class='value'>$preferred_date</span></p>
            <p><span class='label'>Preferred Time:</span> <span class='value'>$preferred_time</span></p>
            <p><span class='label'>Service Frequency:</span> <span class='value'>$service_frequency</span></p>
            <p><span class='label'>Property Type:</span> <span class='value'>$property_type</span></p>";

    if (!empty($message)) {
        $email_content .= "<p><span class='label'>Additional Details:</span><br><span class='value'>$message</span></p>";
    }

    $email_content .= "
        </div>
    </body>
    </html>";

    // Set email headers for HTML content
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($to, $subject, $email_content, $headers)) {
        // Send confirmation email to customer
        $customer_subject = "Thank you for booking with Exoin Africa";
        $customer_message = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #f79604; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Booking Confirmation</h2>
                </div>
                <div class='content'>
                    <p>Dear $name,</p>
                    <p>Thank you for booking our $service service. We have received your request and will contact you shortly to confirm the details.</p>
                    <h3>Booking Details:</h3>
                    <ul>
                        <li>Service: $service</li>
                        <li>Date: $preferred_date</li>
                        <li>Time: $preferred_time</li>
                        <li>Location: $location</li>
                        <li>Frequency: $service_frequency</li>
                    </ul>
                    <p>If you need to make any changes to your booking, please contact us at least 24 hours before your scheduled service.</p>
                    <p>For any questions, please don't hesitate to contact us:</p>
                    <p>Phone: +254 700 000000<br>
                    Email: info@exoinafrica.com</p>
                </div>
                <div class='footer'>
                    <p>This is an automated message, please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>";

        $customer_headers = "MIME-Version: 1.0" . "\r\n";
        $customer_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $customer_headers .= "From: Exoin Africa <info@exoinafrica.com>\r\n";

        mail($email, $customer_subject, $customer_message, $customer_headers);

        // Return success response
        http_response_code(200);
        echo "OK";
    } else {
        // Return error response
        http_response_code(500);
        echo "Failed to send message. Please try again later.";
    }
} else {
    // Return error for non-POST requests
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?> 