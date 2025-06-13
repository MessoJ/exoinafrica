<?php
class PHP_Email_Form {
    public $to;
    public $from_name;
    public $from_email;
    public $subject;
    public $ajax;
    public $smtp;
    private $messages = array();

    public function add_message($message, $label = '', $min_length = 0) {
        if ($min_length > 0 && strlen($message) < $min_length) {
            return false;
        }
        $this->messages[] = array(
            'label' => $label,
            'message' => $message
        );
        return true;
    }

    public function send() {
        if (empty($this->to)) {
            return 'Error: No recipient email address specified.';
        }

        $email_content = '';
        foreach ($this->messages as $message) {
            if (!empty($message['label'])) {
                $email_content .= $message['label'] . ': ';
            }
            $email_content .= $message['message'] . "\n";
        }

        $headers = "From: {$this->from_name} <{$this->from_email}>\r\n";
        $headers .= "Reply-To: {$this->from_email}\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        if (isset($this->smtp) && is_array($this->smtp)) {
            // SMTP configuration would go here
            // For now, we'll use the default mail() function
        }

        if (mail($this->to, $this->subject, $email_content, $headers)) {
            return 'OK';
        } else {
            return 'Error: Unable to send email.';
        }
    }
} 