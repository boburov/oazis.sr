import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Ism kiritilishi shart' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Familya kiritilishi shart' })
  @IsString()
  surname: string;

  @IsNotEmpty({ message: 'Email kiritilishi shart' })
  @IsEmail()
  @IsString()
  emial: string;

  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Telefon raqam kiritilishi shart' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/, {
    message: 'Telefon formati: +998-XX-XXX-XX-XX (masalan: +998-90-123-45-67)',
  })
  phone: string;
}
