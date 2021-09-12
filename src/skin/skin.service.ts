import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from '@node-steam/vdf';
import { Services } from 'src/common/config/configuration';
import { Skin } from './interfaces/skin.interface';

@Injectable()
export class SkinService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async saveSkins(skins: Skin[]): Promise<void> {
    const url = `${this.configService.get<Services>('services').tf2Skin}/skins`;

    await this.httpService
      .post(url, {
        skins,
      })
      .toPromise();
  }

  async getSkins(): Promise<Skin[]> {
    const response = await this.httpService
      .get(
        'https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/resource/tf_proto_obj_defs_english.txt',
      )
      .toPromise();

    const data = parse(response.data);
    const tokens = data.lang.Tokens;

    const skins = [];

    for (const token in tokens) {
      const value = tokens[token];

      if (!token.startsWith('9_')) {
        continue;
      }

      const id = parseInt(token.split('_')[1], 10);

      if (isNaN(id) || value.startsWith(id)) {
        continue;
      }

      skins.push({
        id,
        name: value,
      });
    }

    return skins;
  }
}
