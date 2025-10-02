import { Controller, Get } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Controller('telegram')
export class TelegramController {
  private BOT_TOKEN = '8302207022:AAFwi1ISa873CoxxiV_wCglQ6YlAyRIqNk8';
  private envPath = path.resolve(__dirname, '../../.env'); // .env fayl joyi

  @Get('last-message')
  async getLastMessage() {
    try {
      const url = `https://api.telegram.org/bot${this.BOT_TOKEN}/getUpdates`;
      const response = await axios.get(url);

      const updates = response.data.result;
      if (!updates || updates.length === 0) {
        return { message: 'Hali xabar yo‘q' };
      }

      const lastMessage = updates[updates.length - 1].message.text;
      const lastMessageLine = `LAST_MESSAGE=${JSON.stringify(lastMessage)}`;

      // .env faylni o‘qish
      let envContent = '';
      if (fs.existsSync(this.envPath)) {
        envContent = fs.readFileSync(this.envPath, 'utf-8');
      }

      // LAST_MESSAGE qatori mavjud bo‘lsa, uni yangilash; yo‘q bo‘lsa, qo‘shish
      if (envContent.includes('LAST_MESSAGE=')) {
        envContent = envContent.replace(/LAST_MESSAGE=.*/g, lastMessageLine);
      } else {
        envContent += `\n${lastMessageLine}`;
      }

      fs.writeFileSync(this.envPath, envContent);

      return { lastMessage };
    } catch (error) {
      console.error(error);
      return { error: 'Xatolik yuz berdi' };
    }
  }
}
