import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <- Esto hace que esté disponible en toda la app sin importar cada vez
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
