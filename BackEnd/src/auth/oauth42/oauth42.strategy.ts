import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback} from 'passport-42';


@Injectable() 
export class QuaranteDeuxStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
          clientID: `${process.env.client_id}`,
          clientSecret:  `${process.env.client_secret}`,
          callbackURL: `${process.env.callback}`,
        });
      }

      async validate(accessToken: string,refreshToken: string,profile: any, done: VerifyCallback,): Promise<any> {
        const user = profile;
        done(null, user);
      }
}