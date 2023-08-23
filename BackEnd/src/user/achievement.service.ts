import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class Achievements {
  private data: any;

  constructor() {
    // Read the JSON file and parse its contents
    const jsonData = readFileSync('/app/src/acheivements.json', 'utf8');
    this.data = JSON.parse(jsonData);
  }

  getData(): any {
    return this.data;
  }

  getAchievementById(id: number): any {
    const data = this.getData();
    const achievements = data.achievements;
    const achievement = achievements.find((item: any) => item.id === String(id));
    return achievement;
  }
}
