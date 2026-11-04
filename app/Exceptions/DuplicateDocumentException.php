<?php

namespace App\Exceptions;

use Exception;
use App\Models\Document;
class DuplicateDocumentException extends Exception
{
    public function __construct(public Document $existing, string $message = "Un document identique existe déjà.", int $code = 409) {
        
        parent::__construct($message, $code);
    }
}
