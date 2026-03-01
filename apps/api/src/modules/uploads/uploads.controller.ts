import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@perfume/shared';

@ApiTags('Uploads')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller({ path: 'uploads', version: '1' })
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post('image')
    @ApiOperation({ summary: 'Upload a product image to Cloudinary (admin only)' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.uploadsService.uploadImage(file.buffer);
    }
}
