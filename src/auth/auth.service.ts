import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserPublicDto } from './dto/userPublic.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string, user: UserPublicDto }> {
    const { email, password } = signInDto;

    // Normalizar correo
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario
    const user = await this.usersService.findOneByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('La cuenta de correo no está registrada');
    }

    // Validamos si la cuenta esta verificada
    if (!user.isverified) {
      throw new BadRequestException('Tienes que verificar tu cuenta para acceder');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    // Generar payload para el token
    const payload = { sub: user.id, email: user.email, roles: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
        created_at: user.created_at,
      }
    };
  }

  async signUp(data: SignUpDto) {
    // Normalizar correo
    const email = data.email.toLowerCase().trim();
  
    // Buscar si el usuario ya existe
    const existingUser = await this.usersService.findOneByEmail(email);
  
    // El usuario ya existe y está verificado
    if (existingUser && existingUser.isverified) {
      throw new ConflictException('La cuenta de correo ya está registrada y verificada.');
    }
  
    // Generar un nuevo token de verificación (válido por 10 minutos)
    const verificationToken = this.jwtService.sign({ email }, { expiresIn: '10m' });
  
    // El usuario existe pero no ha verificado su correo
    if (existingUser && !existingUser.isverified) {
      // Actualizamos su token de verificación
      await this.usersService.updateVerificationToken(existingUser.id, verificationToken);
  
      // Enviar nuevamente el correo de verificación
      await this.mailService.sendVerificationEmail(email, data.name, verificationToken);
  
      return {
        message:
          'Tu cuenta ya fue registrada, pero aún no está verificada. Te enviamos un nuevo correo de verificación.',
      };
    }
  
    // Usuario nuevo (no existe)
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    const newUser = await this.usersService.create({
      name: data.name,
      lastname: data.lastname,
      email,
      role: 'admin',
      password_hash: hashedPassword,
      isverified: false,
      verificationtoken: verificationToken,
    });
  
    // Enviar correo de verificación
    await this.mailService.sendVerificationEmail(email, data.name, verificationToken);
  
    // No retornamos el hash
    const { password_hash, ...safeUser } = newUser;
  
    return {
      message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.',
      user: safeUser,
    };
  }
  

  async verifyEmail(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findOneByEmail(payload.email);
  
    if (!user) throw new NotFoundException('Usuario no encontrado.');
  
    await this.usersService.update({
      where: { email: user.email },
      data: { isverified: true, verificationtoken: null },
    });
  }
}
