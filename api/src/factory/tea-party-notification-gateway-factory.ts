import { TeaPartyNotificationGateway } from '@/domains/tea-party/applications/tea-party-notification-gateway';
import { SlackTeaPartyNotificationGateway } from '@/domains/tea-party/infrastructures/tea-party-notification-gateway/slack-tea-party-notification-gateway';
import { ParameterError } from '@/errors/parameter-error';

export class TeaPartyNotificationGatewayFactory {
  private static gateway: TeaPartyNotificationGateway;

  static getInstance(): TeaPartyNotificationGateway {
    if (typeof process.env.INCOMMING_WEB_HOOK !== 'string') {
      throw new ParameterError('Incomming Web Hookが未設定です。');
    }

    if (!this.gateway) {
      this.gateway = new SlackTeaPartyNotificationGateway({
        incommingWebHook: process.env.INCOMMING_WEB_HOOK,
      });
    }

    return this.gateway;
  }
}
