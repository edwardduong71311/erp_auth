import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
    constructor(message: string = 'System has some conflicts') {
        super(message, HttpStatus.CONFLICT);
    }
}
