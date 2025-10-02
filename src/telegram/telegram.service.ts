import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TelegramService implements OnModuleInit {
  private BOT_TOKEN = '8302207022:AAFwi1ISa873CoxxiV_wCglQ6YlAyRIqNk8';
  private envPath = path.resolve(__dirname, '../../.env');

  async updateLastMessage() {
    try {
      const url = `https://api.telegram.org/bot${this.BOT_TOKEN}/getUpdates`;
      const response = await axios.get(url);
      const updates = response.data.result;
      if (!updates || updates.length === 0) return;

      const lastMessage = updates[updates.length - 1].message.text;
      const lastMessageLine = `LAST_MESSAGE=${JSON.stringify(lastMessage)}`;

      let envContent = '';
      if (fs.existsSync(this.envPath)) {
        envContent = fs.readFileSync(this.envPath, 'utf-8');
      }

      if (envContent.includes('LAST_MESSAGE=')) {
        envContent = envContent.replace(/LAST_MESSAGE=.*/g, lastMessageLine);
      } else {
        envContent += `\n${lastMessageLine}`;
      }

      fs.writeFileSync(this.envPath, envContent);
      console.log('LAST_MESSAGE yangilandi:', lastMessage);
    } catch (error) {
      console.error('Xatolik:', error.message);
    }
  }

  onModuleInit() {
    this.updateLastMessage(); // dastlab bir marta
    setInterval(() => this.updateLastMessage(), 1000);
  }
}
